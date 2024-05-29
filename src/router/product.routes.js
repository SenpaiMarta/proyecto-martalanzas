import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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
};
//Habilitamos la escritura en el json de productos
const writeProductsFile = async (products) => {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
    } catch (error) {
        console.error('No hemos podido añadir este producto', error)
    }
};
//Método GET: leemos el json de productos
router.get('/products', async (req, res) => {
    const products = await readProductsFile()
    res.json(products)
});
//Método GET: obtenemos productos solo por ID
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    if (isNaN(Number(pid))) {
        return res.status(400).send('No hay ningún producto con ese ID, ¿seguro que se escribe así?')
    }

    const products = await readProductsFile()
    const product = products.find((product) => product.id === Number(pid))

    if (!product) {
        return res.status(404).send('¡Vaya! Este producto no está por aquí, ¡sigue mirando!')
    }

    res.json(product)
});
//Método POST: añadimos productos al JSON. Me he encontrado con problemas para añadirlos en array, no sé si esta es la mejor solución o si es válida. De esta froma se pueden añadir tanto de uno en uno como en lista. 
router.post('/products', async (req, res) => {
    let productsArray = req.body
//Convertimos en array si el archivo añadido no fuera un array
    if (!Array.isArray(productsArray)) {
        productsArray = [productsArray]
    }
// Comprobamos que los campos no estén mal escritos
    if (productsArray.length === 0) {
        return res.status(400).json({
            error: '¡Vaya! Parece que los campos están vaciós o mal escrito, ¡revísalo!',
        })
    }

    for (const product of productsArray) {
        const { titulo, descripcion, precio, imagen, codigo, stock } = product
        //Comprobamos que ningún elemento del producto esté vacío.
        if (!titulo || !descripcion || !precio || !imagen || !codigo || !stock) {
            return res.status(400).json({
                error: 'Debes rellenar todos los campos para que podamos incluir el producto, gorrión.',
            })
        }
    }
//Leemos la lista de producto y comprobamos los id para crear uno para cada producto según su orden y según los anteriores id existentes.
    const products = await readProductsFile()

    for (const product of productsArray) {
        const { titulo, descripcion, precio, imagen, codigo, stock } = product
        const newProduct = new Product(titulo, descripcion, precio, imagen, codigo, stock)
        newProduct.id = products.length > 0 ? products[products.length - 1].id + 1 : 1
        products.push(newProduct)
    }

    await writeProductsFile(products)

    res.status(201).json(productsArray)
});


//Método PUT: modificamos productos
router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { titulo, descripcion, precio, imagen, codigo, stock } = req.body

    if (isNaN(Number(pid))) {
        return res.status(400).send('No hay ningún producto con ese ID, ¿seguro que se escribe así?')
    }

    const products = await readProductsFile()
    const productIndex = products.findIndex((product) => product.id === Number(pid))

    if (productIndex === -1) {
        return res.status(404).send('¡Vaya! Este producto no está por aquí, ¡sigue mirando!')
    }

    if (titulo) products[productIndex].titulo = titulo
    if (descripcion) products[productIndex].descripcion = descripcion
    if (precio) products[productIndex].precio = precio
    if (imagen) products[productIndex].imagen = imagen
    if (codigo) products[productIndex].codigo = codigo
    if (stock) products[productIndex].stock = stock

    await writeProductsFile(products)

    res.json(products[productIndex])
});
//Método DELETE: eliminamos un producto.
router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params

    if (isNaN(Number(pid))) {
        return res.status(400).send('No hay ningún producto con ese ID, ¿seguro que se escribe así?')
    }

    const products = await readProductsFile()
    const productIndex = products.findIndex((product) => product.id === Number(pid))

    if (productIndex === -1) {
        return res.status(404).send('¡Vaya! Este producto no está por aquí, ¡sigue mirando!')
    }

    const deletedProduct = products.splice(productIndex, 1)
    await writeProductsFile(products)

    res.json(deletedProduct[0])
});

export default router

