import cheerio from "cheerio";
import puppeteer from "puppeteer";

export const extractProductLinks = async (
  url: string,
  productLinkSelector: string,
  productTitleSelector: string,
  searchTitle: string
): Promise<string[]> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  const html = await page.content();
  const $ = cheerio.load(html);
  const $products = $(".product-card");
  const getProductLink = (i: number, el: any) =>
    $(el).find(productLinkSelector).attr("href");

  const productContainsSearchTitle = (i: number, el: any) =>
    $(el).find(productTitleSelector).text().includes(searchTitle);

  const productLinks = $products
    .filter(productContainsSearchTitle)
    .map(getProductLink)
    .get();

  browser.disconnect();
  return productLinks;
};
