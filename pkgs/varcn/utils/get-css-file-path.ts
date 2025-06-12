import fs from "fs";
import path from "path";

export const getCSSFilePath = (file: string): string => {
  const cwd = process.cwd();
  console.log(`> current working directory: ${cwd}\n`);

  if (file) {
    const cssFilePath = path.resolve(cwd, file);
    if (fs.existsSync(cssFilePath)) {
      return cssFilePath;
    }
    console.error(`? css file not found: ${cssFilePath}`);
  }

  console.log("> checking for components.json...");
  const componentsJsonPath = path.join(cwd, "components.json");
  if (fs.existsSync(componentsJsonPath)) {
    console.log(`> found components.json at: ${componentsJsonPath}`);

    const componentsJson = JSON.parse(fs.readFileSync(componentsJsonPath, "utf-8"));
    if (componentsJson.tailwind && componentsJson.tailwind.css) {
      const cssFilePath = path.resolve(cwd, componentsJson.tailwind.css);
      if (fs.existsSync(cssFilePath)) {
        console.log(`> found css file in components.json: ${cssFilePath}`);
        return cssFilePath;
      }

      console.error(`? css file specified in components.json not found: ${cssFilePath}`);
      process.exit(1);
    }
    console.error(`? components.json found, but no css file specified.`);
    process.exit(1);
  }

  console.error("? components.json not found in the current directory.");

  console.error(
    `? no css file provided and components.json not found. please provide a css file or ensure components.json exists in the current directory.`,
  );

  process.exit(1);
};
