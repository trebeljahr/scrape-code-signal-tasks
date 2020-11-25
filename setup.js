require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const util = require("util");

const mkdir = util.promisify(fs.mkdir);
const rmdir = fs.promises.rmdir;

async function setUp() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(`Saving screenshots to ./screenshots/`);
  console.log(`Saving output files to ./out/`);

  await setupDirectory("screenshots/");
  await setupDirectory("out/");

  return { page, browser };
}

async function setupDirectory(dir) {
  removeDir(dir);
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
