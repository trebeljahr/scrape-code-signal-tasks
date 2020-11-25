const { setUp } = require("./setup");
const { fetchLinks } = require("./fetchLinks");
const { login } = require("./login");
const { parseTasks } = require("./parseTasks");

(async () => {
  const { page, browser } = await setUp();
  await login(page);
  const links = await fetchLinks(page);
  await parseTasks(page, links);
  await browser.close();
})();
