const Alexa = require('ask-sdk')
const service = require('./service/index.js')
const logger = require('./logger/index.js')
const languageStrings = require('./interceptor/languageStrings.js')
const LocalizationInterceptor = require('./interceptor/localization.js')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'LaunchRequest'
  },

  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('WELCOME_MSG')
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
  }
}

const GetMarksFromDayIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const intent = request.intent
    return request.type === 'IntentRequest'
      && intent.name === 'GetMarksFromDayIntent'
  },

  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const dateRaw = Alexa.getSlotValue(handlerInput.requestEnvelope, 'date')

    try {
      const date = new Date(`${dateRaw}T12:00:00-06:00`)
      const marksRaw = await service.loadMarksOf(date)
      const marks = marksRaw.map(m => m.hour)
      const speechText = marks.length === 0
        ? requestAttributes.t('EMPTY_MARKS', date)
        : requestAttributes.t('READING_MARKS', dateRaw, marks.join(', '))

      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse()
    } catch(e) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MSG', e.message))
        .getResponse()
    }
  }
}

const StartPunchCardIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const intent = request.intent
    return request.type === 'IntentRequest'
      && request.intent.name === 'PunchCardIntentHandler'
      && request.dialogState === 'STARTED'
  },

  async handle(handlerInput) {
    try {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
      const marks = await service.loadMarksOfToday()
      const punchType = marks.length === 1 ? requestAttributes.t('IN') : requestAttributes.t('OUT')
      const speechText = requestAttributes.t('CONFIRMATION_MSG', punchType)

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    } catch(e) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MSG', e.message))
        .getResponse()
    }
  }
}

const CompletedPunchCardIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const intent = request.intent
    return request.type === 'IntentRequest'
      && request.intent.name === 'PunchCardIntentHandler'
      && request.dialogState === 'IN_PROGRESS'
  },

  handle(handlerInput) {
    try {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
      const speechText = handlerInput.intent.confirmationStatus === "CONFIRMED"
        ? requestAttributes.t('GOODBYE_MARKED_MSG')
        : requestAttributes.t('GOODBYE_NOT_MARKED_MSG')

      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse()
    } catch(e) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MSG', e.message))
        .getResponse()
    }
  }
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    logger.error(`Error handled: ${error.stack}`)
    const speakOutput = requestAttributes.t('ERROR_MSG', error.message)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

exports.handler = Alexa.SkillBuilders
  .custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    GetMarksFromDayIntentHandler,
    StartPunchCardIntentHandler,
    CompletedPunchCardIntentHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda()
