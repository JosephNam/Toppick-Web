import update from 'react-addons-update'

import { SWITCH_VIEW } from './view'

const initial = {
  library: [],
  drafts: [],
  questions: [],
  view: 'LIBRARY'
}

function view (state, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      return update(state, {
        view: { $set: action.newView }
      })
    default:
      return state
  }
}

export default function interviewkit (state = initial, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      return view(state, action)
    default:
      return state
  }
}
