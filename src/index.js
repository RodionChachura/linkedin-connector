const Browser = require('./browser')
const { getNote, getOrderedUsers } = require('./business')
const database = require('./database')
const storage = require('./storage')

const browserWSEndpoint = process.argv[2]
const browser = new Browser(browserWSEndpoint)

const run = async () => {
  const users = await database.getNewUsers(storage.getLastDate())
  if (!users.length) {
    console.log('No new users')
    return
  }
  
  console.log(`New users count: ${users.length}`)
  const orderedUsers = getOrderedUsers(users)

  await browser.openOutlook()

  for await (const user of orderedUsers) {
    await browser.createContact(user.email)
    await browser.openLinkedInSection()
    const linkedInButton = await browser.getLinkedInButton()
    if (linkedInButton) {
      const note = getNote(user)
      const linkedInProfile = await browser.connectOnLinkedIn(linkedInButton, note)
      await database.setUserLinkedInProfile(user.id, linkedInProfile)
    }
    storage.setLastDate(user.registrationDate)
  }

  await browser.close()
}

run()