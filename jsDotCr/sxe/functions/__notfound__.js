const Debug = require('debug')
const { readFile } = require('fs')
const { contentType, lookup } = require('mime-types')
const { join, resolve } = require('path')
const { promisify } = require('util')

const debug = Debug('sxe:not-found')

/**
* Serves static assets
* @returns {buffer}
*/
module.exports = (context, callback) => {
  debug('not found')
  const filePath = join('client', ...context.path)
  const fileContentType = contentType(lookup(filePath))
  debug('will try to load', resolve(filePath))
  debug('content type', filePath, fileContentType)

  promisify(readFile)(filePath)
    .then(fileBuffer =>
      callback(null, fileBuffer, {
        'Content-Type': fileContentType
      })
    )
    .catch(callback)
}
