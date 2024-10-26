import express from "express"
import exphbs from "express-handlebars"
import passport from "passport"
import cookieParser from "cookie-parser"
import initializePassport from "./config/passport.config.js"
import "./database.js"

import productRouter from "./router/product.routes.js"
import cartRouter from "./router/cart.routes.js"
import viewsRouter from "./router/views.routes.js"
import sessionRouter from "./router/session.router.js"

const app = express()
const PUERTO = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("./src/public"))
app.use(cookieParser())
app.use(passport.initialize())
initializePassport()

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
