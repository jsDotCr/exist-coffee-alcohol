const { URL = global.URL } = require('url')

const clientId = process.env.CLIENT_ID
const apiRoot = 'https://exist.io'
let clientUrl = ''

switch (process.env.SXE_ENV) {
  case 'local':
    clientUrl = 'http://localhost:8170/jsDotCr/sxe'
    break
  default:
    clientUrl = `https://functions.lib.id/jsDotCr/sxe@${process.env.SXE_ENV}`
}

exports.clientRequestTokenUrl = new URL('authorize/', clientUrl)
exports.clientListOwnedAttributesUrl = new URL('attributes/', clientUrl)

exports.authorizeAppUrl = new URL(`oauth2/authorize?response_type=code&redirect_uri=${clientUrl}&scope=read+write&client_id=${clientId}`, apiRoot)
exports.accessTokenUrl = new URL(`oauth2/access_token`, apiRoot)
exports.listOwnedAttributesUrl = new URL(`api/1/attributes/owned/`, apiRoot)
exports.acquireAttributesUrl = new URL(`api/1/attributes/acquire/`, apiRoot)
exports.trackUrl = new URL(`api/1/attributes/$SOMETHING/`, apiRoot)
