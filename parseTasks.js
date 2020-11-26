const fs = require("fs");
const util = require("util");
const ora = require("ora");
const mkdirp = require("mkdirp");

const languageToFileEnding = {
  JavaScript: ".js",
  Haskell: ".hs",
  "C++": ".cpp",
  C: ".c",
  Go: ".go",
  TypeScript: ".ts",
  Clojure: ".clj",
  Dart: ".dart",
  Python: ".py",
};

const writeFile = util.promisify(fs.writeFile);

async function mkdirPromisified(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, function (err) {
      if (err) reject();
      else resolve();
    });
  });
}

async function parseTasks(page, links) {
  const pathNames = parseLinksToPaths(links);
  await createDirectories(pathNames);
  console.log(pathNames);

  for (let i = 0; i < links.length; i++) {
    await parseSingleTask(page, links[i]);
  }
}

async function createDirectories(pathNames) {
  for (path in pathNames) {
    await mkdirPromisified(path);
  }
}

function parseLinksToPaths(links) {
  const pathNames = removeDuplicates(links.map(linkToPathName));
  return pathNames;
}

const removeDuplicates = (d) => d.filter(((t = {}), (a) => !(t[a] = a in t)));
const linkToPathName = (link) => urlToPathName(linkToUrl(link));
const linkToUrl = (link) => new URL(link);
const urlToPathName = (url) =>
  ["./out", ...url.pathname.split("/").slice(1, -1)].join("/");

async function parseSingleTask(page, url) {
  const spinner = ora("Fetching task info").start();
  await page.goto(url, { waitUntil: "networkidle0" });
  const title = await parseTitle(page);
  const description = await parseDescription(page);
  const fileEnding = await parseFileEnding(page);
  const solution = await parseSolution(page);

  spinner.start(`Writing files for task: ${title}`);
  await createMarkdownFile(description, title, url);
  await createSolutionFile(solution, title, fileEnding);
  spinner.succeed(`Writing files for task: ${title} successful!`);
}

async function parseTitle(page) {
  const taskTitleSelector = "div.task-title--header";
  await page.waitForSelector(taskTitleSelector);
  const title = await page.$eval(taskTitleSelector, (element) => {
    return element.innerText;
  });
  return title;
}

async function parseDescription(page) {
  const descriptionSelector = "div.markdown.-arial";
  const descriptionChildren = "div.markdown.-arial > p";
  await page.waitForSelector(descriptionSelector);
  await page.waitForSelector(descriptionChildren);
  const description = await page.$eval(descriptionSelector, (element) => {
    return element.innerHTML;
  });
  return description;
}

async function parseFileEnding(page) {
  const languageSelector = "div.select--content > span.select--title";
  await page.waitForSelector(languageSelector);
  const language = await page.$eval(languageSelector, (element) => {
    return element.innerText;
  });
  return language in languageToFileEnding
    ? languageToFileEnding[language]
    : ".txt";
}

async function parseSolution(page) {
  const solutionSelector = "div.view-lines > div:first-child > span";
  const solutionChildren = "div.view-lines > div > span";
  await page.waitForSelector(solutionSelector);
  await page.waitForSelector(solutionChildren);

  await page.click(solutionSelector);
  await page.keyboard.down("Control");
  await page.keyboard.down("A");
  await page.keyboard.press("C");
  await page.keyboard.up("Control");

  const solution = await page.evaluate(() => navigator.clipboard.readText());
  return solution;
}

async function createMarkdownFile(description, title, link) {
  const basePath = `${linkToPathName(link)}/${title}`;
  await mkdirPromisified(basePath);
  const path = `${basePath}/README.md`;
  console.log(path);
  const header = `# Task - ${title}

[Do it yourself here!](${link})

`;
  const content = header + description;
  await writeFile(path, content, { flag: "wx" });
}

async function createSolutionFile(solution, title, extension) {
  const basePath = `${linkToPathName(link)}/${title}`;
  await mkdirPromisified(basePath);
  const path = `${basePath}/solution${extension}`;
  console.log(path);
  await writeFile(path, solution, { flag: "wx" });
}

module.exports = { parseTasks };
