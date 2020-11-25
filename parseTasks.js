async function parseTasks(page, links, now) {
  await parseSingleTask(page, links[0], now);
}

async function parseSingleTask(page, url, now) {
  await page.goto(url, { waitUntil: "networkidle0" });
  const taskDescriptionSelector = "div.markdown.-arial";
  await page.waitForSelector(taskDescriptionSelector);
  await page.screenshot({ path: `screenshots/${now}/task-0.png` });

  const task = await page.$eval(taskDescriptionSelector, (element) => {
    return element;
  });
  const taskInner = await page.$eval(taskDescriptionSelector, (element) => {
    return element.innerHTML;
  });
  console.log(task);
  console.log(taskInner);
}

module.exports = { parseTasks };
