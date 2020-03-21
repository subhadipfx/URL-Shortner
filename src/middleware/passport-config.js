const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const redis = require('./redis');
const Mailer = require('../MailService');
const auth = (passport) => {
    passport.use('signinStrategy',new LocalStrategy({ usernameField : 'email', passwordField:'password'}, async (email,password,done) => {
        let user = await redis.get(email).then( data => data)
                                            .catch(err => console.error('redis-get error in passport',err));
        user = JSON.parse(user);
        // let user = null;
        if(user === null){
            user = await User.findOne({email});
            redis.set(user.email,JSON.stringify(user)).then(console.log('profile saved in cache'))
                    .catch(err => console.error('redis-set error in passport',err));
            if(!user){
                return done(null,false,{message : 'Invalid Email'})
            }
        }
        try {
            if( await bcrypt.compare( password, user.password)){
                return done(null,user);
            }else{
                return done(null,false,{message: 'Incorrect Password'})
            }
        }catch (e) {
            return done(e)
        }
    }));
    passport.serializeUser((user , done) => {
        done(null,user._id);
    });
    passport.deserializeUser( async (id , done) => {
        done(null,await User.findById(id))
    });
    passport.use('signupStrategy', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true
        },
        async (req,email,password, done) =>{
            try{
                if( await User.validate(req.body).then( res => res) === false){
                    return done(404);
                }
                const user = await User.create(req.body);
                Mailer.sendMail(Mailer.mailOptions(user.email,Mailer.templates.newUser(user.firstName)));
                return done(null,user)
            }catch (e) {
                return  done(e);
            }
        }));
};

module.exports = auth;