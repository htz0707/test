interface Props {
  symbol: string;
}

export default function TokenOption({ symbol }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <img
        src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`}
        alt={symbol}
        width={20}
        height={20}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://api.iconify.design/ant-design/question-circle-outlined.svg";
        }}
      />
      <span>{symbol}</span>
    </div>
  );
}
