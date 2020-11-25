require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const util = require("util");

const mkdir = util.promisify(fs.mkdir);

async function setUp() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const now = generateNewDate();
  console.log("Starting browser now - ", now);
  console.log(`Writing screenshots to ${__dirname}/screenshots/${now}`);

  await mkdir(`screenshots/${now}`);

  return { page, now, browser };
}

function generateNewDate() {
  return new Date().toLocaleTimeString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

module.exports = { setUp };
