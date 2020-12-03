const getFirstName = (name) => {
  const [firstName] = name.split(' ')
  return firstName.charAt(0).toUpperCase() + firstName.slice(1)
}

const NO_SETS_TEXTS = [
  `I'm curious, what didn't you like about Increaser?`
]

const WITH_SETS_TEXTS = [
  `I'm curious, what led you to Increaser?`,
  `I'm curious, what problems do you try to solve with Increaser?`,
  `I'm curious, what tool did you work with before you tried Increaser?`
]

const getNote = ({ name, sets }) => {
  const firstName = getFirstName(name)
  const greeting = `Hi ${firstName}!`

  const textOptions = sets.length > 0 ? WITH_SETS_TEXTS : NO_SETS_TEXTS
  const text = textOptions[Math.floor(Math.random() * textOptions.length)]

  return `${greeting} ${text}`
}

const getOrderedUsers = users => 
  users.sort((a, b) => a.registrationDate - b.registrationDate)

module.exports = {
  getOrderedUsers,
  getNote
}