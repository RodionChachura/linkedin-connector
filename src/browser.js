const puppeteer = require('puppeteer')

const OUTLOOK_PAGE = 'https://outlook.live.com/people/0'
const NEW_CONTACT_TEXT = 'New contact'

const getElementWithText = async (parent, tag, text) => {
  const [result] = await parent.$x(`//${tag}[contains(., '${text}')]`)
  return result
}

class Browser {
  constructor() {
    console.log('Browser:constructor()')
  }

  async openOutlook() {
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/05110622-7642-4fdc-9ec8-b4900e109b2d',
      defaultViewport: null
    })

    this.outlookPage = await browser.newPage()
    await this.outlookPage.goto(OUTLOOK_PAGE)
    await this.outlookPage.waitForXPath(`//div[contains(., '${NEW_CONTACT_TEXT}') and @aria-disabled="false"]`)
  }

  async createContact(email) {
    console.log(`Createing contact with email: ${email}`)
    const [newContactButton] = await this.outlookPage.$x(`//button[contains(., '${NEW_CONTACT_TEXT}')]`)
    await newContactButton.click()
  }

  openLinkedInSection() {

  }

  isLinkedInProfileExists() {

  }

  openLinkedIn() {

  }

  connectWithNote() {

  }

  closeLinkedInPage() {

  }
}

module.exports = Browser