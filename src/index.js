const puppeteer = require('puppeteer');
const Imap = require('node-imap');
const prompts = require('prompts');
const CronJob = require('cron').CronJob;
require('dotenv').config();
const delay = parseInt(process.env.DELAY);
var browser;

var imap = new Imap({
    user: process.env.MAIL,
    password: process.env.MAILPASS,
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    tls: true
});

(async () => {
    var option;
    var job;

    do {
        console.log("1-Authentication\n2-Run every x minutes\n3-Exit\n");

        const response = await prompts({
            type: 'number',
            name: 'option',
            message: 'Option?'
        });

        option = response.option;

        switch (option) {
            case 1:
                browser = await puppeteer.launch({ headless: false });
                main(false);
                break;
            case 2:

                const minutes = await prompts({
                    type: 'number',
                    name: 'minutes',
                    message: 'How often?'
                });

                browser = await puppeteer.launch({ headless: false });

                job = new CronJob(`0 */${minutes.minutes} * * * *`, function () {
                    main(true);
                });

                job.start();

                browser.on('disconnected', () => {
                    job.stop();
                    job = null;
                });
                break;
            case 3:
                if (typeof browser != 'undefined' && browser.isConnected()) {
                    browser.close();
                }
                if (job != null) {
                    job.stop();
                }
                break;
            default:
                console.log("Wrong option");
                break;
        }
    } while (option != 3);

})();

async function main(cron) {
    const page = await browser.newPage();
    var queue = false;
    try {

        await page.goto('http://vacunacovidsalut.cat');

        while ((page.url()).includes("https://sala.pdacloud02a.gencat.cat")) {
            queue = true;
            try {
                if (await page.$('#buttonConfirmRedirect') !== null && await (await page.$('#buttonConfirmRedirect')).boundingBox()) {
                    await page.click('#buttonConfirmRedirect');
                }
            } catch (error) {
                //console.log(error);
            }
        }

        if (queue) {
            await page.waitForTimeout(delay);
        }

        await page.waitForTimeout(delay);
        let button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-onboarding").shadowRoot.querySelector("#dismiss-btn").shadowRoot.querySelector("#button")`);
        await button.click();
        await page.waitForTimeout(delay);

        let input;
        switch (process.env.CIP) {
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

            openInbox(function (err, box) {
                imap.once('mail', function () {
                    var f = imap.seq.fetch(box.messages.total, { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] });

                    f.on('message', function (msg, seqno) {
                        var body = "";
                        var from = "";
                        msg.on('body', function (stream, info) {
                            var buffer = "";
                            stream.on('data', function (chunk) {
                                buffer += chunk.toString("utf8");
                            });
                            stream.once('end', async function () {
                                if(buffer.includes("From:")){
                                    from = buffer;
                                }else{
                                    body = buffer;
                                }

                                if(body != "" && from != ""){
                                    let sms;
                                    let start;
                                    let end;
                                    
                                    if (from.includes("SMS forwarder <no-reply-smsforwarder@cofp.ru>")) {
                                        buffer = Buffer.from(body.split("\n")[13], 'base64');
                                        body = buffer.toString('utf8');
                                        start = body.indexOf("cés");
                                    } else {
                                        start = body.indexOf("A9s");
                                    }
                                    end = body.indexOf("(", start);
                                    sms = body.slice(start + 4, end - 1);
                                    input = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-sms-code").shadowRoot.querySelector("#code").shadowRoot.querySelector("label > input")`);
                                    await input.focus();
                                    await input.type(sms);
                                    button = await page.evaluateHandle(`document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-sms-code").shadowRoot.querySelector("#accept-btn").shadowRoot.querySelector("#button")`);
                                    await button.click();
                                    await page.waitForTimeout(delay);

                                    if (cron) {
                                        await page.close();
                                    }

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

                                    await page.waitForTimeout(delay);

                                    /*CENTRES SELECT*/
                                    /*document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-selection").shadowRoot.querySelector("#selection-shell-content > appointment-center-selection").shadowRoot.querySelector("div.container > mwc-select").shadowRoot.querySelector("div > div")
                                    */
                                }
                            });
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        imap.end();
                    });
                });
            });
        });

    } catch (error) {
        //console.log(error);
    }
}

function openInbox(cb) {
    imap.openBox("INBOX", true, cb);
}