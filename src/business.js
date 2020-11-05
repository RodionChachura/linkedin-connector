class Business {
  constructor(browser, storage) {
    this.browser = browser
    this.storage = storage
  }

  async run() {
    await this.browser.openOutlook()
  }
}


module.exports = Business