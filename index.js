import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import axios

const writeToFile = (fname, data)  => {
    fs.writeFile( `./src/${fname}`, data, 'utf-8', (err) => {
        if (err) {
          console.error('Error dumping body:', err);
        } else {
          console.log('Successful write for scripts');
        }
      });

 }

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://rtb.bf');
  await page.setViewport({ width: 1080, height: 1024 });

  // Get the page content
  const html = await page.content();

  // Extract script tags
  const scripts = await page.$$eval('script', scriptTags => 
    scriptTags.map(script => {
      return {
        src: script.src || null,
        content: script.src ? null : script.innerHTML
      };
    })
  );

  // Log the scripts
  var myScripts = ""
  scripts.forEach((script, id) => {
    let curScript = ""
    if (script.src) {
    //   curScript = 'External script:', script.src , '\n';
      writeToFile("External/"+id, JSON.stringify(script))
    } else {
    //   curScript = 'Inline script content:', script.content, '\n';
      writeToFile("Inline/"+ id, JSON.stringify(script))
    }
    // myScripts += curScript
  });


  // Write the HTML content to a file
  fs.writeFile('body.html', html, 'utf-8', (err) => {
    if (err) {
      console.error('Error dumping body:', err);
    } else {
      console.log('Successful write for html');
    }
  });

// Write scripts content to a file
fs.writeFile( "myScripts", myScripts, 'utf-8', (err) => {
    if (err) {
      console.error('Error dumping body:', err);
    } else {
      console.log('Successful write for scripts');
    }
  });

  
 
  

  await browser.close();
})();
