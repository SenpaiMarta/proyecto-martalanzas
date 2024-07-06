import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            cantidad: Number
        }
    ]
})

const Cart = mongoose.model('Cart', cartSchema)

class CartManager {
    async createCart() {
        const cart = new Cart({ products: [] })
        return await cart.save()
    }

    async addProductToCart(cid, pid, cantidad) {
        const cart = await Cart.findById(cid)
        const productIndex = cart.products.findIndex(p => p.productId.toString() === pid)
        if (productIndex >= 0) {
            cart.products[productIndex].cantidad += cantidad
        } else {
            cart.products.push({ productId: pid, cantidad })
        }
        return await cart.save()
    }

    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.productId')
    }

    async removeProductFromCart(cid, pid) {
        const cart = await Cart.findById(cid)
        cart.products = cart.products.filter(p => p.productId.toString() !== pid)
        await cart.save()
    }

    async deleteCart(cid) {
        await Cart.findByIdAndDelete(cid)
    }
}

export default CartManager