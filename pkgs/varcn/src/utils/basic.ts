export const exitWithError = (message: string): never => {
  console.error(message);
  process.exit(1);
};
