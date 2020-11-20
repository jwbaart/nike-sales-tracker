const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url =
  "https://www.nike.com/nl/w/heren-sale-nike-air-max-lifestyle-13jrmz1m67gz3yaepz7yfbz98pddznik1";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const html = await page.content();

  const $ = cheerio.load(html);

  const $products = $(".product-card");
  const productLinkSelector = ".product-card__link-overlay";
  const productTitleSelector = ".product-card__title";
  const searchTitle = "Nike Air Max 90";

  const getProductLink = (i: number, el: any) =>
    $(el).find(productLinkSelector).attr("href");

  const productContainsSearchTitle = (i: number, el: any) =>
    $(el).find(productTitleSelector).text().includes(searchTitle);

  const $productsWithSearchTitle = $products.filter(productContainsSearchTitle);

  const productLinks = $productsWithSearchTitle.map(getProductLink).get();

  console.log("productLinks", productLinks);

  browser.disconnect();
  return;
})();
