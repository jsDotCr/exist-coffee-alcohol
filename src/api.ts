import * as fetch from 'isomorphic-fetch'

function apiRequestAction (type: string): Action {
  return {
    error: false,
    payload: {},
    meta: {
      isFetching: true
    },
    type
  }
}

function apiSuccessAction (type: string, payload: any): Action {
  return {
    error: false,
    payload,
    meta: {
      isFetching: false
    },
    type
  }
}

function apiErrorAction (type: string, payload: any): Action {
  return {
    error: true,
    payload,
    meta: {
      isFetching: false
    },
    type
  }
}

interface ApiCall {
    dispatch?: (action: Action) => void,
    onRequest: string,
    onSuccess: string,
    onError: string,
    url: string,
    options?: any
}
export async function apiCall ({
  dispatch = () => {},
  onRequest,
  onSuccess,
  onError,
  url,
  options = {}
}: ApiCall) {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  if (options.json) {
    headers.append('Content-Type', 'application/json')
    options.method = 'POST'
    options.body = JSON.stringify(options.json)
    delete options.json
  }
  if (typeof options.headers === 'object') {
    Object.keys(options.headers)
      .forEach(key =>
        headers.append(key, options.headers[key])
      )
  }
  const fetchOptions = Object.assign({
    mode: 'cors'
  }, options, {
    headers
  })
  dispatch(apiRequestAction(onRequest))
  try {
    const request = await fetch(url, fetchOptions)
    const response = await request.json()
    if (request.status >= 400) {
      throw new Error(`Request errored with status ${request.status}. Response: ${JSON.stringify(response)}`)
    }
    dispatch(apiSuccessAction(onSuccess, response))
  } catch (error) {
    dispatch(apiErrorAction(onError, error))
  }
}

export function signedApiCall ({ dispatch = () => {}, onRequest, onSuccess, onError, url, options, token }) {
  return apiCall({
    dispatch,
    onRequest,
    onSuccess,
    onError,
    url,
    options: Object.assign({}, options, {
      headers: Object.assign({
        'Authentication': `Bearer ${token}`
      }, options.headers)
    })
  })
}
