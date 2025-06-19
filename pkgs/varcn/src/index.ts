#!/usr/bin/env node

import { Command } from "commander";
import { version, description, name } from "../package.json";
import { getCSSFilePath } from "@/utils/get-css-file-path";
import { startServer } from "@/utils/start-server";
import { validatePort } from "./utils/validate";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command(name)
  .name(name)
  .description(description)
  .version(version, "-v, --version", "display the version number")
  .option("-p, --port <port>", "port to listen on", "8421")
  .option("-f, --file <css-file-path>", "CSS file to use", "")
  .action(async ({ port, file }) => {
    const serverPort = validatePort(parseInt(port, 10));
    const cssFilePath = await getCSSFilePath(file);

    console.log(`using css file at: ${cssFilePath}`);

    startServer(serverPort, cssFilePath);
  });

program.parseAsync();
