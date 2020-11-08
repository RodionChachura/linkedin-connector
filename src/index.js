const Browser = require('./browser')
const Business = require('./business')

const browserWSEndpoint = process.argv[2]
const browser = new Browser(browserWSEndpoint)

const business = new Business(browser)
business.run()