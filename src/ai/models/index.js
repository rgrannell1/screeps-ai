
const StateChange = (run, states) => {
  return {run, states}
}

const Transition = (state, reason) => {
  return {state, reason}
}

const State = ({code, run, transitions}) => {
  return {code, run, transitions}
}

const StateMachine = (states, initialState) => {
  return {states, initialState}
}

module.exports = {StateChange, Transition, State, StateMachine}
