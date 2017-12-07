require('dotenv').config();

const fs = require('fs');
const util = require('util');
const twilio = require('twilio');
const cron = require('node-cron');
const puppeteer = require('puppeteer');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const { statusTextSelector, trackingUrl, statusFile } = process.env;
const { twilioAccountSid, twilioAuthToken, twilioTo, twilioFrom } = process.env;
const twilioClient = new twilio(twilioAccountSid, twilioAuthToken);

const puppeteerOptions = {
  executablePath: 'google-chrome-unstable', 
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

let statusCache = null;

const extractStatus = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();

  await page.goto(trackingUrl, {waitUntil: 'networkidle2'});
  await page.waitFor(statusTextSelector);

  const statusText = await page.evaluate((statusTextSelector) => {
    const statusDiv = document.querySelector(statusTextSelector);
    // returned data must be valid JSON
    return [statusDiv.textContent];
  }, statusTextSelector);

  await browser.close();
  return statusText.join();
};

const sendTextMessage = (status) => {
  const msg = {
    to: twilioTo,
    from: twilioFrom,
    body: `Passport tracking status changed to: '${status}'. More details at ${trackingUrl}`,
  };

  twilioClient.messages.create(msg).catch(console.error);
};

const checkTrackingStatus = async () => {
  const newStatus = await extractStatus();

  if (statusCache !== newStatus) {
    statusCache = newStatus;
    writeFile(statusFile, newStatus).catch(console.error);
    sendTextMessage(newStatus);
  };
};

const init = async () => {
  // warm cache
  statusCache = await readFile(statusFile, 'utf8').catch(console.error);
  // run every 10 minutes
  cron.schedule('*/10 * * * *', checkTrackingStatus);
};

init();

