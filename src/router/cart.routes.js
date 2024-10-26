import express from "express"
const router = express.Router()
import CartManager from "../dao/db/cart-manager-db.js"
const cartManager = new CartManager()
import CartModel from "../dao/models/cart.model.js"

router.post("/", async (req, res) => {
    try {
        const nuevoCart = await cartManager.crearCart()
        res.json(nuevoCart)

    } catch (error) {
        console.log("Error al intentar crear un nuevo carrito, lo sentimos", error)
        res.status(500).json({error: "Error interno del server"})
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid

    try {
        const carrito = await CartModel.findById(cartId)

        if (!carrito) {
            console.log("No existe ningún carrito con el id indicado")
            return res.status(404).json({error: "El carrito no se ha encontrado"})
        }

        return res.json(carrito.products)

    } catch (error) {
         console.log("No se ha podido obtener el carrito", error)
         res.status(500).json({error: "Error interno del servidor"})
    }
})


router.delete('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params

    try {
        const carrito = await carrito.findById(cid)
        if (!carrito) {
            return res.status(404).json({ error: 'El carrito no existe' })
        }

        carrito.products.pull(pid)
        await cart.save()

        res.json({ status: 'success', message: 'Producto eliminado del carrito' })
    } catch (errror) {
        console.log("No se ha podido eliminar el producto del carrito", error)
        res.status(500).json({error: "Error interno del servidor"})    
    }
})

router.delete('/:cid', async (req, res, next) => {
    const { cid } = req.params

    try {
        const carrito = await carrito.findByIdAndDelete(cid)
        if (!carrito) {
            return res.status(404).json({ error: "El carrito no existe"})
        }

        res.json({ status: 'success', message: 'Hemos eliminado tu carrito' })
    } catch (error) {
        console.log("No se ha podido eliminar el carrito", error)
        res.status(500).json({error: "Error interno del servidor"})    }
})


export default cartRouter
