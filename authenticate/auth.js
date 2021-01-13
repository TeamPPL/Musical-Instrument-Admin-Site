const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const adminAccountModel = require('../models/adminAccountsModel');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let account = await adminAccountModel.findAdminById(id);

        if (account == null) 
        {
          done(null, false);
        }
        else
        {
          done(null, account);
        }
     });
    
    passport.use(
      new LocalStrategy( async (username, password, done) => {
        let account = await adminAccountModel.findAdminByUsername(username);
        
        //Account doesn't exist
        if (account == null) 
        {
          return done(null, false, {message: "This username doesn't exist!"});
        }

        //Check password
        if (!bcrypt.compareSync(password, account.password))
        //if (password == account.password)
        {
          //Incorrect
         return done(null, false, {message: "Incorrect password!"});
        }
        //Correct

        //Check if the account is locked by admin
        if (account.isLocked)
        {
          return done(null, false, {message: "Your account has been locked.Contact admin to resolve this!"})
        }

        return done(null, account);
      })
    );

};