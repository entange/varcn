#!/usr/bin/env node

import { Command } from "commander";
import { version, description, name } from "../package.json";
import { getCSSFilePath } from "utils/get-css-file-path";
import { startServer } from "utils/start-server";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command(name)
  .name(name)
  .description(description)
  .version(version, "-v, --version", "display the version number")
  .option("-p, --port <port>", "port to listen on", "8421")
  .option("-f, --file <css-file-path>", "CSS file to use", "")
  .action(({ port, file }) => {
    const cssFilePath = getCSSFilePath(file);

    console.log(`\n> using css file at: ${cssFilePath}`);

    startServer(parseInt(port, 10), cssFilePath);
  });

program.parse();
