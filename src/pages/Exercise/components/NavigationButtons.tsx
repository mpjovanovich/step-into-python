import { Link } from "react-router-dom";
import styles from "../ExercisePage.module.css";
import { type ButtonState } from "../hooks/useNavigationButtons";

// This is a dumb view component that renders the navigation buttons.
// There should be no logic here.
const NavigationButtons = ({
  buttons,
  canFocus,
  exerciseComplete,
}: {
  buttons: ButtonState[];
  canFocus: boolean;
  exerciseComplete: boolean;
}) => {
  return (
    <div className={styles.buttonContainer}>
      {buttons
        .filter((button) => button.visible)
        .map((button) => (
          <button
            key={button.text}
            className={styles.actionButton}
            onClick={button.onClick}
            disabled={!button.enabled}
            autoFocus={canFocus && button.hasFocus}
          >
            {button.text}
          </button>
        ))}
      <>
        {exerciseComplete && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className={styles.actionButton} autoFocus={true}>
              Home
            </button>
          </Link>
        )}
      </>
    </div>
  );
};

export default NavigationButtons;
