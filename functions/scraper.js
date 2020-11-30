const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const getOptions = async (isDev) => {
  if (isDev) {
    return {
      args: [],
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
    };
  } else {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    };
  }
};

const scraper = async (searchText, puppeteer, isDev) => {
  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // go to ebay home page
  console.log("Navigating to Ebay...");
  await page.goto("https://www.ebay.com/");

  // enter search value
  console.log("Filling in search input value...", searchText);
  await page.evaluate((searchText) => {
    // enter sesarch value
    document.querySelector("input#gh-ac").value = searchText;
  }, searchText);

  // submit search
  console.log("Submitting search...");
  await page.click("input[type=submit]", { waitUntil: "load" });
  await page.waitForSelector("ul.srp-results");

  // get first 3 search results
  console.log("Scraping results...");
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ul.srp-results li.s-item"))
      .slice(0, 3)
      .map((item) => {
        const src = item
          .querySelector("img")
          .src.replace("s-l225.webp", "s-l140.jpg");
        return {
          src,
          url: item.querySelector("a").href,
          title: item.querySelector("h3").innerText,
        };
      });
  });

  // close browser
  console.log("Closing browser...");
  await browser.close();

  // return scraped results
  // console.log("Returning results...", results);
  return results;
};

exports.handler = async (event, context) => {
  const searchText = JSON.parse(event.body).search;
  const isDev = process.env.FUNCTIONS_ENV;

  try {
    const searchResults = await scraper(searchText, puppeteer, isDev);

    return {
      statusCode: 200,
      body: JSON.stringify(searchResults),
    };
  } catch (err) {
    console.log("failed", searchText);
    return {
      statusCode: 200,
      body: JSON.stringify(err),
    };
  }
};

exports.scraper = scraper;
