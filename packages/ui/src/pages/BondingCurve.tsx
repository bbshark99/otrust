import React, { useState } from 'react';
import styled from 'styled-components';
import { Steps } from 'intro.js-react';
import { useCookies } from 'react-cookie';
import { useMediaQuery } from 'react-responsive';

import { PrimaryButton } from 'components/Modals/styles';
import Sidebar from 'components/Sidebar/Sidebar';
import Bonding from 'components/Bonding';
import { Container, Dimmer } from 'components/UI';
import { responsive } from 'theme/constants';
import welcome from 'assets/onboarding/welcome.svg';
import panel from 'assets/onboarding/panel.svg';
import prices from 'assets/onboarding/prices.svg';
import bondingCurve from 'assets/onboarding/bonding-curve.svg';

const BondingCurveContainer = styled(Container)`
  @media screen and (max-width: ${responsive.tablet}) {
    padding-bottom: 140px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding-bottom: 0;
  }
`;

const BondingCurveLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 375px;
  gap: 6px;

  @media screen and (max-width: ${responsive.laptop}) {
    grid-template-columns: 1fr 290px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    grid-template-columns: 1fr 270px;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    display: flex;
    flex-direction: column-reverse;
    grid-template-columns: none;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    gap: 0;
    flex-direction: column;

    padding: 0;
  }
`;

const Modal = styled.div`
  width: 400px;
  max-width: 100%;
  height: auto;
  margin: 0 auto;

  position: absolute;
  top: 50%;
  left: 50%;

  background-color: #201d2a;
  border-radius: 8px;

  transform: translate(-50%, -50%);

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    top: 50px;
    left: 20px;
    position: relative;

    transform: none;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    width: calc(100% - 40px);
    margin: 20px;

    top: 0;
    left: 0;
  }
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 40px 0 20px;

  line-height: 1.2;

  user-select: none;
`;

export default function BondingCurve() {
  const [cookies, setCookie] = useCookies(['visitedBefore']);
  const [accepted, setAccepted] = useState(false);
  const [disclosuresModal, setDisclosureModal] = useState(true);
  const onboardingBreakpoint = useMediaQuery({ minWidth: responsive.laptopSmall });

  const showOnboardingGuide =
    !cookies.visitedBefore && accepted && onboardingBreakpoint && !disclosuresModal;

  return (
    <BondingCurveContainer>
      <BondingCurveLayout>
        {disclosuresModal && !cookies.visitedBefore && (
          <Dimmer>
            <Modal>
              <div className="img-wrapper">
                <img src={welcome} alt="" />
              </div>
              <div className="content">
                <h4>Onomy Bonding Curve Platform</h4>
                <p>Purchase and access NOM, the native utility token of the Onomy Network.</p>

                <p>
                  The Bonding Curve supplies bNOM and ETH, providing liquidity for both purchases
                  and sales.
                </p>

                <p>
                  Bridge bNOM to NOM to access staking rewards, governance, and{' '}
                  <a
                    href="https://docs.onomy.io/nom-distribution/what-is-nom"
                    target="_blank"
                    rel="noreferrer"
                  >
                    more
                  </a>
                  !
                </p>

                <Checkbox>
                  <input
                    type="checkbox"
                    defaultChecked={accepted}
                    onChange={() => setAccepted(!accepted)}
                  />
                  <p>
                    I have read and understood the{' '}
                    <a
                      href="https://docs.onomy.io/nom-distribution/bonding-curve-offering"
                      target="_blank"
                      rel="noreferrer"
                    >
                      documentation and disclosures.
                    </a>
                  </p>
                </Checkbox>
                <PrimaryButton
                  type="button"
                  disabled={!accepted}
                  style={{ marginLeft: 'auto', width: '100%' }}
                  onClick={() => accepted && setDisclosureModal(false)}
                >
                  Continue
                </PrimaryButton>
              </div>
            </Modal>
          </Dimmer>
        )}

        {showOnboardingGuide && (
          <Steps
            enabled
            onExit={() => {
              setCookie('visitedBefore', true);
            }}
            options={{
              showBullets: false,
              tooltipClass: 'onomyOnboarding',
              disableInteraction: 'true',
              scrollTo: 'body',
            }}
            steps={[
              {
                intro: `
                <div class="img-wrapper"><img src=${panel} alt=""/></div>
                <div class="content">
                  <h4>Account Panel</h4>
                  <p>Here you can view your ETH and bNOM balances.
                  <br>
                  <br>
                  After bridging bNOM to NOM, your NOM balance will appear and you may begin staking!
                  </p>
                </div>`,
                element: '#tour-sidebar',
              },
              {
                intro: `
                <div class="img-wrapper"><img src=${prices} alt=""/></div>
                <div class="content">
                  <h4>Prices / Stats</h4>
                  <p>The current price of bNOM and the amount of bNOM that has been issued can be viewed here.</p>
                </div>`,
                element: '#tour-prices',
              },
              {
                intro: `
                <div class="content">
                  <h4>Buy bNOM</h4>
                  <p>Enter the amount of ETH you would like to use to purchase bNOM here. A 1% fee will be applied per trade.</p>
                </div>
              `,
                element: '#tour-buy',
              },
              {
                intro: `
                <div class="content">
                  <h4>Sell bNOM</h4>
                  Enter the amount of bNOM you would like to sell here. A 1% fee will be applied per trade.
                </div>`,
                element: '#tour-sell',
              },
              {
                intro: `
                <div class="img-wrapper"><img src=${bondingCurve} alt=""/></div>
                <div class="content">
                  <h4>Bonding Curve Chart</h4>
                  <p>Choose between the Bonding Curve and TradingView charts to monitor issuance and price of bNOM.</p>
                </div>`,
                element: '#tour-chart',
              },
            ]}
            initialStep={0}
          />
        )}
        <Bonding />
        <Sidebar />
      </BondingCurveLayout>
    </BondingCurveContainer>
  );
}
