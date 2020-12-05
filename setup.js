require("dotenv").config();
const ora = require("ora");
const puppeteer = require("puppeteer");
const fs = require("fs");
const util = require("util");
const { parsedLinksPath } = require("./fileExtensions");

const mkdir = util.promisify(fs.mkdir);
const url = "https://app.codesignal.com";

async function setUp() {
  const browser = await puppeteer.launch();
  const context = browser.defaultBrowserContext();
  context.overridePermissions(url, ["clipboard-read", "clipboard-write"]);

  const page = await browser.newPage();
  ora().info(`Saving output files to ./out/`);

  await setupDirectory("out/");
  await setupDirectory("temp/");
  await setupAlreadyParsedLinksFile();
  return { page, browser };
}

async function setupAlreadyParsedLinksFile() {
  if (process.argv.includes("parseAll")) {
    if (fs.existsSync(parsedLinksPath)) {
      await fs.promises.unlink(parsedLinksPath);
    }
    await fs.promises.writeFile(parsedLinksPath);
  }
}
async function setupDirectory(dir) {
  const shouldClean = process.argv.includes("clean");
  if (shouldClean) {
    removeDir(dir);
  }
  if (!fs.existsSync(dir)) {
    await mkdir(dir);
  }
}

const removeDir = function (dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(dir + "/" + filename).isDirectory()) {
          removeDir(dir + "/" + filename);
        } else {
          fs.unlinkSync(dir + "/" + filename);
        }
      });
      fs.rmdirSync(dir);
    } else {
      fs.rmdirSync(dir);
    }
  } else {
    console.log("Directory path not found.");
  }
};

module.exports = { setUp };
