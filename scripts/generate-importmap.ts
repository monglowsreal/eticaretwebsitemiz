import { sanitizeConfig } from "payload";
import configPromise from "../payload.config";

async function main() {
  // @ts-expect-error internal payload generator
  const { generateImportMap } = await import(
    "../node_modules/payload/dist/bin/generateImportMap/index.js"
  );
  const config = await configPromise;
  await generateImportMap(config);
  console.log("✅ ImportMap generated successfully.");
}

main().catch((err) => {
  console.error("Error generating import map:", err);
  process.exit(1);
});
