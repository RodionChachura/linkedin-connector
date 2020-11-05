const Browser = require('./browser')
const Storage = require('./storage')
const Business = require('./business')

const browser = new Browser()
const storage = new Storage()

const business = new Business(browser, storage)
business.run()