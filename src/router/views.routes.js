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

export default router
