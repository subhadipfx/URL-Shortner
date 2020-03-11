const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const auth = (passport) => {
    passport.use(new LocalStrategy({ usernameField : 'email', passwordField:'password'}, async (email,password,done) => {
        const user = await User.findOne({email});
        if(!user){
            return done(null,false,{message : 'Invalid Email'})
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
    passport.deserializeUser((id , done) => {
        done(null,User.findById(id))
    });
};

module.exports = auth;