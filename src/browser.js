const puppeteer = require('puppeteer')

const OUTLOOK_PAGE = 'https://outlook.live.com/people/0'
const NEW_CONTACT_TEXT = 'New contact'
const EMAIL_INPUT_ID = 'PersonaEmails1-0'

const getElementWithText = async (parent, tag, text) => {
  const [result] = await parent.$x(`//${tag}[contains(., '${text}')]`)
  return result
}

class Browser {
  constructor(browserWSEndpoint) {
    this.browserWSEndpoint = browserWSEndpoint
  }

  async openOutlook() {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.browserWSEndpoint,
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

    const emailInputSelector = `#${EMAIL_INPUT_ID}`
    await this.outlookPage.waitForSelector(emailInputSelector)
    await this.outlookPage.type(emailInputSelector, email, { delay: 20 })
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