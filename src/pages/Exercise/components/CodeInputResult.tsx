import { MdCheck } from "react-icons/md";

const CodeInputResult = ({
  result,
}: {
  result: boolean; //
}) => {
  return (
    <span style={{ marginLeft: "5px" }}>
      {result && <MdCheck color="green" style={{ fontSize: "1.2rem" }} />}
    </span>
  );
};

export default CodeInputResult;
