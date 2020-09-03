
const db = require('../models');

const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let options = {
    usernameField: 'email'
}

// passport is scraping header info from request 
// (its middleware so it can see it)
let localLogin = new LocalStrategy(options, (email, password, done)=>{

    // check to see if email is in our database

    db.user.findAll({where: {email: email}})
    .then(results => {
        // check to see if there is an email
        // if no email then invalid login 
        if(results != null)
        {
            // compare passwords
            let user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch)=>{

                // error in comparing passwords
                if(err)
                {
                    return done(err);
                }
                
                // mismatch database password
                if(!isMatch)
                {
                    return done(null, false)
                }
                
                // valid user
                return done(null, user)

            })

        }
        else
        {
            // no email was found
            // exit with an error
            return done(null, false);
        }
    })
    .catch(err => {
        return done(err);
    })

});

passport.use(localLogin);

