const EmulatorWarning = () => {
  return (
    <>
      {import.meta.env.DEV && (
        <div
          style={{
            background: "orange",
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          ⚠️ EMULATOR MODE: Local Data Only
        </div>
      )}
    </>
  );
};

export default EmulatorWarning;
