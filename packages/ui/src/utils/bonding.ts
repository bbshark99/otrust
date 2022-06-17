const a = 100000000;

export function priceAtSupply(supply: number) {
  return (supply / a) ** 2;
}

// Bonding curve price at specified supply
export function supplyAtPrice(price: number) {
  //#NOM Sold = sqrt(ETH/NOM) * a
  return Math.sqrt(price) * a;
}

// NOM supply range to ETH
export function NOMsupplyETH(supplyTop: number, supplyBot: number) {
  // Integrate over curve to get amount of ETH needed to buy amount of NOM
  // ETH = a/3((supplyNOM_Top/a)^3 - (supplyNOM_Bot/a)^3)
  return (a / 3) * ((supplyTop / a) ** 3 - (supplyBot / a) ** 3);
}

// Returns Buy Quote for the purchase of NOM based on amount of ETH
// Parameters:
// Input
// amount: amount of ETH
// Output
// output: amount of NOM
export function ETHtoNOM(amount: number, supply: number) {
  const price = priceAtSupply(supply);
  // 1. Determine supply bottom
  // Price bottom is 1% above priceBondCurve
  const priceBot = price * 1.01;
  const supplyBot = supplyAtPrice(priceBot);
  // 2. Integrate over curve, and solve for supply top
  // (3*ETH/a + (supplyNOM_Bot/a)^3)^(1/3)
  const supplyTop = a * ((3 * amount) / a + supplyBot ** 3 / a ** 3) ** (1 / 3);
  // 3. Subtract supply bottom from top to get amount NOM for amount ETH
  const diff = supplyTop - supplyBot;
  return { supplyBot, supplyTop, diff };
}

// Returns Sell Quote: NOM for ETH (Dec 18)
// Parameters:
// Input
// uint256 amountNOM: amount of NOM to be sold (18 decimal)
// Output
// uint256: amount of ETH paid in Wei or ETH (18 decimal)
export function NOMtoETH(amount: number, supplyTop: number) {
  const supplyBot = supplyTop - amount;
  const diff = 0.99 * NOMsupplyETH(supplyTop, supplyBot);
  return { supplyBot, supplyTop, diff };
}
