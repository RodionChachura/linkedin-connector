const { getModule } = require('awsdynamoutils')

const { paginationAware, projectionExpression } = getModule()
const scan = paginationAware('scan')
const USERS_TABLE_NAME = 'pomodoro_users'

const getNewUsers = (lastDate) => 
  scan({
    TableName: USERS_TABLE_NAME,
    ...projectionExpression(['email', 'name', 'sets']),
    FilterExpression: 'registrationDate > :lastDate',
    ExpressionAttributeValues: {
      ':lastDate': lastDate
    }
  })

class Business {
  constructor(browser, storage) {
    this.browser = browser
    this.storage = storage
  }

  async run() {
    const state = this.storage.get()
    const users = await getNewUsers(state.lastDate)
    console.log(`New users count: ${users.length}`)
    await this.browser.openOutlook()
  }
}


module.exports = Business