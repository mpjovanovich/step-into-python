// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { BLANK_REGEX } from "../../../constants";

// interface UseProgramOutputParams {
//   code: string;
//   copyCode: string;
// }

// function renderTemplate(code: string) {
//   // Split the template into parts at each blank placeholder.
//   const parts = code.split(BLANK_REGEX);

//   // Stubs in an input field for each @@ in the template
//   return parts.map((part, i) => (
//     <React.Fragment key={i}>
//       <SyntaxHighlighter
//         language="python"
//         style={vscDarkPlus}
//         customStyle={{
//           display: "inline",
//           padding: "0 4px",
//           background: "transparent",
//         }}
//         codeTagProps={{
//           style: {
//             fontSize: "1.0rem",
//           },
//         }}
//       >
//         {/* The readonly part of the template */}
//         {part}
//       </SyntaxHighlighter>
//       {/* The input field for the user's answer */}
//       {/* Don't render for the last part in the template */}
//       {i < parts.length - 1 && (
//         <span className="inline-flex-wrapper">
//           <input
//             type="text"
//             value={userAnswers[i] ?? ""}
//             onChange={(e) => {
//               // This spreads the current answers into a new array so that we
//               // can mutate it, updates the answer at the current index, and
//               // sets the new array as state for the user's answers.
//               const newAnswers = [...userAnswers];
//               newAnswers[i] = e.target.value;
//               setUserAnswers(newAnswers);
//             }}
//             autoFocus={i === 0}
//             style={{ width: `${template.answers[i]?.length * 10 + 20}px` }}
//           />
//           <span
//             style={{
//               marginLeft: "5px",
//             }}
//           >
//             {userAnswerResults[i] === true && (
//               <MdCheck color="green" style={{ fontSize: "1.2rem" }} />
//             )}
//             {userAnswerResults[i] === false && (
//               <MdClose color="red" style={{ fontSize: "1.2rem" }} />
//             )}
//           </span>
//         </span>
//       )}
//     </React.Fragment>
//   ));
// }

// export function useProgramOutput({ code, copyCode }: UseProgramOutputParams) {
//   return {
//     code,
//     copyCode,
//   };
// }
