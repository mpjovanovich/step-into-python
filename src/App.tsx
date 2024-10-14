import React, { useState } from 'react';
import { QuizQuestion, InputType } from './components/QuizQuestion';

const App = () => {
  const [result, setResult] = useState<string | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const handleAnswer = (userInput: string, jsCode: string) => {
    const userJSCode = jsCode.replace('{{}}', userInput);

    try {
      const output = new Function(userJSCode)();
      setResult(output === undefined ? '' : String(output) );
    } catch (error) {
      setResult('Error: Invalid input');
    }

    setLastRunTime(new Date().toLocaleTimeString());
  };

  // This and the jsCode below will eventually be pulled from a database
  // This example doesn't really make sense but... whatever we'll get to real questions later
  const pythonCode = `
x = 5
y = 3

if x {{}} y:
    print('x is greater than y')
`;

const jsCode = `
// //////////////////////////////////////////////////////////////////////////////
// Test a bunch of ways to print text embedded in a string.
// //////////////////////////////////////////////////////////////////////////////
let x = 5;
let y = 3.14159;

// Normal stuff. Have to use template strings since we're using them below.
let bunchOfText = \`test1\n\`;

// Embedded template strings:
bunchOfText += \`x is \${x}\n\`;
bunchOfText += \`y is \${y.toFixed(2)}\n\`;
bunchOfText += \`x in binary: \${x.toString(2).padStart(8, '0')}\n\`;
bunchOfText += \`y as percentage: \${(y * 100).toFixed(2)}%\n\`;

// Tabular format
bunchOfText += \`\n\`
bunchOfText += \`\${'x'.padStart(10, ' ')} \${'y'.padStart(10, ' ')}\n\`;
bunchOfText += \`\${''.padStart(10, '-')} \${''.padStart(10, '-')}\n\`;
bunchOfText += \`\${x.toString().padStart(10, ' ')} \${y.toFixed(2).padStart(10, ' ')}\n\`;

return bunchOfText;
`

  return (
    <div className="App" style={styles.app}>
      <h1 style={styles.title}>Python Operator Quiz</h1>
      <div style={styles.container}>
        <div style={styles.column}>
          <h2>Question</h2>
          <QuizQuestion
            questionTemplate={pythonCode}

            // TEST 1 - Text input
            // inputType={InputType.Text}
            // inputType={InputType.Number}

            // TEST 2 - Multiple choice
            inputType={InputType.Select}
            selectOptions={['==', '!=', '>', '<', '>=', '<=']}

            onAnswer={(userInput) => handleAnswer(userInput, jsCode)}
          />
        </div>
        <div style={styles.column}>
          <h2>Output</h2>
          <div style={styles.output}>
            {result}
            {lastRunTime && (
              <div style={styles.timestamp}>
                Last run: {lastRunTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    textAlign: 'center' as const,
    color: '#333'
  },
  container: {
    display: 'flex',
    gap: '20px'
  },
  column: {
    flex: 1
  },
  output: {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap' as const,
    minHeight: '100px',
  },
  timestamp: {
    marginTop: '10px',
    fontSize: '0.8em',
    color: '#666'
  }
};