import express from "express"
const router = express.Router()
import ProductManager from "../dao/db/product-manager-db.js"
const productManager = new ProductManager()

router.get('/', async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query, category, available } = req.query

        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query 
        })

        res.json({
            estado: "exitoso",
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        })

    } catch (error) {
        console.log("Error al obtener los productos", error)
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor"
        })
    }
})

router.get('/:pid', async (req, res) => {
    const id = req.params.pid

    try {
        const producto = await productManager.findById(pid)
        if (!producto) {
            return res.status(404).json({ error: 'El producto no existe' })
        }
        res.json({ status: 'success', payload: producto })

    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})


router.post("/", async (req, res) => {
    const nuevoProducto = req.body

    try {
        await productManager.addProduct(nuevoProducto)
        res.status(201).json({
            message: "Producto agregado exitosamente"
        })
    } catch (error) {
        console.error("Error al agregar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})


router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const productActualizado = req.body

    try {
        await productManager.updateProduct(id, productActualizado)
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid

    try {
        await ProductManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error)
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
})

export default productRouter
