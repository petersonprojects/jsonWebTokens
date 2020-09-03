
const express = require('express');

const app = express();

app.use(require('./routes/authentication'))

// comments for reference
// user info from login form
// let userInfo = {
//     id: '12345',
//     username: 'Micah',
//     email: 'me@me.com'
// }

// let token = (user) => {

//     let timestamp = new Date().getTime();

//     return jwt.encode({sub:user.id, user, iat:timestamp}, "mySecretIsSafeHere")

// }

// let tokenID = token(userInfo)

// console.log(jwt.decode(tokenID, "mySecretIsSafeHere"));

app.listen(3001, ()=>{
    console.log('Running node on port: 3001...')
})