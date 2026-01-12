import React, { useMemo } from "react";
import { BoxProps } from "@mui/material";

/** ---------- Types ---------- */

// Explicit blockchain union instead of `any`
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  // FIX: blockchain was missing in the original type
  blockchain: Blockchain;
}

// Extend WalletBalance instead of redefining fields
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

/** ---------- Helpers ---------- */

// FIX: Move helper outside component
// This avoids recreating the function on every render
const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props;

  // Assume hooks are properly typed
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  /** ---------- Sorted balances ---------- */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);

        // FIX:
        // - `lhsPriority` was undefined in the original code
        // - Filtering logic was inverted (kept zero/negative balances)
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        // FIX:
        // Simplified sorting logic
        // Higher priority comes first
        return (
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
        );
      });
  }, [balances]); // FIX: `prices` is not used here, so it should not be a dependency

  /** ---------- Format balances ---------- */
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      // Format amount once instead of formatting during render
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  /** ---------- Render rows ---------- */
  const rows = formattedBalances.map((balance) => {
    const usdValue =
      // Defensive fallback in case price is missing
      (prices[balance.currency] ?? 0) * balance.amount;

    return (
      <WalletRow
        // FIX: Do not use array index as key (list is sorted)
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
