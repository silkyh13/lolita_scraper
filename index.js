const puppeteer = require("puppeteer"); //es6
const lolitaScraper = async (
  brand,
  pageNum = 1,
  sort = "relevance",
  order = "desc"
) => {
  let sortCategory = ["created_at", "sell_price", "relevance"];
  if (!sortCategory.includes(sort))
    throw new Error(
      "Cannot sort by input. Try 'created_at', 'sell_price' or 'relevance'"
    );

  let orderCategory = ["desc", "asc"];
  if (!orderCategory.includes(order))
    throw new Error("Invalid order. Try 'desc' or 'asc'");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(
    "https://fril.jp/search/" +
      brand +
      "/page/" +
      pageNum +
      "?/order=" +
      order +
      "&sort=" +
      sort
  );
  //uses the dom for that page
  const brandName = await page.evaluate(async () => {
    const body = document.getElementsByClassName("item");
    if (body[0].getElementsByClassName("link_related_title")) {
      throw new Error("No results found");
      return;
    }
    return Array.from(body).map((item) => {
      let price = "";
      let priceArr = Array.from(
        item
          .getElementsByClassName("item-box__item-price")[0]
          .getElementsByTagName("span")
      ).map((p) => {
        price += p.innerText;
      });
      let soldRibbon = item.getElementsByClassName("item-box__soldout_ribbon");
      let sold = !!soldRibbon.length;
      return {
        url: item.getElementsByClassName("link_search_title")[0].href,
        image: item
          .getElementsByClassName("link_search_image")[0]
          .getElementsByTagName("meta")[0]
          .getAttribute("content"),
        itemName: item
          .getElementsByClassName("item-box__item-name")[0]
          .getElementsByTagName("span")[0].innerText,
        price: price,
        sold,
      };
    });
  });

  await browser.close();
  return brandName;
};

module.exports = lolitaScraper;
