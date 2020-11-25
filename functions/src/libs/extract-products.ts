import cheerio from "cheerio";
import puppeteer from "puppeteer";

export class ProductExtracted {
  constructor(
    public id: string,
    public url: string,
    public title: string,
    public imageUrl: string
  ) {}
}

export const extractProductLinks = async (
  pageUrl: string,
  productLinkSelector: string,
  productTitleSelector: string,
  searchTitle: string,
  productImageSelector: string
): Promise<ProductExtracted[]> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "networkidle2" });
  const html = await page.content();
  const $ = cheerio.load(html);

  const productContainsSearchTitle = (i: number, el: any) =>
    $(el).find(productTitleSelector).text().includes(searchTitle);

  const extractProductInformation = (i: number, el: any): ProductExtracted => {
    const url: string = $(el).find(productLinkSelector).attr("href") || "";
    const id: string = url.split("/").pop() || "";
    const title: string = $(el).find(productTitleSelector).text() || "";
    const imageUrl: string = $(el).find(productImageSelector).attr("src") || "";

    return new ProductExtracted(id, url, title, imageUrl);
  };

  const scrollToPageBottom = async () => {
    await page.evaluate((_) => window.scrollTo(0, document.body.scrollHeight));
    return page.waitForTimeout(500);
  };

  const isSpinnerPresent = async () => {
    return await page.evaluate(
      () => !!document.querySelector(".product-grid__items .loader-overlay")
    );
  };

  const scrollToLastProduct = async () => {
    let numberOfRound: number = 0;
    const maxNumberOfRounds: number = 10;
    let spinnerPresent: boolean = true;

    do {
      await scrollToPageBottom();
      spinnerPresent = !!(await isSpinnerPresent());

      console.log("numberOfRound", numberOfRound);
      numberOfRound++;
    } while (spinnerPresent && numberOfRound < maxNumberOfRounds);
  };

  await page.click("#hf_cookie_text_cookieAccept");
  await scrollToLastProduct();

  const $products = $(".product-card");
  const products: ProductExtracted[] = $products
    .filter(productContainsSearchTitle)
    .map(extractProductInformation)
    .get();

  browser.disconnect();
  return products;
};
