import { Router } from 'express'
import ProductManager from '../managers/ProductsManager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/products', async (req, res) => {
    const products = await productManager.getAllProducts()
    res.render('index', { products })
})

router.get('/realTimeProds', async (req, res) => {
    const products = await productManager.getAllProducts()
    res.render('realTimeProds', { products })
})

router.get("/login", (req, res) => {
    let usuario = req.query.usuario

    req.session.usuario = usuario
    res.send("Usuario guardado con query")
})

router.get("/usuario", (req, res) => {
if(req.session.usuario) {
    return res.send(`El user registrado es: ${req.session.usuario}`)
    } else {
        return res.send("Aquí no hay nada que ver porque no estás in")
 }})

export default router
