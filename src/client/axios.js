const axios = require('axios')
const config = require('../config/index.js')

const { rightPaper } = config

module.exports = axios.create({
  baseURL: rightPaper.host,
  timeout: 10000,
  headers: {
    Cookie: `accessToken=${rightPaper.apiKey} token=${rightPaper.token} empresaId=${rightPaper.companyID}`
  },
  withCredentials: true,
})
