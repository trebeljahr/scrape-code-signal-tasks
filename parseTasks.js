const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);

async function parseTasks(page, links, now) {
  await parseSingleTask(page, links[0], now);
}

async function parseSingleTask(page, url, now) {
  await page.goto(url, { waitUntil: "networkidle0" });
  const description = await parseDescription(page, now);
  await createMarkdownFile(description, `./out/${now}/firstTask.md`);
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

async function createMarkdownFile(description, path) {
  await writeFile(path, description, { flag: "wx" });
}

module.exports = { parseTasks };
