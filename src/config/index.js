module.exports = {
  rightPaper: {
    host: process.env.RIGHT_PAPER_HOST,
    apiKey: process.env.RIGHT_PAPER_API_KEY,
    token: process.env.RIGHT_PAPER_TOKEN,
    companyID: process.env.RIGHT_PAPER_COMPANY_ID || 1,
    appID: process.env.RIGHT_PAPER_APP_ID,
    latitude: process.env.RIGHT_PAPER_LAT_LON.split("/")[0],
    longitude: process.env.RIGHT_PAPER_LAT_LON.split("/")[1],
    type: process.env.RIGHT_PAPER_TYPE || 5,
  },
  isTest: process.env.IS_TEST === 'true',
}
