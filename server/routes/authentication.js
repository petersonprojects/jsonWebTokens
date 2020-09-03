
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let config = require('../secrets');

let db = require('../models');

let bcrypt = require('bcryptjs');

const jwt = require('jwt-simple');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

let passport = require('passport');
let passportService = require('../config/passAuth');

let requireSignin = passport.authenticate('local', {session: false});
let requireAuth = passport.authenticate('jwt', {session: false});

let token = (user) => {
    let timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

router.get('/', requireAuth, (req, res) => {
    res.send('hello world');
})

// user is logging in with credentials that have been registered
router.post('/signin', requireSignin, (req, res) => {

    // req.user (from passAuth done(null, user))
    // pass back json web token
    // cookies dont work cross domain so we use token based authentication
    res.json({token: token(req.user)});
})

// user is registering
router.post('/signup', (req, res) => {

    // create an entry in our database
    // email, password

    let email = req.body.email;

    let password = bcrypt.hashSync(req.body.password, 8);

    db.user.findAll({where: {email: email}})
    .then(results => {

        if(results.length === 0)
        {
            // no duplicates detected
            // take credentials and add them to database

            db.user.create({email: email, password: password})
            .then(user => {
                // on success, return a JWT
                return res.json({token: token(user)});
            })
            .catch(error => {
                res.status(423).send({error: 'Failure adding to database'});
            })
        }
        else
        {
            // a duplicate has been found
            return res.status(422).send({error: 'Email already exists'})
        }

    })

})


module.exports = router;