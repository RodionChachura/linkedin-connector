const puppeteer = require('puppeteer')

const OUTLOOK_PAGE = 'https://outlook.live.com/people/0'
const NEW_CONTACT_TEXT = 'New contact'
const EMAIL_INPUT_ID = 'PersonaEmails1-0'
const CREATE_CONTACT_TEXT = 'Create'
const LINKEDIN_TAB_TEXT = 'LinkedIn'
const NO_LINKEDIN_PROFILE_TEXT = 'View search results on LinkedIn'
const LINKEDIN_PROFILE_TEXT = 'See full profile on LinkedIn'
const CONNECT_TEXT = 'Connect'
const ADD_NOTE_TEXT = 'Add a note'
const SEND_TEXT = 'Send'

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
    this.browser = await puppeteer.connect({
      browserWSEndpoint: this.browserWSEndpoint,
      defaultViewport: null
    })

    this.outlookPage = await this.browser.newPage()
    await this.outlookPage.goto(OUTLOOK_PAGE)
    await this.outlookPage.waitForXPath(`//div[contains(., '${NEW_CONTACT_TEXT}') and @aria-disabled="false"]`)
  }

  async createContact(email) {
    console.log(`Creating contact with email: ${email}`)
    await clickButton(this.outlookPage, NEW_CONTACT_TEXT)

    const emailInputSelector = `#${EMAIL_INPUT_ID}`
    await this.outlookPage.waitForSelector(emailInputSelector)
    await this.outlookPage.type(emailInputSelector, email, { delay: 20 })

    await clickButton(this.outlookPage, CREATE_CONTACT_TEXT)
    await this.outlookPage.waitForSelector(emailInputSelector, { hidden: true })
  }

  async openLinkedInSection() {
    await clickButton(this.outlookPage, LINKEDIN_TAB_TEXT)
  }

  async isLinkedInProfileExists() {
    const oneOfTwoButtonsXPath = `//button[contains(., '${NO_LINKEDIN_PROFILE_TEXT}')] | //button[contains(., '${LINKEDIN_PROFILE_TEXT}')]`

    const button = await this.outlookPage.waitForXPath(oneOfTwoButtonsXPath)
    const text = await this.outlookPage.evaluate(e => e.textContent, button)
    return text.includes(LINKEDIN_PROFILE_TEXT)
  }

  async connectOnLinkedIn(note) {
    await clickButton(this.outlookPage, LINKEDIN_PROFILE_TEXT)
    const linkedInPage = await new Promise(x => this.browser.once('targetcreated', target => x(target.page())))
    await clickButton(linkedInPage, CONNECT_TEXT)
    await clickButton(linkedInPage, ADD_NOTE_TEXT)

    const url = linkedInPage.url()
    const splittedUrl = url.split('/')
    const [linkedInProfile] = splittedUrl[splittedUrl.indexOf('in') + 1].split('?')
    return decodeURI(linkedInProfile)
  }
}

module.exports = Browser