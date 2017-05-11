import { combineReducers } from 'redux'
import shareMask from './shareMask'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
  shareMask,
  routing: routerReducer,

})

export default reducer
