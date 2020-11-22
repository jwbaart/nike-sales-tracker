import cheerio from "cheerio";
import puppeteer from "puppeteer";

export class ProductExtracted {
  constructor(public id: string, public url: string, public title: string) {}
}

export const extractProductLinks = async (
  pageUrl: string,
  productLinkSelector: string,
  productTitleSelector: string,
  searchTitle: string
): Promise<ProductExtracted[]> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle2" });
  const html = await page.content();
  const $ = cheerio.load(html);

  // TODO: scroll down until all are products are loaded
  const $products = $(".product-card");

  const productContainsSearchTitle = (i: number, el: any) =>
    $(el).find(productTitleSelector).text().includes(searchTitle);

  const extractProductInformation = (i: number, el: any): ProductExtracted => {
    const url: string = $(el).find(productLinkSelector).attr("href") || "";
    const id: string = url.split("/").pop() || "";
    const title: string = $(el).find(productTitleSelector).text() || "";

    return new ProductExtracted(id, url, title);
  };

  const products: ProductExtracted[] = $products
    .filter(productContainsSearchTitle)
    .map(extractProductInformation)
    .get();

  browser.disconnect();
  // return productLinks;
  return products;
};
