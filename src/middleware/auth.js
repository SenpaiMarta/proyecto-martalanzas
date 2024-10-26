export function soloAdmin(req, res, next) {
    if(req.user.role === "admin") {
        next()
    } else {
        res.status(403).send("En esta parte de la web solo pueden entrar usuarios admin, lo sentimos.")
    }
}

export function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next()
    } else {
        res.status(403).send("Estás en la parte de la web que solo pueden ver los usuarios.")
    }
}