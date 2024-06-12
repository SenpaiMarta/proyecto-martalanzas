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

module.exports = CartsManager;