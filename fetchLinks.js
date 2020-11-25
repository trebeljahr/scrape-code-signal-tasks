const tasksUrl = "https://app.codesignal.com/profile/trebeljahr/tasks";

async function fetchLinks(page, now) {
  await page.goto(tasksUrl, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/tasks-page.png` });

  const linkSelector = "a.card-task-link";
  await page.waitForSelector(linkSelector);
  const firstLinks = await page.$$eval(linkSelector, (am) =>
    am.filter((e) => e.href).map((e) => e.href)
  );
  console.log("Fetched first page of links");
  const nextPageSelector = 'div[aria-label="Go to the next page"]';
  await page.waitForSelector(nextPageSelector);
  console.log("Going to next links page");
  await page.click(nextPageSelector);
  await page.waitForSelector(linkSelector);
  const moreLinks = await page.$$eval(linkSelector, (am) =>
    am.filter((e) => e.href).map((e) => e.href)
  );
  console.log("Fetched next page of links");

  const links = [...firstLinks, ...moreLinks];
  console.log("Done. Found links!");
  console.log(links);
}

module.exports = { fetchLinks };
