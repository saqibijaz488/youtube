import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  // ✅ Currency ko EUR (Euro) set kiya
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 2,
  });

  return (
    <span className={twMerge("text-sm font-semibold text-darkColor", className)}>
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
