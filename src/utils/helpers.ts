export const shortize = (str: string) => `${str.slice(0, 8)}.....${str.slice(-8)}`;

export const convertFromPercentToNumber = (value: number, fullValue: number) => (
  (value * fullValue) / 100
);

export const convertFromNumberToPercent = (value: number, fullValue: number) => (
  (value * 100) / fullValue
);
