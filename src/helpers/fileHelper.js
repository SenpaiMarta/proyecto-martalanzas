import fs from 'fs/promises'
import path from 'path'
import __dirname from "../dirname.js"

const productsFilePath = path.join(__dirname, '../data/products.json')

export const readProductsFile = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading products file:', error)
        return []
    }
}

export const writeProductsFile = async (products) => {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2))
    } catch (error) {
        console.error('Error writing products file:', error)
    }
}
