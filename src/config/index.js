const apiRoot = 'https://exist.io'
const clientId = process.env.CLIENT_ID
const clientUrl = global && global.location
  ? global.location.origin + global.location.pathname
  : ''

switch (process.env.NODE_ENV) {
  case 'development':
    exports.clientRequestTokenUrl = 'http://localhost:8170/jsDotCr/sxe/authorize/'
    break
  case 'production':
    exports.clientRequestTokenUrl = new global.URL('authorize/', clientUrl)
}

exports.authorizeAppUrl = `${apiRoot}/oauth2/authorize?response_type=code&redirect_uri=${clientUrl}&scope=read+write&client_id=${clientId}`
exports.accessTokenUrl = `${apiRoot}/oauth2/access_token`
exports.acquireUrl = `${apiRoot}/api/1/attributes/acquire/`
exports.trackUrl = `${apiRoot}/api/1/attributes/$SOMETHING/`
