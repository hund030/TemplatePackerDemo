import { exit } from "process";
import { parse } from "yaml";
import * as fs from "fs-extra";
import path from "path";

const BlocksPath = path.resolve(__dirname, "..", "..", "blocks");
const TemplatesPath = path.resolve(__dirname, "..", "..", "scenarios");

interface Template {
  assets: {
    from: string;
    to?: string;
  }[];
  metadata?: {
    scenario: string;
    programmingLanguage: string;
    hosting: string;
  };
}

export const main = async () => {
  const inputs = process.argv.slice(2);
  if (inputs.length !== 1) {
    console.log(
      "Program accepts one and only one argument: template file path."
    );
    exit(-1);
  }

  const templateFile = inputs[0];
  if (!(await fs.pathExists(templateFile))) {
    console.log(`Specified template file: '${templateFile}' does not exist.`);
    exit(-1);
  }
  const template = parse(
    (await fs.readFile(templateFile)).toString()
  ) as Template;
  template.assets.forEach(async (asset) => {
    const from = path.resolve(BlocksPath, asset.from);
    if (!(await fs.pathExists(from))) {
      console.log(`Path does not exists: ${from}`);
    }
    const templateName = path.parse(templateFile).name;
    const to = path.resolve(TemplatesPath, templateName, asset.to ?? "");
    fs.copySync(from, to, { overwrite: true });
  });
};

main();
