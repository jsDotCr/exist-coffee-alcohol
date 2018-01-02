const Debug = require('debug')
const { readFile } = require('fs')
const { join, resolve } = require('path')
const { promisify } = require('util')

const debug = Debug('sxe:main')

/**
* The main client-side sxe is served here
* @returns {buffer}
*/
module.exports = (context, callback) => {
  debug('main', context)
  const template = join('client', 'index.html')
  debug('template to load', resolve(template))
  promisify(readFile)(template)
    .then(file => callback(null, file, {
      'Content-Type': 'text/html; charset=utf-8'
    }))
}
