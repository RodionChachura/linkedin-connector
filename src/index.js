const Browser = require('./browser')
const Storage = require('./storage')
const Business = require('./business')

const browserWSEndpoint = process.argv[2]
const browser = new Browser(browserWSEndpoint)
const storage = new Storage()

const business = new Business(browser, storage)
business.run()