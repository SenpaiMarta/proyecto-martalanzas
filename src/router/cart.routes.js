import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cartFilePath = path.join(__dirname, '../../data/cart.json')
const productsFilePath = path.join(__dirname, '../../data/products.json')

class Cart {
    constructor() {
        this.id = 0;
        this.products = []
    }
}
//Leemos en el json de cart si hay algún carrito
const readCartFile = async () => {
    try {
        const data = await fs.readFile(cartFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error al leer el archivo del carrito:', error)
        return []
    }
};
//Habilitamos la escritura al crear al carrito en el cart.json
const writeCartFile = async (cart) => {
    try {
        await fs.writeFile(cartFilePath, JSON.stringify(cart, null, 2))
    } catch (error) {
        console.error('¡Oh! No se ha podido crear el carrito', error)
    }
};
//Leemos los productos que haya en el carrito en cart.json
const readProductsFile = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Vaya, no hemos podido encontrar los productos', error)
        return [];
    }
};
//Añadimos el carrito y le otorgamos un id igual que hicimos en productos
router.post('/carts', async (req, res) => {
    const carts = await readCartFile()
    const newCart = new Cart()
    newCart.id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1

    carts.push(newCart)
    await writeCartFile(carts)

    res.status(201).json(newCart)
});
//Añadimos productos al carriño empujándolos desde su id
router.post('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    const carts = await readCartFile()
    const cart = carts.find((cart) => cart.id === Number(cid))
    //Si no existe el carrito...
    if (!cart) {
        return res.status(404).send('Parece que este carrito no existe, ¡echa algo a la cesta!')
    }

    const products = await readProductsFile()
    const product = products.find((product) => product.id === Number(pid))
    //Si no existe el producto...
    if (!product) {
        return res.status(404).send('No hay de ese producto por aquí, ¡sigue mirando!')
    }

    const cartProduct = cart.products.find((p) => p.id === Number(pid));
    if (cartProduct) {
        cartProduct.quantity += 1
    } else {
        cart.products.push({ id: product.id, quantity: 1 })
    }

    await writeCartFile(carts)

    res.status(200).json(cart)
});
//Método GET: leemos el carrito buscándolo por su ID y leemos los productos que tenga dentro.
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params

    const carts = await readCartFile();
    const cart = carts.find((cart) => cart.id === Number(cid))

    if (!cart) {
        return res.status(404).send('Parece que este carrito no existe, ¡echa algo a la cesta!')
    }

    res.json(cart.products)
});

export default router

