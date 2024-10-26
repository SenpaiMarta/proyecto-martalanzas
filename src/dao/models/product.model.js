import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: true },
    descripcion: { 
        type: String, 
        required: true },
    precio: { 
        type: Number, 
        required: true },
    imagen: { 
        type: String, 
        required: true },
    codigo: { 
        type: String, 
        required: true },
    stock: { 
        type: Number, 
        required: true },
    categoria: {
        type: String,
        required: true },
    estado: {
        type: Boolean,
        required: true },
    thumbnails: {
        type: [String]
    }
})

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model('Product', productSchema)

export default ProductModel
