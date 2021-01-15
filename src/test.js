const api = require('./client/api.js')
const logger = require('./logger/index.js')

const test = async () => {
  try {
    const now = new Date
    await api.loadDate(now)
    // await api.punchCard(now)
  } catch (e) {
    logger.error(e.message)
  }
}

test()
