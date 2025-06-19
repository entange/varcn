import { exitWithError } from "./basic";
import { portSchema } from "./schema";

export const validatePort = (port: number): number => {
  const parsedPort = portSchema.safeParse(port);

  if (!parsedPort.success) {
    return exitWithError(`Invalid port: ${port}. Please provide a valid port number.`);
  }

  return parsedPort.data;
};
