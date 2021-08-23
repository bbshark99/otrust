import { createGlobalStyle } from 'styled-components';

import BebasNeueBold from 'assets/fonts/BebasNeueBold.ttf';
import BebasNeueBook from 'assets/fonts/BebasNeueBook.ttf';
import BebasNeueRegular from 'assets/fonts/BebasNeueRegular.ttf';
import { responsive } from './constants';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    position: relative;

    background: linear-gradient(135deg, #16161f, #06060f);

    color: ${props => props.theme.colors.textPrimary};
    font-size: 14px;
    font-family: 'Poppins', sans-serif;

    @media screen and (max-width: ${responsive.laptop}) {
      font-size: 12px;
    }
  }

  html, body {
    min-height: 100%;
  }

  button {
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 300;
    src: url('${BebasNeueBook}') format("truetype");
  }

  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 400;
    src: url('${BebasNeueRegular}') format('truetype');
  }

  @font-face {
    font-family: 'Bebas Neue';
    font-weight: 600;
    src: url('${BebasNeueBold}') format("truetype");
  }

  body {
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    overscroll-behavior: none;
  }

  /* Onboarding */
    .onomyOnboarding {
      display: flex;
      flex-direction: column;

      width: 360px;
      max-width: unset;
      padding: 4px;

      background-color: #201d2a;
      box-shadow: none;

      line-height: 1.6;
      color: #9895a6;

      box-sizing: border-box;

      &.introjs-left {
        transform: translateX(-20px);
      }

      &.introjs-right {
        transform: translateX(20px);
      }

      &.introjs-top, 
      &.introjs-top-left-aligned, 
      &.introjs-top-right-aligned {
        transform: translateY(-20px);
      }

      &.introjs-bottom, 
      &.introjs-bottom-left-aligned, 
      &.introjs-bottom-right-aligned {
        transform: translateY(20px);
      }
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      padding: 25px 0;

      background-color: #1a1623;
      border-radius: 6px 6px 0 0 ;
    }

    .introjs-tooltip-header {
      padding: 0;

      position: absolute;
      top: 10px;
      right: 20px;

      line-height: 1;

      &:hover {
        color: #fff;
      }
    }

    .introjs-skipbutton {
      padding: 5px;

      font-size: 24px;
      color: #9895a6;

      &:hover, &:focus {
        color: #E1DFEB;
      }
    }

    .content {
      padding: 32px 40px;

      h4 {
        margin-bottom: 2em;

        font-family: "Poppins", sans-serif;
        font-size: 16px;
        color: #e1dfeb;
      }

      p {
        font-family: "Poppins", sans-serif;
        color: #9895a6;
      }
    }

    .introjs-tooltiptext {
      padding: 0;
      margin: -4px;

      border-radius: 8px 0 0 8px;
    }

    .introjs-arrow {
      border: 25px solid transparent;
    }

    .introjs-arrow.right {
      right: -50px;
      top: 50%;
      
      border-left-color: #201d2a !important; 

      transform: translateY(-50%);
    }

    .introjs-arrow.bottom {
      bottom: -50px;
      left: 50%;
      
      border-top-color: #201d2a !important; 

      transform: translateX(-50%);
    }

    .introjs-arrow.left {
      left: -50px;
      top: 50%;
      
      border-right-color: #201d2a !important; 

      transform: translateY(-50%);
    }

    .introjs-arrow.top {
      top: -50px;
      left: 50%;
      
      border-bottom-color: #1a1623 !important; 

      transform: translateX(-50%);
    }

    .introjs-helperLayer {
      box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgba(15, 15, 25, 0.925) 0px 0px 0px 5000px,
      inset rgba(255, 221, 160, 1) 0 0 0 3px, rgb(255, 221, 161) 0px 0px 50px 10px !important;
      
      border-radius: 8px !important;
    }

    .introjs-tooltipbuttons {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 32px;

      border: none;
      border-radius: 6px;
      background-color: #1a1823;

      .introjs-prevbutton {
        border: none;
        background: none;

        font-family: "Poppins", sans-serif;
        color: #e1dfeb;
        font-size: 14px;
        text-shadow: none;

        &.introjs-disabled {
          display: none;
        }
      }

      .introjs-nextbutton {
        padding: 16px 40px;
        margin-left: auto;

        background-color: #e1dfeb;
        border: none;

        font-family: "Poppins", sans-serif;
        font-weight: 600;
        text-shadow: none;
        color: #1a1723;
        font-size: 14px;

        &:focus, &:active {
          box-shadow: none;
        }
      }
    }
  /* End Onboarding */
`;
