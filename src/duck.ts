import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import { reducer as existReducer } from './exist/duck'
import { reducer as trackReducer } from './track/duck'

const appReducer = combineReducers({
  exist: existReducer,
  track: trackReducer
})

// Store
export const store = createStore(
  appReducer,
  applyMiddleware(thunk)
)
