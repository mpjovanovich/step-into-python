import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeHighlight = ({
  code,
}: {
  code: string; //
}) => {
  return (
    <SyntaxHighlighter
      language="python"
      style={vscDarkPlus}
      customStyle={{
        display: "inline",
        padding: "0 4px",
        background: "transparent",
      }}
      codeTagProps={{
        style: {
          fontSize: "1.0rem",
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeHighlight;
