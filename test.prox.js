import puppeteer from "puppeteer";


(async () => {
    // Get proxy server from environment variable
    const proxyServer = process.env.HTTP_PROXY;

    // Launch Puppeteer with proxy settings if defined
    const browser = await puppeteer.launch({
        args: [
            '--proxy-server=' + process.env.HTTP_PROXY,  // Set proxy if HTTP_PROXY environment variable is set
            '--ignore-certificate-errors'                // Ignore SSL errors
        ],
        ignoreHTTPSErrors: true                            // Another way to ignore SSL errors
      });

    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    // Enable necessary domains
    await client.send('Network.enable');
    await client.send('Debugger.enable');

    // Track script parsing
    const scripts = new Map();
    client.on('Debugger.scriptParsed', script => {
        scripts.set(script.scriptId, script);
    });

    // Log network requests and the initiating script (if possible)
    client.on('Network.requestWillBeSent', async (requestEvent) => {
        const { requestId, initiator } = requestEvent;
        // console.log(`Request: ${requestEvent.request.url}`);
        
        if (initiator.type === 'script') {
            const script = scripts.get(initiator.stack.callFrames[0].scriptId);
            if (script) {
                console.log(`Initiated by script: ${script.url}`);
                console.log(script)
            }
        }
    });

    await page.goto('http://www.rtb.bf/');
    // const html = await(page.content())
    // console.log(html)


    // Alternative waiting mechanism
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
})();
