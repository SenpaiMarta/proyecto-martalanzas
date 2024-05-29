import express from 'express'
import productsRoutes from './src/router/product.routes.js'
import cartRoutes from './src/router/cart.routes.js'
import __dirname from "./dirname.js"


const app = express()
const PORT = 8080

app.use(express.json())
app.use('/api', productsRoutes)
app.use('/api', cartRoutes)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
