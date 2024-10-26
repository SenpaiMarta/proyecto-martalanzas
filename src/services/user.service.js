import userRepository from "../repositories/user.repository.js"
import { createHash, isValidPassword } from "../utils/utils.js"

class UserServices {
    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email)
        if(existingUser) throw new Error("Este usuario ya existe")

        userData.password = createHash(userData.password)
        return await userRepository.createUser(userData)
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email)
        if(!user || !isValidPassword(password, user)) throw new Error("La identificación facilitada no corresponde a ningún usuario")
        return user 
    }

    async getUserById(id) {
        return await userRepository.getUserById(id)
    }
}

export default new UserServices()