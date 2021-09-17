import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { dark, light } from 'theme/theme';
import { GlobalStyle } from 'theme/GlobalStyle';
import landingImg from 'assets/images/landing.svg';
import hLogo from 'assets/images/hlogo.svg';
import { FullBackgroundContainer } from '../../components/UI/Container';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function ThemePage({ setTheme }) {
  return (
    <FullBackgroundContainer img={landingImg}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={hLogo} />
      <div style={{ marginTop: 40 }}>Welcome to Haven Social</div>
      <div style={{ margin: 10 }}>Please choose light or dark setting</div>
      <ButtonDiv>
        <button type="button" style={{ marginRight: 10 }} onClick={() => setTheme('light')}>
          light
        </button>
        <button type="button" style={{ marginLeft: 10 }} onClick={() => setTheme('dark')}>
          dark
        </button>
      </ButtonDiv>
    </FullBackgroundContainer>
  );
}

export function HavenTheme({ children }) {
  const [theme, updateTheme] = useState();
  const [trigger, updateTrigger] = useState(false);

  const setTheme = newTheme => {
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      updateTheme(dark);
    } else {
      updateTheme(light);
    }
  };

  useEffect(() => {
    const themeStorage = localStorage.getItem('theme');

    if (themeStorage) {
      if (themeStorage === 'dark') {
        updateTheme(dark);
      } else {
        updateTheme(light);
      }
    } else updateTrigger(true);
  }, []);

  if (theme) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    );
  }

  if (trigger) {
    return <ThemePage setTheme={setTheme} trigger={trigger} data-testid="theme-page" />;
  }

  return null;
}
