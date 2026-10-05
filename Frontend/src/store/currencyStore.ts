import { create } from 'zustand';
import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', rateVsUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', rateVsUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', rateVsUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee', rateVsUSD: 83.3 },
  JPY: { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rateVsUSD: 154.5 },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', rateVsUSD: 1.37 },
  AUD: { code: 'AUD', symbol: 'AU$', label: 'Australian Dollar', rateVsUSD: 1.53 }
};

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatAmount: (amountInUSD: number, showDecimals?: boolean) => string;
  convertAmount: (amountInUSD: number) => number;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: (localStorage.getItem('ft_currency') as CurrencyCode) || 'USD',
  
  setCurrency: (currency: CurrencyCode) => {
    localStorage.setItem('ft_currency', currency);
    set({ currency });
  },

  convertAmount: (amountInUSD: number) => {
    const config = CURRENCIES[get().currency] || CURRENCIES.USD;
    return amountInUSD * config.rateVsUSD;
  },

  formatAmount: (amountInUSD: number, showDecimals = true) => {
    const config = CURRENCIES[get().currency] || CURRENCIES.USD;
    const converted = amountInUSD * config.rateVsUSD;
    
    return `${config.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })}`;
  }
}));
