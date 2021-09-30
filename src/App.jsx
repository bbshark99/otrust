import React from 'react';
import { ThemeProvider } from 'styled-components';
import { CookiesProvider } from 'react-cookie';

import MainHeader from 'components/MainHeader';
import BondingCurve from 'pages/BondingCurve';
import { darkNew } from 'theme/theme';
import { GlobalStyle } from 'theme/GlobalStyle';
import { AutoLogin } from 'context/AutoLogin';
import ChainProvider from 'context/chain/ChainContext';
import ExchangeProvider from 'context/exchange/ExchangeContext';
import ModalProvider from 'context/modal/ModalContext';
import './assets/font-faces.css';

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={darkNew}>
        <AutoLogin>
          <ChainProvider theme={darkNew}>
            <ExchangeProvider>
              <ModalProvider>
                <GlobalStyle />
                <MainHeader />
                <BondingCurve />
              </ModalProvider>
            </ExchangeProvider>
          </ChainProvider>
        </AutoLogin>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
