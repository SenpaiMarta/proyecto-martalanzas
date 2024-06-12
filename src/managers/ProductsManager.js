import fs from 'fs/promises'
import path from 'path'
import __dirname from "./dirname.js"

const productsFilePath = path.join(__dirname, '../../data/products.json')

class Product {
    constructor(titulo, descripcion, precio, imagen, codigo, stock) {
        this.id = 0
        this.titulo = titulo
        this.descripcion = descripcion
        this.estado = true
        this.precio = precio
        this.imagen = imagen
        this.codigo = codigo
        this.stock = stock
    }
}
//Accedemos al json creado de productos
const readProductsFile = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error)
        return []
    }
}
//Habilitamos la escritura en el json de productos
const writeProductsFile = async (products) => {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
    } catch (error) {
        console.error('No hemos podido añadir este producto', error)
    }
}

module.exports = ProductsManager