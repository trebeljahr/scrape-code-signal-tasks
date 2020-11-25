const { setUp } = require("./setup");
const { fetchLinks } = require("./fetchLinks");
const { login } = require("./login");
const { parseTasks } = require("./parseTasks");

(async () => {
  const { page, now, browser } = await setUp();
  await login(page, now);
  const links = await fetchLinks(page, now);
  await parseTasks(page, links, now);
  await browser.close();
})();
