import { exit } from "process";
import { parse } from "yaml";
import * as fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const BlocksPath = path.resolve(__dirname, "..", "..", "assets");
const TemplatesPath = path.resolve(__dirname, "..", "..", "scenarios");
const DefinitionsPath = path.resolve(__dirname, "..", "..", "definitions");

yargs(hideBin(process.argv))
  .command(
    "generate [yaml]",
    "generate templates based on the definition yaml file",
    (yargs: any) => {
      return yargs.positional("yaml", {
        describe: "template definition",
      });
    },
    (argv: any) => {
      if (argv.yaml) {
        reGenerate(argv.yaml);
      }
      if (argv.all) {
        generateAll();
      }
    }
  )
  .check((argv: any) => {
    if (!argv.yaml && !argv.all) {
      throw new Error();
    }
    if (argv.yaml && argv.all) {
      throw new Error();
    }
    if (argv.yaml && !fs.pathExistsSync(argv.yaml)) {
      throw new Error();
    }
    return true;
  })
  .option("all", {
    alias: "a",
    type: "boolean",
    description: "Re-generate all templates",
  })
  .parse();

interface Template {
  assets: {
    copyFrom: string;
    to?: string;
  }[];
  metadata?: {
    scenario: string;
    programmingLanguage: string;
    hosting: string;
  };
}

async function generateAll(): Promise<void> {
  return fs.readdir(
    DefinitionsPath,
    async (error: NodeJS.ErrnoException, filenames: string[]) => {
      if (error) {
        console.error(error.toString());
      }
      await Promise.all(
        filenames
          .filter((filename) => path.extname(filename) === ".yaml")
          .map((filename) =>
            reGenerate(path.resolve(DefinitionsPath, filename))
          )
      );
    }
  );
}

async function reGenerate(definitionFile: string): Promise<void> {
  return remove(parseTemplateName(definitionFile)).then(() => {
    generate(definitionFile);
  });
}

function parseTemplateName(definitionFile: string): string {
  return path.parse(definitionFile).name;
}

async function remove(templateName: string): Promise<void> {
  const templateDir = path.resolve(TemplatesPath, templateName);
  if (!(await fs.pathExists(templateDir))) {
    return;
  }
  await fs.remove(templateDir);
}

async function generate(definitionFile: string): Promise<void> {
  if (!(await fs.pathExists(definitionFile))) {
    console.log(`Specified template file: '${definitionFile}' does not exist.`);
    exit(-1);
  }
  const template = parse(
    (await fs.readFile(definitionFile)).toString()
  ) as Template;
  template.assets.forEach(async (asset) => {
    const from = path.resolve(BlocksPath, asset.copyFrom);
    if (!(await fs.pathExists(from))) {
      console.log(`Path does not exists: ${from}.`);
    }
    const templateName = path.parse(definitionFile).name;
    const to = path.resolve(TemplatesPath, templateName, asset.to ?? "");
    // console.debug(`Copy ${from} to ${to}.`);
    fs.copySync(from, to, { overwrite: true });
  });
}
