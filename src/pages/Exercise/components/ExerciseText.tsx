interface ExerciseTextProps {
  description: React.ReactNode;
  instructions: React.ReactNode;
}

// TODO: This should be a dumb view component that only renders the description and instructions.
// Pass in description and instructions; nothing more
// Extract default messaging for first and last steps to a helper function

export const ExerciseText = ({
  description,
  instructions,
}: ExerciseTextProps) => {
  return (
    <>
      <h3>Description</h3>
      {description}
      <h3>Instructions</h3>
      {instructions}
    </>
  );
};
