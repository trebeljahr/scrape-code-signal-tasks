const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

async function parseTasks(page, links) {
  for (let i = 0; i < links.length; i++) {
    console.log(links[i]);
    await parseSingleTask(page, links[i]);
  }
}

async function parseSingleTask(page, url) {
  await page.goto(url, { waitUntil: "networkidle0" });
  const title = await parseTitle(page);
  const description = await parseDescription(page);
  await mkdir(`./out/${title}`);
  const path = `./out/${title}/README.md`;
  await createMarkdownFile(description, title, url, path);
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
  const taskDescriptionSelector = "div.markdown.-arial";
  const taskDescriptionChildren = "div.markdown.-arial > p";
  await page.waitForSelector(taskDescriptionSelector);
  await page.waitForSelector(taskDescriptionChildren);
  await page.screenshot({ path: `screenshots/task-0.png` });
  const description = await page.$eval(taskDescriptionSelector, (element) => {
    return element.innerHTML;
  });
  return description;
}

async function createMarkdownFile(description, title, link, path) {
  const header = `# Task - ${title}

[Do it yourself here!](${link})

`;
  const content = header + description;
  console.log(content);
  await writeFile(path, content, { flag: "wx" });
}

module.exports = { parseTasks };
