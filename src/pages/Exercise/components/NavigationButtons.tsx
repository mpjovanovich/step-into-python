import { Link } from "react-router-dom";
import styles from "../ExercisePage.module.css";
import { type ButtonState } from "../hooks/useNavigationButtons";

interface NavigationButtonsProps {
  buttons: ButtonState[];
  exerciseComplete: boolean;
}

// This is a dumb view component that renders the navigation buttons.
// There should be no logic here.
export const NavigationButtons = ({
  buttons,
  exerciseComplete,
}: NavigationButtonsProps) => {
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
          >
            {button.text}
          </button>
        ))}
      <>
        {exerciseComplete && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className={styles.actionButton}>Home</button>
          </Link>
        )}
      </>
    </div>
  );
};
