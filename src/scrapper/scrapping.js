'use strict';

const puppeteer = require('puppeteer');



const URL = 'https://developer.infojobs.net/test-console/console.xhtml';
const endpoint = 'https://api.infojobs.net/api/7/offer';

async function getJobsRecent (search = null, maxResults = 10) {
    try {
        const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		console.log(search);
        
        await page.goto(URL, { waitUntil: 'domcontentloaded'});

		await page.focus('#apiuri');
		if (search) {
			await page.keyboard.type(endpoint + '?q=' + search + '&order=updated-desc&' + 'maxResults=' + maxResults);
		} else {
			await page.keyboard.type(endpoint + '?order=updated-desc&' + 'maxResults=' + maxResults);
		}
        

        await page.$eval('#apiexecutionform', form => form.submit());
        await page.waitFor(1000);        
        const result = await page.evaluate(() => {
            const jobsIds = document.getElementById('responseBody');
            return jobsIds.textContent;
		  });
		  
		return JSON.parse(result);
        
        const jobs  = JSON.parse(result);
        const id = jobs.offers[0].id;

        await page.focus('#apiuri');
        const input = await page.$('#apiuri');
        await input.click({ clickCount: 3 })
        await page.keyboard.type(endpoint + '/' + id);

        await page.$eval('#apiexecutionform', form => form.submit());
        await page.waitFor(1000);        

        const result2 = await page.evaluate(() => {
            const job = document.getElementById('responseBody');
            return job.textContent;
          });
        
        await browser.close();
        
        return JSON.parse(result2);  
    } catch (err) {
        await browser.close();
    }
}

module.exports = getJobsRecent;


