interface ExerciseTextProps {
  description: React.ReactNode;
  instructions: React.ReactNode;
}

const ExerciseText = ({ description, instructions }: ExerciseTextProps) => {
  return (
    <>
      <h3>Description</h3>
      {description}
      <h3>Instructions</h3>
      {instructions}
    </>
  );
};

export default ExerciseText;
