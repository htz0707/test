import { useEffect, useState } from "react";

interface PriceItem {
  currency: string;
  price: number;
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data: PriceItem[] = await res.json();

        const map: Record<string, number> = {};

        data.forEach((item) => {
          if (
            item.currency &&
            typeof item.price === "number" &&
            !Number.isNaN(item.price) &&
            map[item.currency] === undefined
          ) {
            map[item.currency] = item.price;
          }
        });

        setPrices(map);
      } catch {
        setPrices({});
      }
    };

    fetchPrices();
  }, []);

  return prices;
}
