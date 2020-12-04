const { setUp } = require("./setup");
const { fetchLinks, filterLinks } = require("./fetchLinks");
const { login } = require("./login");
const { parseTasks } = require("./parseTasks");

(async () => {
  const { page, browser } = await setUp();
  await login(page);
  const links = await fetchLinks(page);
  const shouldFilter = !process.argv.includes("parseAll");
  const linksToParse = shouldFilter ? filterLinks(links) : links;
  await parseTasks(page, linksToParse);
  await browser.close();
})();
