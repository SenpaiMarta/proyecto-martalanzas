import CartModel from "../models/cart.model.js"

class CartManager {
    async crearCart() {
        try {
            const nuevoCart = new CartModel({
                products: []
            })
            await nuevoCart.save()
            return nuevoCart
        } catch (error) {
            console.log("Error al intentar cargar el nuevo carrito de compras")
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId)
            if (!carrito) {
                console.log("No hay ningún carrito con ese ID. ¡Intenta de nuevo!")
                return null
            }

            return carrito
        } catch (error) {
            console.log("No hemos podido recuperar este carrito, ¡intenta de nuevo!", error)
        }
    }

    async addProductoCart(cartId, productId, quantity=1) {
        try {
            const carrito = await this.getCarritoById(cartId)
            const productoRepetido = carrito.products.find(item => item.producto-toString() === productId)

            if (productoRepetido) {
                productoRepetido.quantity += quantity
            } else {
                carrito.products.push({producto: productId, quantity})
            }

            carrrito.marModified("products")

            await carrito.save()
            return carrito 

        } catch (error) {
            console.log("Error al intentar añadir el producto, ¡intenta de nuevo!", error)
        }
    }
}

export default CartManager 