const puppeteer = require("puppeteer");
const scraper = require("./functions/scraper").scraper;

scraper("pokemon", puppeteer, true);
