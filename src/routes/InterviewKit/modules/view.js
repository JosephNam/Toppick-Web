import update from 'react-addons-update'

export const SWITCH_VIEW = 'SWITCH_VIEW'

export const switchView = newView => ({
  type: SWITCH_VIEW,
  newView
})

const initialState = {
  view: 'LIBRARY'
}

export function view (state = initialState, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      return update(state, {
        view: { $set: action.newView }
      })
    default:
      return state
  }
}
