const config = require('../config/index.js')
const logger = require('../logger/index.js')
const api = require('../client/api.js')

exports.loadMarksOfToday = async () => loadMarksOf(new Date())

exports.loadMarksOf = async date => {
  try {
    const marks = await api.loadDate(date)
    logger.info(`found ${marks.length} markings`, { marking_date: date })
    return marks
  } catch(e) {
    logger.error(`something went wrong when try to recover markings - ${e.message.info}`, { marking_date: date })
    throw new Error(`request failed return status code ${e.message}`)
  }
}

exports.punch = async () => {
  try {
    const now = new Date()
    const result = await api.punchCard(now)
    logger.info(`Punch completed with success!`, { punch_time: now })
    return now
  } catch(e) {
    logger.error(`Punch failed, api returned ${e.message.info}`, { punch_time: now })
    throw new Error(`request failed return status code ${e.message.status}`)
  }
}
