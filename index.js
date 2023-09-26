const replace = require("replace-in-file");
const path = require("path");
const fs = require("fs-extra");

const FeatureSection1 = "FeatureSection1";
const FeatureSection2 = "FeatureSection2";
const FeatureSection3 = "FeatureSection3";
const FeatureSection4 = "FeatureSection4";
const HeroSection1 = "HeroSection1";
const HeroSection2 = "HeroSection2";
const Stats1 = "Stats1";
const Stats2 = "Stats2";
const Stats3 = "Stats3";
const Testimonials1 = "Testimonials1";
const Testimonials2 = "Testimonials2";
const Testimonials3 = "Testimonials3";

const layouts = [HeroSection1, FeatureSection1, Stats2, Testimonials3];

(async () => {
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

  console.log(importLinks);
  console.log(components);

  try {
    await replace({
      files: "./demos/nextjs13/src/app/page.js",
      from: /\/\/R_IMPORT_START(.|\r|\n)*\/\/R_IMPORT_END/gm,
      to: `//R_IMPORT_START
${importLinks.join(";\r\n")}
//R_IMPORT_END
    `,
    });

    const results = await replace({
      files: "./demos/nextjs13/src/app/page.js",
      from: /\/\/R_CONTENT_START(.|\r|\n)*\/\/R_CONTENT_END/gm,
      to: `//R_CONTENT_START
${components.join(`\r\n`)}
//R_CONTENT_END
    `,
    });
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
