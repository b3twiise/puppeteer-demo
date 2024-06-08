import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import axios from 'axios'
import { promisify } from 'node:util';

const writeFile = promisify(fs.writeFile)

const writeToFile = async(fname, data)  => {
    try {
        await writeFile( `./src/${fname}`, data, 'utf-8')
          
              console.log('Successful write for scripts', fname);
          
        
    } catch (error) {
        console.error(`Error dumping ${fname}:`, error);
    }
    

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
// console.log(scripts)
  // Log the scripts
  var brokenScripts = ""
  await Promise.all(scripts.map(async(script, id) => {
    console.log(id)

    try {
        if (script.src) {
            //   curScript = 'External script:', script.src , '\n';
              await writeToFile("External/"+id, JSON.stringify(script))

              const response = await axios.get(script.src)
              
              await writeToFile("External/" +id +".js", response.data)
              
              
            } else {
            //   curScript = 'Inline script content:', script.content, '\n';
              await writeToFile("Inline/"+ id, JSON.stringify(script))
            }
            // myScripts += curScript
        
    } catch (error) {
        if(script.src)
        brokenScripts += (script.src + '\n')
    }
    // let curScript = ""
    
  }));

await writeToFile('External/brokenScripts', brokenScripts)
  // Write the HTML content to a file
//   fs.writeFile('body.html', html, 'utf-8', (err) => {
//     if (err) {
//       console.error('Error dumping body:', err);
//     } else {
//       console.log('Successful write for html');
//     }
//   });

// // Write scripts content to a file
// fs.writeFile( "myScripts", myScripts, 'utf-8', (err) => {
//     if (err) {
//       console.error('Error dumping body:', err);
//     } else {
//       console.log('Successful write for scripts');
//     }
//   });

  
 
  

  await browser.close();
})();
