const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

async function parseTasks(page, links, now) {
  for (let i = 0; i < links.length; i++) {
    console.log(links[i]);
    await parseSingleTask(page, links[i], now);
  }
}

async function parseSingleTask(page, url, now) {
  await page.goto(url, { waitUntil: "networkidle0" });
  const title = await parseTitle(page, now);
  const description = await parseDescription(page, now);
  await mkdir(`./out/${now}/${title}`);
  const path = `./out/${now}/${title}/README.md`;
  await createMarkdownFile(description, title, url, path);
}

async function parseTitle(page, now) {
  const taskTitleSelector = "div.task-title--header";
  await page.waitForSelector(taskTitleSelector);
  await page.screenshot({ path: `screenshots/${now}/task-0.png` });
  const title = await page.$eval(taskTitleSelector, (element) => {
    return element.innerText;
  });
  console.log(title);
  return title;
}

async function parseDescription(page, now) {
  const taskDescriptionSelector = "div.markdown.-arial";
  await page.waitForSelector(taskDescriptionSelector);
  await page.screenshot({ path: `screenshots/${now}/task-0.png` });
  const description = await page.$eval(taskDescriptionSelector, (element) => {
    return element.innerHTML;
  });
  console.log(description);
  return description;
}

async function createMarkdownFile(description, title, link, path) {
  const header = `
    # Task - ${title}

    [Do it yourself here!](${link})

    `;
  await writeFile(path, header + description, { flag: "wx" });
}

module.exports = { parseTasks };
