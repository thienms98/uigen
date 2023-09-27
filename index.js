const replace = require("replace-in-file");
const path = require("path");
const fs = require("fs-extra");
const express = require("express");

const resourceParentPath = path.join(__dirname, "./resources");
const resourcePath = path.join(resourceParentPath, "tailwindui");
const app = express();
const port = 3232;

app.use(express.json());

app.get("/layouts", async (req, res, next) => {
  const files = fs.readdirSync(resourcePath);
  const filteredFiles = files.map((f) => f.replace(".js", ""));
  res.json({
    tailwindLayouts: filteredFiles,
  });
});

app.post("/generate", async (req, res, next) => {
  const body = req.body;

  try {
    const layouts = body.layouts;

    const destParentFolder = path.join(
      __dirname,
      "./demos/nextjs13/src/app/_components"
    );
    const resourceParentPath = path.join(__dirname, "./resources");
    const resourcePath = path.join(resourceParentPath, "tailwindui");

    await fs.remove(destParentFolder);

    const importLinks = [];
    const components = [];

    // generate file links
    layouts.forEach((section) => {
      const sourceFilePath = path.join(resourcePath, `${section}.js`);
      const destinationPath = path.join(destParentFolder, `${section}.js`);

      fs.copy(sourceFilePath, destinationPath);

      importLinks.push(`import ${section} from '@/components/${section}'`);
      components.push(`<${section} />`);
    });

    console.log(components);
    console.log(importLinks);

    await replace({
      files: "./demos/nextjs13/src/app/page.js",
      from: /{\/\*R_IMPORT_START(.|\r|\n)*R_IMPORT_END\*\/}/gm,
      to: `{/*R_IMPORT_START*/}
          ${importLinks.join(`
          `)}
          {/*R_IMPORT_END*/}`,
    });

    await replace({
      files: "./demos/nextjs13/src/app/page.js",
      from: /{\/\*R_CONTENT_START(.|\r|\n)*R_CONTENT_END\*\/}/gm,
      to: `{/*R_CONTENT_START*/}
          ${components.join(`
          `)}
          {/*R_CONTENT_END*/}`,
    });

    res.json({
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
