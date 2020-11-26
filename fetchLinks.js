const ora = require("ora");
const tasksUrl = "https://app.codesignal.com/profile/trebeljahr/tasks";

async function fetchLinks(page) {
  const spinner = ora("Fetching Tasks").start();
  await page.goto(tasksUrl, { waitUntil: "networkidle0" });
  const links = await fetchRecursively(page);
  spinner.succeed("Done fetching Tasks. Found the following Tasks:");
  console.log(links);
  return links;
}

async function fetchRecursively(page) {
  let allLinks = [];
  while (true) {
    const foundLinks = await findLinks(page);
    allLinks = [...allLinks, ...foundLinks];
    const canGoToNextTask = await goToNextTaskIfPossible(page);
    if (!canGoToNextTask) {
      break;
    }
  }
  return allLinks;
}

async function goToNextTaskIfPossible(page) {
  const nextPageSelector = 'div[aria-label="Go to the next page"]';
  await page.waitForSelector(nextPageSelector);
  const nextPageButton = await page.$(nextPageSelector);
  const className = await page.evaluate((el) => el.className, nextPageButton);
  if (!className.includes("-disabled")) {
    await page.click(nextPageSelector);
    return true;
  }
  return false;
}

async function findLinks(page) {
  const linkSelector = "a.card-task-link";
  await page.waitForSelector(linkSelector);
  const foundLinks = await page.$$eval(linkSelector, (am) =>
    am.filter((e) => e.href).map((e) => e.href)
  );
  return foundLinks;
}
module.exports = { fetchLinks };
