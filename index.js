import puppeteer from 'puppeteer';
import * as fs from 'node:fs'
(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https:rtb.bf');
  await page.setViewport({width: 1080, height: 1024});
  let html = await(page.content())
  fs.writeFile( "body.html", html, "utf-8", (err, success) => {
    if(err) console.log("Error dumping bdoby")
    if(success) console.log("Successfull write")
  } )

  await browser.close();
})();