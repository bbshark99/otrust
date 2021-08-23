import styled from 'styled-components';
import Sidebar from 'components/Sidebar/Sidebar';
import Bonding from 'components/Bonding';
import { Steps } from 'intro.js-react';
import { useCookies } from 'react-cookie';

import { Container } from 'components/UI';
import { responsive } from 'theme/constants';
import welcome from 'assets/onboarding/welcome.svg';
import panel from 'assets/onboarding/panel.svg';
import prices from 'assets/onboarding/prices.svg';
import bondingCurve from 'assets/onboarding/bonding-curve.svg';

const BondingCurveLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 375px;
  gap: 6px;

  @media screen and (max-width: ${responsive.laptop}) {
    grid-template-columns: 1fr 290px;
  }

  @media screen and (max-width: ${responsive.laptopSmall}) {
    // grid-template-columns: 1fr 250px;
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

export default function BondingCurve() {
  const [cookies, setCookie] = useCookies(['visitedBefore']);

  return (
    <Container>
      <BondingCurveLayout>
        {!cookies.visitedBefore && (
          <Steps
            enabled={true}
            options={{ showBullets: false, tooltipClass: 'onomyOnboarding', disableInteraction: 'true' }}
            steps={[
              {
                intro: `
                <div class="img-wrapper"><img src=${welcome} alt=""/></div>
                <div class="content">
                  <h4>Welcome to Onomy Bonding Curve</h4>
                  <p>
                    Delightful unreserved impossible few estimating men favourable see entreaties. She propriety immediate was improving. He or entrance humoured likewise moderate. Much nor game son say feel. Fat make met can must form into gate. Me we offending prevailed discovery.
                  </p>

                  <p>
                    Of friendship on inhabiting diminution discovered as. Did friendly eat breeding building few nor.
                  </p>
                </div>`,
              },
              {
                intro: `
                <div class="img-wrapper"><img src=${panel} alt=""/></div>
                <div class="content">
                  <h4>Account Panel</h4>
                  <p>Here you can view your ETH and wNOM balances. You also can <strong>Withdraw wNOM</strong> to your Onomy wallet (and create one) from here.</p>
                </div>`,
                element: '#tour-sidebar',
              },
              {
                intro: `
                <div class="img-wrapper"><img src=${prices} alt=""/></div>
                <div class="content">
                  <h4>Prices / Stats</h4>
                  <p>The current price of NOM and the amount of NOM that has been issued can be viewed here.</p>
                </div>`,
                element: '#tour-prices',
              },
              {
                intro: `
                <div class="content">
                  <h4>Buying wNOM</h4>
                  <p>Enter the amount of ETH you would like to use to purchase NOM here. A 1% fee will be applied per trade.</p>
                </div>
              `,
                element: '#tour-buy',
              },
              {
                intro: `
                <div class="content">
                  <h4>Selling wNOM</h4>
                  Enter the amount of NOM you would like to sell here. A 1% fee will be applied per trade.
                </div>`,
                element: '#tour-sell',
              },
              {
                intro: `
                <div class="img-wrapper"><img src=${bondingCurve} alt=""/></div>
                <div class="content">
                  <h4>Bonding Curve Chart</h4>
                  <p>Delightful unreserved impossible few estimating men favourable see entreaties. She propriety immediate was improving. He or entrance humoured likewise moderate. Much nor game son say feel. Fat make met can must form into gate. Me we offending prevailed discovery.</p> 

                  <p>Of friendship on inhabiting diminution discovered as. Did friendly eat breeding building few nor.</p>
                </div>`,
                element: '#tour-chart',
              },
            ]}
            initialStep={0}
            onExit={() => {
              setCookie('visitedBefore', true);
            }}
          />
        )}
        <Bonding />
        <Sidebar />
      </BondingCurveLayout>
    </Container>
  );
}
