const Debug = require('debug')
const FormData = require('form-data')
const fetch = require('isomorphic-fetch')
const joi = require('joi')
const { URL } = require('url')

const debug = Debug('sxe:authorize')

const { accessTokenUrl } = require('../../../src/config')
debug(accessTokenUrl)
const url = new URL(accessTokenUrl)

async function getToken (code) {
  try {
    joi.assert(process.env, joi.object().keys({
      CLIENT_ID: joi.string().length(20),
      CLIENT_SECRET: joi.string().length(40),
      REDIRECT_URL: joi.string().uri()
    }).unknown(true))
  } catch (e) {
    throw new Error('Validation failed: invalid environment configuration')
  }
  debug('getToken', code)
  debug('id', process.env.CLIENT_ID)
  debug('url', url.toString())
  const form = new FormData()
  form.append('grant_type', 'authorization_code')
  form.append('code', code)
  form.append('client_id', process.env.CLIENT_ID)
  form.append('client_secret', process.env.CLIENT_SECRET)
  form.append('redirect_uri', process.env.REDIRECT_URL)
  debug(form)

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: form
  })
  debug('status', response.status)
  const jsonResponse = await response.json()
  debug('json', jsonResponse)
  if (jsonResponse.error === 'invalid_grant') {
    throw new Error(`API (exist: authorize) error: invalid code, could not grant access token`)
  }
  if (response.status >= 400) {
    throw new Error(`API (exist: authorize) error ${response.status}: ${JSON.stringify(jsonResponse)}`)
  }
  return jsonResponse
}

/**
* Exchanges an authorization token for an access token
* @param {string} code
* @returns {any}
*/
module.exports = (code, context, callback) => {
  debug('code', code)
  debug('ctx', context)
  try {
    joi.assert(code, joi.string().length(40))
  } catch (e) {
    return callback(new Error('Validation failed: invalid authorization code'))
  }
  getToken(code)
    .then(response => callback(null, response))
    .catch(callback)
}
