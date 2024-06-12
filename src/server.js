import express from 'express'
import handlebars from "express-handlebars"
import productsRoutes from './router/product.routes.js'
import cartRoutes from './router/cart.routes.js'
import viewRoutes from "./router/views.routes.js"
import __dirname from "./dirname.js"
import path from "path"
import {Server} from "socket.io"
import {createServer} from "http"
import { readProductsFile, writeProductsFile } from './helpers/fileHelper.js'



const app = express()
const server = createServer(app)
const io = new Server(server)

const PORT = 8080
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}: http://localhost:${PORT}`))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', productsRoutes)
app.use('/api', cartRoutes)
app.use('/', viewRoutes)

app.engine( 
    "hbs", 
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "main"
    })
)

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.resolve(__dirname, "../public")));


io.on("connection", (socket) => {
    console.log(`Está online: ${socket.id}`)
  
    socket.on("disconnect", () => {
      console.log(`Está offline: ${socket.id}`)
    })
  
    socket.on('addProduct', async (product) => {
        const products = await readProductsFile();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product
        };
        products.push(newProduct);
        await writeProductsFile(products);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', async (id) => {
        const products = await readProductsFile();
        const newProducts = products.filter(p => p.id !== id);
        await writeProductsFile(newProducts);
        io.emit('updateProducts', newProducts);
    });
});