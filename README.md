# parcel tracker

A quick hack to set up SMS updates on delivery status when your courier doesn't offer this as a service. Uses Docker, Puppeteer, Azure Container Instances, and Azure File Storage.

For more information, you might like to read [this blog post](https://medium.com/@suzhinton/politely-scraping-by-tracking-my-passports-whereabouts-with-puppeteer-and-docker-744310872b17) :eyes: 

**Tips for running this locally**

You'll need:

1. [NodeJS](http://nodejs.org), [git](https://git-scm.com), and [Docker](https://docker.com) installed on your computer
2. A [Twilio](https://twilio.com) account. Note down the account SID, auth token, and phone number for adding to the `.env` file later

Perform the following:

1. Clone this repo
2. Rename `.env.example` to `.env` and add your credentials and variables. For `statusFile`, put `/aci/status/status.txt`.
3. To run on your machine:
  + `docker build -t ptracker .`
  + `docker run -it -v /path/to/this/repo/volume/:/aci/status/ ptracker`

  MIT License.
