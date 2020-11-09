const { getModule } = require('awsdynamoutils')

const storage = require('./storage')

const { paginationAware, projectionExpression, setNewValue } = getModule()
const scan = paginationAware('scan')
const USERS_TABLE_NAME = 'pomodoro_users'
const NEEDED_USER_FIELDS = ['email', 'name', 'sets', 'registrationDate', 'id']

const getFirstName = name => {
  const [firstName] = name.split(' ')
  return firstName.charAt(0).toUpperCase() + firstName.slice(1)
}

const NO_SETS_TEXTS = [
  `I'm curious, what didn't you like about Increaser?`
]

const WITH_SETS_TEXTS = [
  `I'm curious, what lead you to Increaser?`,
  `I'm curious, what problems do you try to solve with Increaser?`,
  `I'm curious, what tool did you work with before you tried Increaser?`
]

const getNote = (name, sets) => {
  const firstName = getFirstName(name)
  const greeting = `Hi ${firstName}!`

  const textOptions = sets.length > 0 ? WITH_SETS_TEXTS : NO_SETS_TEXTS
  const text = textOptions[Math.floor(Math.random() * textOptions.length)]

  return `${greeting} ${text}`
}

const getNewUsers = (lastDate) => 
  scan({
    TableName: USERS_TABLE_NAME,
    ...projectionExpression(NEEDED_USER_FIELDS),
    FilterExpression: 'registrationDate > :lastDate',
    ExpressionAttributeValues: {
      ':lastDate': lastDate
    }
  })

const setUserLinkedInProfile = (id, linkedInProfile) => 
  setNewValue(
    {
      TableName: USERS_TABLE_NAME,
      Key: { id }
    },
    'linkedInProfile',
    linkedInProfile
  )

class Business {
  constructor(browser) {
    this.browser = browser
  }

  async run() {
    const users = await getNewUsers(storage.getLastDate())
    console.log(`New users count: ${users.length}`)
    const orderedUsers = users
      .sort((a, b) => a.registrationDate - b.registrationDate)
    await this.browser.openOutlook()

    for await (const user of orderedUsers) {
      await this.browser.createContact(user.email)
      await this.browser.openLinkedInSection()
      const linkedInButton = await this.browser.getLinkedInButton()
      if (linkedInButton) {
        const note = getNote(user.name, user.sets)
        const linkedInProfile = await this.browser.connectOnLinkedIn(linkedInButton, note)
        await setUserLinkedInProfile(user.id, linkedInProfile)
      }
      storage.setLastDate(user.registrationDate)
    }
  }
}


module.exports = Business