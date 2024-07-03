import { loadSchemaFiles } from "npm:@prisma/schema-files-loader@5.17.0-dev.10";
import { exists } from "fs";
import { get_dmmf } from "prisma-schema-wasm";

const SCHEMA_PATH = "./prisma/schema.prisma";

export const main = async () => {
  const result = await readSchema(SCHEMA_PATH);
  if (!result) return;

  const schema = result.schema;
  console.log(schema.schemas);
  const params = JSON.stringify({ prismaSchema: schema.schemas });

  const dmmf = get_dmmf(params);

  // * Do stuff with the dmmf
  console.log(dmmf);
};

type MultipleSchemaTuple = [filename: string, content: string];
type MultipleSchemas = MultipleSchemaTuple[];

type ReadResult =
  | {
      schema: {
        schemaPath: string;
        schemaRootDir: string;
        schemas: MultipleSchemas;
      };
    }
  | undefined;

const readSchema = async (schemaPath: string): Promise<ReadResult> => {
  const isDirectory = await exists(schemaPath, { isDirectory: true });

  return isDirectory ? loadFiles(schemaPath) : undefined;
};

const loadFiles = async (schemaPath: string) => {
  const files = await loadSchemaFiles(schemaPath);

  return {
    schema: { schemaPath, schemaRootDir: schemaPath, schemas: files },
  };
};

main();
