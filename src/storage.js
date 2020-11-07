const fs = require('fs')

const STATE_PATH = './state.json'

class Storage {
  update(newState) {
    fs.writeFileSync(STATE_PATH, JSON.stringify(newState));
  }

  get() {
    return JSON.parse(fs.readFileSync(STATE_PATH))
  }
}

module.exports = Storage