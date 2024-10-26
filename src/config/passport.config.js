import passport from "passport"
import jwt from "passport-jwt"
import UserModel from "../dao/models/users.model.js"
import {createHash, isValidPassword} from "../utils/utils.js"

const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "cuchufleto"

    }, async(jwt_payload, done) => {
        try {
            return done (null, jwt_payload)
        } catch (error) {
            return done(error)
        }
}))}


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

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["cookieToken"]
    }
    return token 
}

/*passport.serializeUser((user, done) => {
    done(null, user_id)
})

passport.deserializeUser, async (id, done) => {
    let user = await UserModel.findById({_id: id})
    done(null, user)

}

}*/

export default initializePassport