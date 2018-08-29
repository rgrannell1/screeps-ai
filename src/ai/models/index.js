
const StateChange = (run, states) => {
  return {run, states}
}

const Transition = (state, reason) => {
  return {state, reason}
}

module.exports = {StateChange, Transition}
