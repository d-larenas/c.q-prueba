import dotenv from "dotenv";

dotenv.config();
import puppeteer from 'puppeteer'

const email = process.env.EMAIL
const password = process.env.PASSWORD
const url_login = process.env.URL_LOGIN
const headless = () => {
    if (process.env.HEADLESS === "TRUE") {
        return "new"
    } else {
        return false
    }
}

const getJumbo = async () => {
    console.log("---Run bot---");

    const browser = await puppeteer.launch({
        headless: headless(),
        defaultViewport: null,
        args: ['--use-gl=egl'],
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        ignoreDefaultArgs: [
            "--disable-extensions",
            "--disable-default-apps",
            "--disable-component-extensions-with-background-pages",
        ],

    });

    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 1024});

    await page.goto("https://www.jumbo.cl/", {
        waitUntil: 'domcontentloaded',

    });
    console.log("---Open jumbo.cl---");


    await page.waitForTimeout(5000);
    await page.click("xpath//html/body/div[1]/div/header/div[2]/div/div[2]/div[1]/button[2]")
    await page.waitForTimeout(1000);
    await page.click("xpath//html/body/div[3]/div/div[1]/form/div[2]/div/div[1]/label/input");
    await page.keyboard.type(email);
    await page.click("xpath//html/body/div[3]/div/div[1]/form/div[2]/div/div[2]/label/input");
    await page.keyboard.type(password);
    await page.waitForTimeout(1000);

    // get response in endpoint of login
    const userdata = page.waitForResponse(async response => {
        if (response.url() === url_login && response.request().method() === 'POST') {
            return response
        }
    });
    await page.click("xpath//html/body/div[3]/div/div[1]/form/div[3]/button[2]");
    await page.waitForTimeout(5000);

    try {
        let get_userdata = await userdata
        let data = await get_userdata.json()

        if (data.authStatus === "Success") {
            console.log("---Login ok---");
            console.log("---Token---")
            console.log(data.token)
            console.log("---User data---")
            console.log(data.user)
        } else {
            console.error("Wrong credentials.")
        }

    } catch (ex) {
        console.error("Data not found.")
        await browser.close();
    }


    await browser.close();
    console.log("---End bot---");
};


getJumbo()



