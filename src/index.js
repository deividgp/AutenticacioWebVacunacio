const puppeteer = require('puppeteer');
const Imap = require('node-imap');
require('dotenv').config();
const delay=1000;

var imap = new Imap({
    user: process.env.MAIL,
    password: process.env.MAILPASS,
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    tls: true
  });

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://vacunacovidsalut.cat');

    while ((page.url()).includes("https://sala.pdacloud02a.gencat.cat")){
        try{
            if(await page.$('#buttonConfirmRedirect') !== null && await (await page.$('#buttonConfirmRedirect')).boundingBox()){
                await page.click('#buttonConfirmRedirect');
            }
        }catch(error){
            console.log(error);
        }
    }

    await page.waitForTimeout(delay);
    let button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-onboarding").shadowRoot.querySelector("#dismiss-btn").shadowRoot.querySelector("#button")`);
    await button.click();
    await page.waitForTimeout(delay);
    
    let input;
    switch(process.env.CIP){
        case "true":
            //CIP
            input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#cip").shadowRoot.querySelector("label > input")`);
            await input.focus();
            await input.type(process.env.ID);
            break;
        case "false":
            let button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#mdc-tab-2").shadowRoot.querySelector("button")`);
            button.click();
            await page.waitForTimeout(delay);
            //DNI
            input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#documentID").shadowRoot.querySelector("label > input")`);
            await input.focus();
            await input.type(process.env.ID);
            break;
    }
    //PHONE
    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#phone").shadowRoot.querySelector("label > input")`);
    await input.focus();
    await input.type(process.env.PHONE);
    //NAME
    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#name").shadowRoot.querySelector("label > input")`);
    await input.focus();
    await input.type(process.env.NAME);
    //FIRST SURNAME
    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#surname").shadowRoot.querySelector("label > input")`);
    await input.focus();
    await input.type(process.env.SURNAME);
    //SECOND SURNAME
    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#surname2").shadowRoot.querySelector("label > input")`);
    await input.focus();
    await input.type(process.env.SURNAME2);
    //MAIL
    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#mail").shadowRoot.querySelector("label > input")`);
    await input.focus();
    await input.type(process.env.MAIL);
    //ACCEPT BUTTON
    button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-user-registration").shadowRoot.querySelector("#accept-btn").shadowRoot.querySelector("#button")`);
    await button.click();

    imap.connect();

    imap.once('ready', function () {
        var buffer="";
        openInbox(function (err, box) {
            imap.once('mail', function() {
                var f = imap.seq.fetch(box.messages.total, { bodies: ['TEXT'] });
                f.on('message', function(msg, seqno) {

                    msg.on('body', function(stream, info) {
                        
                        stream.on('data', function(chunk) {
                            buffer += chunk.toString('utf8');
                        });
                        stream.once('end', async function() {
                            input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-sms-code").shadowRoot.querySelector("#code").shadowRoot.querySelector("label > input")`);
                            await input.focus();
                            await input.type(buffer.slice(160,166));
                            
                            button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-sms-code").shadowRoot.querySelector("#accept-btn").shadowRoot.querySelector("#button")`);
                            await button.click();
                            await page.waitForTimeout(delay);

                            /*await page.evaluate(async() => {
                                let elements = document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-welcome").shadowRoot.querySelectorAll("#make-appointment-btn");
                                
                                if(elements.length == 1){
                                    mail = "No hi ha caps disponibles";
                                    await elements[0].click();
                                }else{
                                    mail = "Hi ha caps disponibles";
                                    await elements[1].click();
                                }
                            });

                            await page.waitForTimeout(delay);*/

                            //CENTRES SELECT
                            //document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-selection").shadowRoot.querySelector("#selection-shell-content > appointment-center-selection").shadowRoot.querySelector("div.container > mwc-select").shadowRoot.querySelector("div > div")
                        });
                    });
                });
                f.once('error', function(err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function() {
                    imap.end();
                });
            });
        });
    });
})();

function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
}