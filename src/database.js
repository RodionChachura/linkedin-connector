const { getModule } = require('awsdynamoutils')

const { paginationAware, projectionExpression, setNewValue } = getModule()
const scan = paginationAware('scan')
const USERS_TABLE_NAME = 'pomodoro_users'
const NEEDED_USER_FIELDS = ['email', 'name', 'sets', 'registrationDate', 'id']

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

module.exports = {
  getNewUsers,
  setUserLinkedInProfile
}