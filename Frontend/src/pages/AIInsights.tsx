import React from 'react';
import { Analytics } from './Analytics';
import { Transaction } from '../types';

interface AIInsightsProps {
  transactions: Transaction[];
  onOpenQuickAdd: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = (props) => {
  return <Analytics {...props} />;
};
