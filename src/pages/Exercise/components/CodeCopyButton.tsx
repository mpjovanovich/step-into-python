import styles from "@/pages/Exercise/ExercisePage.module.css";
import { useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

const CodeCopyButton = ({
  copyCode,
}: {
  copyCode: string; //
}) => {
  const [copyText, setCopyText] = useState("Copy");
  return (
    <button
      className={styles.copyButton}
      onClick={() => {
        navigator.clipboard.writeText(copyCode);
        setCopyText("Copied!");
        setTimeout(() => setCopyText("Copy"), 800);
      }}
    >
      {copyText === "Copied!" ? <MdCheck /> : <MdContentCopy />} {copyText}
    </button>
  );
};

export default CodeCopyButton;
