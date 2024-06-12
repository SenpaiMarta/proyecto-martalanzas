import { Router } from 'express'
import { readProductsFile } from '../helpers/fileHelper.js'

const router = Router()

router.get('/products', async (req, res) => {
    try {
        const products = await readProductsFile();
        res.render('index', { title: 'Lista de productos estáticos', products })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.get('/realTimeProds', async (req, res) => {
    try {
        const products = await readProductsFile()
        products.forEach(product => {
            product.precio = parseFloat(product.precio.toFixed(2))
        })
        res.render('realTimeProds', { title: 'Productos actualizados en tiempo real', products })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

export default router
