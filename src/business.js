const { getModule } = require('awsdynamoutils')

const storage = require('./storage')

const { paginationAware, projectionExpression } = getModule()
const scan = paginationAware('scan')
const USERS_TABLE_NAME = 'pomodoro_users'
const NEEDED_USER_FIELDS = ['email', 'name', 'sets', 'registrationDate']

const getNewUsers = (lastDate) => 
  scan({
    TableName: USERS_TABLE_NAME,
    ...projectionExpression(NEEDED_USER_FIELDS),
    FilterExpression: 'registrationDate > :lastDate',
    ExpressionAttributeValues: {
      ':lastDate': lastDate
    }
  })

class Business {
  constructor(browser) {
    this.browser = browser
  }

  async run() {
    const users = await getNewUsers(storage.getLastDate())
    console.log(`New users count: ${users.length}`)
    const orderedUsers = users
      .sort((a, b) => a.registrationDate - b.registrationDate)
      // for testing
      .slice(0, 1)
    await this.browser.openOutlook()

    for await (const user of orderedUsers) {
      await this.browser.createContact(user.email)
      const hasLinkedIn = await this.browser.isLinkedInProfileExists()
      console.log(hasLinkedIn)
      // if (hasLinkedIn) {
      //   await this.browser.openLinkedIn()
      // }
      // storage.setLastDate(user.registrationDate)
    }
  }
}


module.exports = Business