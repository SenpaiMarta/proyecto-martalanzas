import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    estado: Boolean,
    precio: Number,
    imagen: String,
    codigo: String,
    stock: Number
})

const Product = mongoose.model('Product', productSchema)

class ProductManager {
    async getAllProducts() {
        return await Product.find()
    }

    async addProduct(product) {
        const newProduct = new Product(product)
        return await newProduct.save()
    }

    async updateProduct(id, updatedProduct) {
        return await Product.findByIdAndUpdate(id, updatedProduct, { new: true })
    }

    async deleteProduct(id) {
        await Product.findByIdAndDelete(id)
    }
}

export default ProductManager
