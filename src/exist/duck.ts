import * as camelCase from 'lodash.camelcase'
import { authorizeAppUrl, clientRequestTokenUrl } from '../config/index.js'
import { apiCall } from '../api'

// Initial states
export const initialState: {
  error: boolean,
  isFetching: boolean,
  accessToken?: string,
  authorizeUrl: string,
  refreshToken?: string,
  tokenType?: string,
  scope?: string,
  expiresIn?: number,
  username?: string
} = {
  error: false,
  isFetching: false,
  accessToken: null,
  authorizeUrl: authorizeAppUrl,
  refreshToken: null,
  tokenType: null,
  scope: null,
  expiresIn: null,
  username: null
}

// actions
const EXCHANGE_CODE_FOR_TOKEN_REQUEST = 'exist/EXCHANGE_CODE_FOR_TOKEN_REQUEST'
const EXCHANGE_CODE_FOR_TOKEN_RESPONSE = 'exist/EXCHANGE_CODE_FOR_TOKEN_RESPONSE'
const EXCHANGE_CODE_FOR_TOKEN_ERROR = 'exist/EXCHANGE_CODE_FOR_TOKEN_ERROR'
export function exchangeCodeForToken (code: string) {
  return (dispatch: (action: Action) => void) =>
    apiCall({
      dispatch,
      onRequest: EXCHANGE_CODE_FOR_TOKEN_REQUEST,
      onSuccess: EXCHANGE_CODE_FOR_TOKEN_RESPONSE,
      onError: EXCHANGE_CODE_FOR_TOKEN_ERROR,
      url: clientRequestTokenUrl,
      options: {
        json: {
          code
        }
      }
    })
}

const FETCH_CODE_ERROR = 'exist/FETCH_CODE_ERROR'
export function fetchCodeError (error: Error) {
  return {
    error: true,
    payload: error,
    meta: {},
    type: FETCH_CODE_ERROR
  }
}

// Reducer
export function reducer (state = initialState, action: Action) {
  switch (action.type) {
    case EXCHANGE_CODE_FOR_TOKEN_RESPONSE:
      return Object.keys(action.payload)
        .reduce((newState: any, payloadKey: string) => {
          console.log(camelCase(payloadKey), action.payload[payloadKey])
          return Object.assign({}, newState, {
            [camelCase(payloadKey)]: action.payload[payloadKey],
          })
        }, state)
    default:
      return state
  }
}
