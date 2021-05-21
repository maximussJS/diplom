const { createTestAccount } = require('nodemailer')

createTestAccount().then(console.log).catch(console.error)