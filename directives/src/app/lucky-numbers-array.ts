import { InjectionToken, Provider } from '@angular/core';

export const LUCKY_NUMBERS_TOKEN = new InjectionToken<number[]>(
  'lucky-numbers'
);
const luckyNumbersList: number[] = [3, 4, 7];
export const luckyNumbersProvider: Provider = {
  provide: LUCKY_NUMBERS_TOKEN,
  useValue: luckyNumbersList,
};
