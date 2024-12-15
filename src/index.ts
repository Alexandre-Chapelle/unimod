import { logger } from "./config";
import { getDirectory, getOptions } from "./prompts";
import { getConversionOptions } from "./prompts/conversion-options";
import { traverseDirectory } from "./utils";
import type {
  SupportedFileExtensions,
  SupportedFileExtensionsUppercase,
} from "./types";

const contructFileExtsRegex = (
  exts: SupportedFileExtensions[] | SupportedFileExtensionsUppercase[]
): RegExp => {
  const formattedExts = exts.map((item) => item.toLowerCase());
  const extensionsPattern = formattedExts.join("|");
  const regexPattern = `^.*\\.(${extensionsPattern})$`;
  return new RegExp(regexPattern, "i");
};

async function start() {
  const targetDir = await getDirectory();
  const { convertFrom, convertTo, installTypes, createInterfaces, addTyping } =
    await getConversionOptions();
  const { backupsEnabled, loggingEnabled } = await getOptions();

  const fileRegex = contructFileExtsRegex(convertFrom);
  const formattedConvertTo = convertTo.toLowerCase() as SupportedFileExtensions;

  if (loggingEnabled) {
    const convertFromStr = convertFrom.join(", ");

    logger.info(
      `Starting conversion of ${convertFromStr} -> ${convertTo} in directory: ${targetDir}`
    );
  }

  await traverseDirectory(
    targetDir,
    loggingEnabled,
    fileRegex,
    formattedConvertTo
  );

  if (loggingEnabled) logger.success("Conversion completed.");
}

async function main() {
  start();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
