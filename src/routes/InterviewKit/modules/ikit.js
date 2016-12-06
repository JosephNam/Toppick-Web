import { SWITCH_VIEW, view } from './view'

const initial = {
  library: [],
  drafts: [],
  questions: [],
  view: 'LIBRARY'
}

export default function interviewkit (state = initial, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      console.log(action)
      return view(state, action)
    default:
      return state
  }
}
