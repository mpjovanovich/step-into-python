const ExerciseText = ({
  description,
  instructions,
}: {
  description: React.ReactNode;
  instructions: React.ReactNode;
}) => {
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
