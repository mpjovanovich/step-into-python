const CodeInput = ({
  value,
  answer,
  autoFocus,
  onChange,
}: {
  value: string;
  answer: string;
  autoFocus: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      style={{ width: `${answer.length * 10 + 20}px` }}
    />
  );
};

export default CodeInput;
