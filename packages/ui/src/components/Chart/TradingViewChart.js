/* eslint-disable react/destructuring-assignment */
import * as React from 'react';

import { widget } from '../../charting_library';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const HEIGHT = 364;

export class TVChartContainer extends React.PureComponent {
  tvWidget = null;

  constructor(props) {
    super(props);
    const { datafeed } = this.props;

    this.state = {
      symbol: 'NOM',
      interval: '1D',
      datafeed,
      containerId: 'tv_chart_container',
      libraryPath: '../../charting_library/',
      custom_css_url: '/tv-chart-styles.css',
      fullscreen: false,
      autosize: false,
      studiesOverrides: {},
    };
  }

  componentDidMount() {
    const { datafeed } = this.props;
    const widgetOptions = {
      symbol: this.state.symbol,
      datafeed,
      interval: this.state.interval,
      container: this.state.containerId,
      library_path: this.state.libraryPath,
      custom_css_url: this.state.custom_css_url,

      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_compare',
        'header_symbol_search',
      ],
      enabled_features: [],
      theme: 'Dark',
      height: HEIGHT,
      width: '100%',
      fullscreen: this.state.fullscreen,
      autosize: this.state.autosize,
      studies_overrides: this.state.studiesOverrides,
      loading_screen: { backgroundColor: '#1a1823' },

      overrides: {
        'paneProperties.bottomMargin': 2,

        'paneProperties.legendProperties.showStudyArguments': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'paneProperties.legendProperties.showStudyValues': false,
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showSeriesOHLC': false,
        'paneProperties.legendProperties.showLegend': false,
        'paneProperties.legendProperties.showBarChange': false,
        'paneProperties.legendProperties.showBackground': false,

        'paneProperties.backgroundType': 'solid',
        'paneProperties.background': '#211d2a',

        'scalesProperties.textColor': '#e1dfea',
        'scalesProperties.fontSize': 11,

        'mainSeriesProperties.candleStyle.upColor': '#7cf9ba',
        'mainSeriesProperties.candleStyle.downColor': '#c75a5a',
        'mainSeriesProperties.candleStyle.drawBorder': false,
        'mainSeriesProperties.candleStyle.wickColor': '#fff',
        'mainSeriesProperties.candleStyle.wickUpColor': '#7cf9ba',
        'mainSeriesProperties.candleStyle.wickDownColor': '#c75a5a',
      },
    };

    // eslint-disable-next-line new-cap
    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    /*
    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute('title', 'Click to show a notification popup');
        button.classList.add('apply-common-tooltip');
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!');
            },
          })
        );

        button.innerHTML = 'Check API';
      });
    });
    */
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
    if (this.state.datafeed) this.state.datafeed.destroy();
  }

  render() {
    return <div id={this.state.containerId} style={{ marginTop: 10, height: HEIGHT }} />;
  }
}
