const axios = require('./axios.js')
const formData = require('form-data')
const config = require('../config/index.js')
const logger = require('../logger/index.js')

exports.punchCard = async date => {
  try {
    const form = new formData()
    form.append('tokenApp', config.rightPaper.token)
    form.append('dispositivo', 'Web')
    form.append('tipo', config.rightPaper.type)
    form.append('latitude', config.rightPaper.latitude)
    form.append('longitude', config.rightPaper.longitude)
    form.append('dia', date.getDate())
    form.append('mes', date.getMonth() + 1)
    form.append('ano', date.getFullYear())
    form.append('hora', date.getHours())
    form.append('minuto', date.getMinutes())
    form.append('appId', config.rightPaper.appID)
    form.append('appDiaId', config.rightPaper.appID)

    const endpoint = config.isTest ? '/post' : '/App/MarcarPonto'
    logger.warn(`is test? -> ${config.isTest}`)
    const res = await axios.post(endpoint, form, { headers: form.getHeaders() })

    logger.info(`API return: ${JSON.stringify(res.data)}`)

    return res.data
  } catch(e) {
    logger.error(`api return error ${e.message}`)
    throw new Error({info: JSON.stringify(e.response.data), status: e.response.status})
  }
}

exports.loadDate = async date => {
  try {
    const form = new formData()
    form.append('tokenApp', config.rightPaper.token)
    form.append('dia', date.getDate())
    form.append('mes', date.getMonth() + 1)
    form.append('ano', date.getFullYear())

    const endpoint = config.isTest ? '/post' : '/App/CarregarDia'
    logger.warn(`is test? -> ${config.isTest}`)
    const res = await axios.post(endpoint, form, { headers: form.getHeaders() })

    logger.info(`API return: ${JSON.stringify(res.data)}`)
    const marks = res.data.Dia.HorariosMarcacoes

    return marks.map(h => { return {day: h.Dia, hour: h.Hora} })
  } catch(e) {
    logger.error(`api return error ${e.message}`)
    throw new Error({info: JSON.stringify(e.response.data), status: e.response.status})
  }
}
