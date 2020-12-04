const { setUp } = require("./setup");
const { fetchLinks, filterLinks } = require("./fetchLinks");
const { login } = require("./login");
const { parseTasks } = require("./parseTasks");

(async () => {
  const { page, browser } = await setUp();
  await login(page);
  const links = await fetchLinks(page);
  await parseTasks(page, filterLinks(links));
  await browser.close();
})();
