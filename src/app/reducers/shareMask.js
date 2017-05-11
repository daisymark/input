import * as type from '../constants/ActionTypes'

function shareMask(state = {maskStatus:false}, action) {
  switch (action.type) {
    case type.SHOW_MASK:
      return {
        ...state,
        maskStatus: action.maskStatus
      }

    default:
      return state
  }
}

export default shareMask
