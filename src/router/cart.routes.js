// cart.routes.js

import { Router } from 'express'
import CartManager from '../managers/CartsManager.js'
import Cart from '../models/cart.js'

const router = Router()
const cartManager = new CartManager()

router.delete('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params

    try {
        const cart = await Cart.findById(cid)
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        cart.products.pull(pid)
        await cart.save()

        res.json({ status: 'success', message: 'Producto eliminado del carrito' })
    } catch (err) {
        next(err)
    }
})

router.put('/:cid', async (req, res, next) => {
    const { cid } = req.params
    const { products } = req.body

    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true })
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        res.json({ status: 'success', cart })
    } catch (err) {
        next(err)
    }
})

router.put('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params
    const { cantidad } = req.body

    try {
        const cart = await Cart.findById(cid)
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        const productIndex = cart.products.findIndex(p => p.equals(pid))
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Este producto no está en el carrito' })
        }

        cart.products[productIndex].cantidad = cantidad
        await cart.save()

        res.json({ status: 'success', message: 'Catidad actualizada' })
    } catch (err) {
        next(err)
    }
})

router.delete('/:cid', async (req, res, next) => {
    const { cid } = req.params

    try {
        const cart = await Cart.findByIdAndDelete(cid)
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        res.json({ status: 'success', message: 'Hemos eliminado tu carrito' })
    } catch (err) {
        next(err)
    }
})

router.get('/:cid', async (req, res, next) => {
    const { cid } = req.params

    try {
        const cart = await Cart.findById(cid).populate('products')
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        res.json({ status: 'success', cart })
    } catch (err) {
        next(err)
    }
})

export default router
