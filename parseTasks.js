const fs = require("fs");
const util = require("util");
const ora = require("ora");
const mkdirp = require("mkdirp");
const { languageToFileEnding, parsedLinksPath } = require("./fileExtensions");

const writeFile = util.promisify(fs.writeFile);

async function parseTasks(page, links) {
  if (links.length === 0) {
    console.log("You should have already parsed all files");
    console.log(
      "To parse all files regardless of which have been parsed before run script again like this: "
    );
    console.log("npm start parseAll");
    return;
  }

  console.log(links);
  const file = fs.createWriteStream(parsedLinksPath);
  for (let i = 0; i < links.length; i++) {
    await parseSingleTask(page, links[i]);
    file.write(links[i] + "\n");
  }
  file.end();
}

const linkToPathName = (link) => urlToPathName(linkToUrl(link));
const linkToUrl = (link) => new URL(link);
const urlToPathName = (url) =>
  ["./out", ...url.pathname.split("/").slice(1, -1)].join("/");

async function parseSingleTask(page, link) {
  const spinner = ora("Fetching task info").start();
  await page.goto(link, { waitUntil: "networkidle0" });
  const title = await parseTitle(page);
  const description = await parseDescription(page);
  const fileEnding = await parseFileEnding(page);
  const solution = await parseSolution(page);

  spinner.start(`Writing files for task: ${title}`);
  const basePath = `${linkToPathName(link)}/${title}`;
  await mkdirp(basePath);
  await createMarkdownFile(description, basePath, title, link);
  await createSolutionFile(solution, basePath, fileEnding);
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

async function createMarkdownFile(description, basePath, title, link) {
  const path = `${basePath}/README.md`;
  const header = `# Task - ${title}

[Do it yourself here!](${link})

`;
  const content = header + description;
  await writeFile(path, content, { flag: "a+" });
}

async function createSolutionFile(solution, basePath, extension) {
  const path = `${basePath}/solution${extension}`;
  await writeFile(path, solution, { flag: "a+" });
}

module.exports = { parseTasks };
