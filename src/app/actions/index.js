import * as types from '../constants/ActionTypes'

export function showMask(maskStatus) {
  return {
    type: types.SHOW_MASK,
    maskStatus
  }
}
