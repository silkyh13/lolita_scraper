const puppeteer = require("puppeteer"); //es6
const lolitaScraper = async (query) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://fril.jp/search/" + query);
  //uses the dom for that page
  const dresses = await page.evaluate(() => {
    const body = document.getElementsByClassName("item");

    return Array.from(body).map((item) => {
      return {
        itemName: item.innerText,
        url: item.getElementsByClassName("link_search_title")[0].href,
        image: item
          .getElementsByClassName("link_search_image")[0]
          .getElementsByTagName("meta")[0]
          .getAttribute("content"),
      };
    });
  });

  await browser.close();
  return dresses;
};

lolitaScraper("Angelic Pretty")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
