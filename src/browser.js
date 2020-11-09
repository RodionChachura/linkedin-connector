const puppeteer = require('puppeteer')

const OUTLOOK_PAGE = 'https://outlook.live.com/people/0'
const NEW_CONTACT_TEXT = 'New contact'
const EMAIL_INPUT_ID = 'PersonaEmails1-0'
const CREATE_CONTACT_TEXT = 'Create'
const LINKEDIN_TAB_TEXT = 'LinkedIn'
const NO_LINKEDIN_PROFILE_TEXT = 'View search results on LinkedIn'
const POSITIVE_LINKEDIN_TEXTS = [
  'See full profile on LinkedIn',
  'View profile on LinkedIn'
]
const MORE_TEXT = 'More…'
const CONNECT_TEXT = 'Connect'
const ADD_NOTE_TEXT = 'Add a note'
const SEND_TEXT = 'Send'
const NOTE_INPUT_ID = 'custom-message'

const getButtonXPath = (text) => `//button[contains(., '${text}')]`

const enterText = async (page, inputId, text) => {
  const selector = `#${inputId}`
  await page.waitForSelector(selector)
  await page.type(selector, text, { delay: 20 })
}

const clickButton = async (page, text) => {
  const buttonXPath = getButtonXPath(text)
  await page.waitForXPath(buttonXPath)
  const [button] = await page.$x(buttonXPath)
  await button.click()
}

const waitForOneOfButtons = async (page, ...buttonsTexts) => {
  const xPath = buttonsTexts.map(getButtonXPath).join(' | ')
  const button = await page.waitForXPath(xPath)
  return button
}

const pressConnectButton = () => {
  const CLASS_NAME = 'pv-s-profile-actions--connect'
  const [button] = document.getElementsByClassName(CLASS_NAME)
  button.click()
}

const pressAddNoteButton = () => {
  const ARIA_LABEL = 'Add a note'
  const button = document.querySelector(`[aria-label="${ARIA_LABEL}"]`)
  button.click()
}

const pressSendButton = () => {
  const ARIA_LABEL = 'Send now'
  const button = document.querySelector(`[aria-label="${ARIA_LABEL}"]`)
  button.click()
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

    await enterText(this.outlookPage, EMAIL_INPUT_ID, email)
    await clickButton(this.outlookPage, CREATE_CONTACT_TEXT)
    await this.outlookPage.waitForSelector(`#${EMAIL_INPUT_ID}`, { hidden: true })
  }

  async openLinkedInSection() {
    await clickButton(this.outlookPage, LINKEDIN_TAB_TEXT)
  }

  async getLinkedInButton() {
    const button = await waitForOneOfButtons(this.outlookPage, NO_LINKEDIN_PROFILE_TEXT, ...POSITIVE_LINKEDIN_TEXTS)
    const text = await this.outlookPage.evaluate(e => e.textContent, button)
    const isExists = POSITIVE_LINKEDIN_TEXTS.some(t => text.includes(t))
    if (isExists) {
      return button
    }
  }

  async connectOnLinkedIn(button, note) {
    await button.click()
    const linkedInPage = await new Promise(x => this.browser.once('targetcreated', target => x(target.page())))
    await waitForOneOfButtons(linkedInPage, CONNECT_TEXT, MORE_TEXT)
    await linkedInPage.evaluate(pressConnectButton)

    await linkedInPage.evaluate(pressAddNoteButton)
    await enterText(linkedInPage, NOTE_INPUT_ID, note)
    await linkedInPage.evaluate(pressSendButton)
    await linkedInPage.waitForSelector(`#${NOTE_INPUT_ID}`, { hidden: true })

    const url = linkedInPage.url()
    const splittedUrl = url.split('/')
    const [linkedInProfile] = splittedUrl[splittedUrl.indexOf('in') + 1].split('?')

    await linkedInPage.close()

    return decodeURI(linkedInProfile)
  }
}

module.exports = Browser