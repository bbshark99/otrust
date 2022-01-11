import { EventEmitter } from 'events';

import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { BigNumber } from 'bignumber.js';

import {
  ErrorCallback,
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from 'charting_library/charting_library';

const WNOM_HISTORICAL_DATA_QUERY = gql`
  query transactions($filter: String!, $skipped: Int!, $first: Int, $from: Int, $to: Int) {
    wnomhistoricalFrames(
      first: $first
      skip: $skipped
      where: { type: $filter, startTime_lte: $to }
      orderBy: startTime
      orderDirection: desc
    ) {
      startTime
      endTime
      startPrice
      endPrice
      minPrice
      maxPrice
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PERIOD_MAP = {
  '1': 'Minute',
  '15': 'QuarterHour',
  '60': 'Hour',
  '480': 'QuarterDay',
  '1D': 'Day',
  '1W': 'Week',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOM_SYMBOL_INFO: LibrarySymbolInfo = {
  name: 'NOM',
  full_name: 'NOM',
  description: 'NOM',
  exchange: 'EthBondCurve',
  listed_exchange: 'EthBondCurve',
  format: 'price',
  has_intraday: true,
  has_no_volume: true,
  has_seconds: false,
  has_ticks: false,
  has_daily: true,
  has_empty_bars: true,
  data_status: 'streaming',
  original_currency_code: 'ETH',
  currency_code: 'ETH',
  // @ts-ignore
  supported_resolutions: Object.keys(PERIOD_MAP),
  intraday_multipliers: Object.keys(PERIOD_MAP),
  //supported_resolutions: [],
  ticker: 'NOM',
  timezone: 'Etc/UTC',
  type: 'crypto',
  session: '24x7',
  minmov: 1,
  pricescale: 10000000000,
};

function formatPrice(price: string) {
  return new BigNumber(price).shiftedBy(-18).toFixed(10);
}

type BarSubscription = {
  symbolInfo: LibrarySymbolInfo;
  resolution: ResolutionString;
  onTick: SubscribeBarsCallback;
  listenerGuid: string;
  onResetCacheNeededCallback: () => void;
};

// @ts-ignore
export class ChartData implements IDatafeedChartApi {
  private apolloClient: ApolloClient<NormalizedCacheObject>;

  private web3Library: EventEmitter;

  private barSubs: Record<string, BarSubscription>;

  private lastBlock = 0;

  private lastTick: Record<string, number>;

  constructor(apolloClient: ApolloClient<NormalizedCacheObject>, web3Library: EventEmitter) {
    this.apolloClient = apolloClient;
    this.web3Library = web3Library;
    this.barSubs = {};
    this.lastTick = {};
    this.onBlockMined = this.onBlockMined.bind(this);
    this.web3Library.on('block', this.onBlockMined);
  }

  private async onBlockMined(bnum: number) {
    if (bnum <= this.lastBlock) return;
    this.lastBlock = bnum;
    const subs = Object.values(this.barSubs);
    // console.log('block mined', bnum);

    // TODO: may make sense to wait 1-2 seconds to give graph time to update?

    // eslint-disable-next-line no-restricted-syntax
    for (const { symbolInfo, resolution, onTick } of subs) {
      this.getBars(
        symbolInfo,
        resolution,
        { countBack: 1, from: 0, to: 0, firstDataRequest: false },
        res => {
          const last = res.pop();
          // console.log('last', this.lastTick[resolution], resolution, last);
          if (last) onTick(last);
        },
        // eslint-disable-next-line no-console
        err => console.error(err)
      );
    }
  }

  public destroy() {
    this.web3Library.removeListener('block', this.onBlockMined);
  }

  public onReady(cb: OnReadyCallback) {
    // TradingView requires this setTimeout
    setTimeout(
      () =>
        cb({
          exchanges: [
            {
              value: NOM_SYMBOL_INFO.exchange,
              name: NOM_SYMBOL_INFO.exchange,
              desc: NOM_SYMBOL_INFO.exchange,
            },
          ],
          symbols_types: [
            {
              value: NOM_SYMBOL_INFO.type,
              name: NOM_SYMBOL_INFO.type,
            },
          ],
          supported_resolutions: NOM_SYMBOL_INFO.supported_resolutions,
          currency_codes: ['ETH'],
          units: {},
          supports_marks: false,
          supports_timescale_marks: false,
          supports_time: true,
        }),
      0
    );
  }

  public async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ) {
    onResult([
      {
        symbol: NOM_SYMBOL_INFO.ticker!,
        full_name: NOM_SYMBOL_INFO.name,
        description: NOM_SYMBOL_INFO.description,
        exchange: NOM_SYMBOL_INFO.exchange,
        ticker: NOM_SYMBOL_INFO.ticker!,
        type: NOM_SYMBOL_INFO.type,
      },
    ]);
  }

  resolveSymbol(symbolName: string, onSuccess: ResolveCallback) {
    // TradingView requires this setTimeout
    setTimeout(() => onSuccess(NOM_SYMBOL_INFO), 0);
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) {
    // console.log('periodParams', periodParams);
    try {
      const resp = await this.apolloClient.query({
        query: WNOM_HISTORICAL_DATA_QUERY,
        variables: {
          // @ts-ignore
          filter: PERIOD_MAP[resolution] || 'Hour',
          skipped: 0,
          from: Math.round(periodParams.from),
          to: Math.round(periodParams.to || 60 + new Date().getTime() / 1000),
          first: Math.min(1000, periodParams.countBack),
        },
      });

      const {
        data: { wnomhistoricalFrames: frames },
      } = resp;

      const bars = frames
        .slice()
        .reverse()
        .map(
          (frame: {
            startTime: any;
            startPrice: any;
            maxPrice: any;
            minPrice: any;
            endPrice: any;
          }) => {
            const time = parseInt(frame.startTime, 10) * 1000;
            if (!this.lastTick[resolution] || this.lastTick[resolution] < time) {
              this.lastTick[resolution] = time;
            }

            return {
              time,
              open: formatPrice(frame.startPrice),
              high: formatPrice(frame.maxPrice),
              low: formatPrice(frame.minPrice),
              close: formatPrice(frame.endPrice),
              volume: 0,
            };
          }
        );
      if (bars.length > 0) {
        onResult(bars, { noData: false });
      } else {
        onResult([], { noData: true });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      onError(`${e}`);
    }
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) {
    this.barSubs[listenerGuid] = {
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
    };
  }

  public unsubscribeBars(listenerGuid: string) {
    delete this.barSubs[listenerGuid];
  }
}
