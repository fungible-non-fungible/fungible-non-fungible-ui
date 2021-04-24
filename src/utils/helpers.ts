import BigNumber from 'bignumber.js';

export const shortize = (str: string) => `${str.slice(0, 8)}.....${str.slice(-8)}`;

export const convertFromPercentToNumber = (value: number, fullValue: number) => (
  (value * fullValue) / 100
);

export const convertFromNumberToPercent = (value: number, fullValue: number) => (
  (value * 100) / fullValue
);

export const convertToCrypto = (value: number | BigNumber) => {
  if (new BigNumber(value).eq(new BigNumber(0))) {
    return 0;
  }
  return (
    Number(new BigNumber(value).div(1e18).toFormat(4, BigNumber.ROUND_FLOOR, { decimalSeparator: '.' }))
  );
};

export function convertUnits(n: BigNumber, unit: number | BigNumber = 18) {
  return n.div(new BigNumber(10).pow(unit));
}

export const formatName = (name: string) => (
  name.trim().replaceAll(' ', '_')
);
