const DevTest = () => {
  // This is just a one-off testing component. Guard in here to make sure
  // nothing ever happens in production, but nothing here should go into
  // source control.
  if (!import.meta.env.DEV) {
    return null;
  }

  // Test stuff here...
};

export default DevTest;
