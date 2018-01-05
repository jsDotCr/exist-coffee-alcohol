const Debug = require('debug')
const fetch = require('isomorphic-fetch')
const joi = require('joi')
const { URL } = require('url')

const debug = Debug('sxe:acquire')

const { acquireUrl } = require('../config/server')
const url = new URL(acquireUrl)
const defaultAttributes = ['coffees', 'alcoholic_beverages']

debug(acquireUrl)

async function acquire (authorizationHeader, attributes = defaultAttributes) {
  try {
    joi.assert(attributes, joi.array().min(1))
  } catch (e) {
    throw new Error('Validation failed: invalid list of attributes')
  }
  debug('authorizationHeader', authorizationHeader)
  debug('id', process.env.CLIENT_ID)
  debug('url', url.toString())

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: authorizationHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(attributes.map(attribute => ({
      name: attribute,
      active: true
    })))
  })
  debug('status', response.status)
  const jsonResponse = await response.json()
  debug('json', jsonResponse)
  if (response.status >= 400) {
    throw new Error(`API (exist: acquire) error ${response.status}: ${jsonResponse.detail || jsonResponse.error}`)
  }
  return jsonResponse
}

/**
* Takes over specific attributes on exist.io
* @returns {any}
*/
module.exports = (context, callback) => {
  debug('ctx', context.http.headers)
  try {
    joi.assert(context.http.headers, joi.object().keys({
      Authorization: joi.string().regex(/^Bearer ([\w]{40})$/).required()
    }).unknown(true))
  } catch (e) {
    return callback(new Error('Validation failed (exist: acquire): invalid auth token'))
  }
  acquire(context.http.headers['Authorization'], defaultAttributes)
    .then(response => callback(null, response))
    .catch(callback)
}
