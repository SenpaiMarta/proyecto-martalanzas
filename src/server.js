import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import mongoose from 'mongoose'
import { create } from 'express-handlebars'
import path from 'path'
import __dirname from './dirname.js'
import viewsRoutes from './router/views.routes.js'
import productsRoutes from './router/product.routes.js'
import cartsRoutes from './router/cart.routes.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Configuración de Handlebars
const hbs = create({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.use('/products', viewsRoutes)
app.use('/realTimeProds', viewsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

// Socket.io
io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

const PORT = 8080
const MONGO_URL = 'mongodb://localhost:27017/mydatabase'

mongoose.connect(MONGO_URL)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Database connection error:', err)
    })