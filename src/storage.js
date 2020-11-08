const fs = require('fs')

const STATE_PATH = './state.json'

let state = JSON.parse(fs.readFileSync(STATE_PATH))

const updateState = (newState) => {
  state = { ...state, ...newState }
  fs.writeFileSync(STATE_PATH, JSON.stringify(state))
}

module.exports = {
  getLastDate: () => state.lastDate,
  setLastDate: (lastDate) => {
    updateState({ lastDate })
  }
}