const puppeteer = require('puppeteer')

const OUTLOOK_PAGE = 'https://outlook.live.com/people/0'
const NEW_CONTACT_TEXT = 'New contact'
const EMAIL_INPUT_ID = 'PersonaEmails1-0'
const CREATE_CONTACT_TEXT = 'Create'
const LINKEDIN_TAB_TEXT = 'LinkedIn'

const clickButton = async (page, text) => {
  const buttonXPath = `//button[contains(., '${text}')]`
  await page.waitForXPath(buttonXPath)
  const [button] = await page.$x(buttonXPath)
  await button.click()
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
    await clickButton(this.outlookPage, NEW_CONTACT_TEXT)

    const emailInputSelector = `#${EMAIL_INPUT_ID}`
    await this.outlookPage.waitForSelector(emailInputSelector)
    await this.outlookPage.type(emailInputSelector, email, { delay: 20 })

    await clickButton(this.outlookPage, CREATE_CONTACT_TEXT)
    await this.outlookPage.waitForSelector(emailInputSelector, { hidden: true })

    await clickButton(this.outlookPage, LINKEDIN_TAB_TEXT)
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