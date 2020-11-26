const fs = require("fs");
const util = require("util");
const ora = require("ora");

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
const mkdir = util.promisify(fs.mkdir);

async function parseTasks(page, links) {
  for (let i = 0; i < links.length; i++) {
    await parseSingleTask(page, links[i]);
  }
}

async function parseSingleTask(page, url) {
  const spinner = ora("Fetching task info").start();
  await page.goto(url, { waitUntil: "networkidle0" });
  const title = await parseTitle(page);
  const description = await parseDescription(page);
  const fileEnding = await parseFileEnding(page);
  const solution = await parseSolution(page);

  spinner.start(`Writing files for task: ${title}`);
  await mkdir(`./out/${title}`);
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
  const solutionSelector = "div.view-lines";
  const solutionChildren = "div.view-lines > div >span";
  await page.waitForSelector(solutionSelector);
  await page.waitForSelector(solutionChildren);
  const solutionHTML = await page.$$eval(solutionChildren, (children) =>
    children.map((element) => {
      return element.innerText.replace("&nbsp;", " ");
    })
  );
  return solutionHTML.join("\n");
}

async function createMarkdownFile(description, title, link) {
  const path = `./out/${title}/README.md`;
  const header = `# Task - ${title}

[Do it yourself here!](${link})

`;
  const content = header + description;
  await writeFile(path, content, { flag: "wx" });
}

async function createSolutionFile(solution, title, extension) {
  const path = `./out/${title}/solution${extension}`;
  await writeFile(path, solution, { flag: "wx" });
}

module.exports = { parseTasks };
