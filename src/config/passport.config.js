import passport from "passport"
import local from "passport-local"

import UserModel from "../models/users.js"
import {createHash, isValidPassword} from "../utils/utils.js"

const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use("register", new localStrategy({
        passReqToCallback: true,
        usernameField: "email"

    }, async(req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body
        
        try {
            let user = await UserModel.findOne({email})

            if(user) return done(null, false)

            let newUser = { 
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser)
            return done(null, result)

        } catch (error) {
            return done(error)

        }
}))


passport.use("login", new localStrategy({
    usernameField: "email"
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne( {email})
        if(!user) {
            console.log("ese usuario no existe, amigui")
            return done(null, false)
        }
        if (!isValidPassword(password, user)) return done (null, false)
        
        return done (null, user)

    } catch (error) {
        return done(error)
    }
})) 

passport.serializeUser((user, done) => {
    done(null, user_id)
})

passport.deserializeUser(async, (id, done) => {
    let user = await UserModel.findById({_id: id})
    done(null, user)

})

}

export default initializePassport