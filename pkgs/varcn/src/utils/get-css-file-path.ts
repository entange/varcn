import fs from "fs/promises";
import path from "path";
import { exitWithError } from "./basic";

interface ComponentsConfig {
  tailwind?: {
    css?: string;
  };
}

interface CSSFileResult {
  success: true;
  path: string;
}

interface CSSFileError {
  success: false;
  error: string;
}

type CSSFilePathResult = CSSFileResult | CSSFileError;

const COMPONENTS_JSON_FILE = "components.json";

/**
 * Safely checks if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely reads and parses JSON file
 */
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to read or parse JSON file at ${filePath}:`, error);
    return null;
  }
}

/**
 * Validates and resolves CSS file path from direct input
 */
async function resolveCSSFromFile(file: string, cwd: string): Promise<CSSFilePathResult> {
  const cssFilePath = path.resolve(cwd, file);

  if (await fileExists(cssFilePath)) {
    return { success: true, path: cssFilePath };
  }

  return {
    success: false,
    error: `CSS file not found at ${cssFilePath}`,
  };
}

/**
 * Attempts to find CSS file path from components.json
 */
async function resolveCSSFromComponentsJson(cwd: string): Promise<CSSFilePathResult> {
  const componentsJsonPath = path.join(cwd, COMPONENTS_JSON_FILE);

  if (!(await fileExists(componentsJsonPath))) {
    return {
      success: false,
      error: `${COMPONENTS_JSON_FILE} not found in the current directory`,
    };
  }

  console.log(`Found ${COMPONENTS_JSON_FILE} at: ${componentsJsonPath}`);

  const componentsConfig = await readJsonFile<ComponentsConfig>(componentsJsonPath);

  if (!componentsConfig) {
    return {
      success: false,
      error: `Failed to parse ${COMPONENTS_JSON_FILE}`,
    };
  }

  const cssPath = componentsConfig.tailwind?.css;

  if (!cssPath) {
    return {
      success: false,
      error: `${COMPONENTS_JSON_FILE} found, but no CSS file specified in tailwind.css`,
    };
  }

  const cssFilePath = path.resolve(cwd, cssPath);

  if (await fileExists(cssFilePath)) {
    console.log(`Found CSS file in ${COMPONENTS_JSON_FILE}: ${cssFilePath}`);
    return { success: true, path: cssFilePath };
  }

  return {
    success: false,
    error: `CSS file specified in ${COMPONENTS_JSON_FILE} not found: ${cssFilePath}`,
  };
}

/**
 * Gets the CSS file path either from direct input or components.json
 * @param file - Optional direct path to CSS file
 * @returns Promise<string> - Resolved CSS file path
 * @throws Process exits with error if CSS file cannot be found
 */
export const getCSSFilePath = async (file?: string): Promise<string> => {
  const cwd = process.cwd();

  try {
    // Try direct file path first
    if (file?.trim()) {
      const result = await resolveCSSFromFile(file.trim(), cwd);
      if (result.success) {
        return result.path;
      }
      return exitWithError(result.error);
    }

    // Fallback to components.json
    console.log(`No CSS file provided, checking for ${COMPONENTS_JSON_FILE}...`);

    const result = await resolveCSSFromComponentsJson(cwd);
    if (result.success) {
      return result.path;
    }

    return exitWithError(
      `${result.error}. Please provide a CSS file or ensure ${COMPONENTS_JSON_FILE} exists with a valid tailwind.css path.`,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return exitWithError(`Failed to resolve CSS file path: ${errorMessage}`);
  }
};
