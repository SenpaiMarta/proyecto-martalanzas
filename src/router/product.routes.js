import { Router } from 'express'
import ProductManager from '../managers/ProductsManager.js'
import Product from '../models/products.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query, category, available } = req.query

        let filter = {}

        if (query) {
            filter.tipo = query
        }

        if (category) {
            filter.categoria = category
        }

        if (available) {
            filter.disponible = available === 'true'
        }

        const parsedLimit = parseInt(limit)
        const parsedPage = parseInt(page)

        const count = await Product.countDocuments(filter)

        let sortOptions = {}
        if (sort) {
            if (sort === 'asc') {
                sortOptions = { precio: 1 }
            } else if (sort === 'desc') {
                sortOptions = { precio: -1 }
            }
        }

        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit)

        const totalPages = Math.ceil(count / parsedLimit)
        const hasPrevPage = parsedPage > 1
        const hasNextPage = parsedPage < totalPages

        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${parsedPage - 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${parsedPage + 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null

        const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? parsedPage - 1 : null,
            nextPage: hasNextPage ? parsedPage + 1 : null,
            page: parsedPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        }

        res.json(response)
    } catch (err) {
        next(err)
    }
})

router.get('/:pid', async (req, res, next) => {
    const { pid } = req.params
    try {
        const product = await Product.findById(pid)
        if (!product) {
            return res.status(404).json({ error: 'El producto no existe' })
        }
        res.json({ status: 'success', payload: product })
    } catch (err) {
        next(err)
    }
})


router.post('/:pid/add-to-cart', async (req, res, next) => {
    const { pid } = req.params
    try {
        const cartId = req.body.cartId 
        await productManager.addToCart(pid, cartId)
        res.json({ status: 'success', message: 'Producto añadido al carrito' })
    } catch (err) {
        next(err)
    }
})

export default router
