import puppeteer from 'puppeteer';
import { createWriteStream, unlink, accessSync } from 'fs';
import { readFile, mkdir, writeFile } from 'fs/promises';
import { exit } from 'process';
import { files, links, locators } from '../src/enums.js';
import https from 'https';
import os from 'os';
const homedir = os.homedir();
function log_and_exit(msg, code) {
    console.log(msg);
    exit(code);
}

function get_issue_path(number) {
    return homedir + config.download_path + "issue" + number + ".pdf";
}

function get_issue_link(number) {
    return links.download.first + number.toString(16).toUpperCase() + links.download.seocnd + number + links.download.end;
}

function is_issue_downloaded(number) {
    return path_exists(get_issue_path(number));

}

function path_exists(path) {
    try {
        accessSync(path);
        return true;
    } catch {
        return false;
    }}

function downlaod_issue(number) {
    const path = get_issue_path(number);
    return new Promise((res, rej) => {
        if (path_exists(path)) {
            console.log(`Issue ${number} already exists`);
            res();
        }

        console.log(`Downloading issue ${number}\n link is ${get_issue_link(number)}`);
        https.get(get_issue_link(number), (response) => {
            if (response?.statusCode === 200) {
                const fileStream = createWriteStream(path);
                response.pipe(fileStream);

                fileStream.on('finish', async () => {
                    await fileStream.close();
                    console.log(`Download completed for issue ${number}!`)
                    res();
                });

                fileStream.on('error', async (err) => {
                    await unlink(path, ()=>{
                        console.log(`Failed to downlaod ${number} \n ${err}`);
                        rej();
                    });
                });

            } else {
                rej(new Error(`Failed to download is ${number}. Status code: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            console.log(err)
            rej();
        });

    })
}


console.log("Getting config data....")
let config;
try {
    const data = await readFile(files.config_file, 'utf-8');
    config = JSON.parse(data);
} catch (err) {
    log_and_exit(`Error loading config file \n ${err}`, 1);
}

const download_folder = homedir + config.download_path;
console.log(`Checking download folder ${download_folder}`);
if (await path_exists(download_folder)) {
    console.log("Download folder OK");
} else {
    console.log("Download dir not foud. Attpemting to create...")
    mkdir(download_folder, { recursive: true })
        .then(
            () => { console.log("Download dir created") },
            () => { log_and_exit("Cannot create download dir") }
        );
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(links.whisper);

const link = await page.evaluate((selector) => {
    const last_issue = document.querySelector(selector.last);
    if (!last_issue) return null;
    const link = last_issue.querySelector(selector.last_link);
    if (!link) return null;
    return link.href;
}, locators);
let last
try {
    last = parseInt(new URL(link).pathname.split('e')[1]);
} catch (err) {
    log_and_exit(`Error creating issue link \n ${err}`, 1);
}

console.log(`Latest issue is ${last}`);
const is_last_issue_downloaded = is_issue_downloaded(last);
if (last === config.latest && is_last_issue_downloaded) log_and_exit("No new issues to download", 0);

const first = config.get_prev_issues ? (config.latest + 1) : last;
const length = last - first + 1;
console.log(`Getting issues form ${first} to ${last}. Total files to download ${length}`)
const promises = Array.from({ length }, (_, i) => i + first).map(i=>downlaod_issue(i));

await Promise.all(promises);
console.log('All donwloads finished');

console.log("Updating config");
config.latest= last;
const data = JSON.stringify(config, null, 2);
await writeFile(files.config_file, data, 'utf-8', err=>{
    if(err){
        log_and_exit(`Error wirting file: \n ${err}`, 1)
    }
    else{
        console.log('Config file updated');
    }
});
log_and_exit('done',0);