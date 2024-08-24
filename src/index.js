import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { exit } from 'process';
import {fs, urls, locators} from '../src/enums.js';


function log_and_exit(msg, code){
    console.log(msg);
    exit(code);
}

let config;
try {
    const data = await readFile(fs.config_file, 'utf-8');
    config = JSON.parse(data);
} catch (err) {
    log_and_exit(`Error loading config file \n ${err}`, -1);
}




const browser = await puppeteer.launch();
const page = await browser.newPage();
page.goto(urls.whisper);

await page.locator(locators.post);
debugger; // eslint-disable-line no-debugger