export interface CleanCoinTransaction {
  id: string;
  orderId?: string;
  amount: number; // positive = earned, negative = spent
  description: string;
  date: string;
}

export interface LoyaltyState {
  balance: number;
  transactions: CleanCoinTransaction[];
}
