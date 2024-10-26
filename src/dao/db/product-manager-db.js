import ProductModel from "../models/product.model.js"

class ProductManager {
    async addProduct ({titulo, descripcion, precio, imagen, id, stock, categoria, thumbnails}) {
        try {
            if (!titulo || !descripcion || !precio || !stock || !categoria) {
                console.log("Debes rellenar todos los campos obligatorios, ¡revisa!")
                return 
            }

            const existeProduct = await ProductModel.findOne({id: id})

            if(existeProduct) {
                console.log("El id de producto no debe estar repetido") 
                return
            }

            const nuevoProduct = new ProductModel ({
                titulo,
                descripcion,
                precio,
                imagen,
                id,
                stock,
                categoria,
                status: true,
                thumbnails: thumbnails || []
            })

            await nuevoProduct.save()

        } catch (error) {
            console.log("Error al agregar el producto, ¡revisa!", error)
            throw error
        }
    }

    async getProducts({limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit

            let queryOptions = {}

            if (query) {
                queryOptions = { categoria: query}
            }

            const sortOptions = {} 
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.precio = sort === "asc" ? 1 : -1
                }
            }

            const productos = await ProductModel 
                .find(queryOptions)
                .sort(queryOptions)
                .skip(skip)
                .limit(limit)

            const totalProducts = await ProductModel.countDocuments(queryOptions)

            const totalPaginas = Math.ceil(totalProducts / limit)
            const hasPrevPage = page > 1
            const hasNextPage = page < totalPaginas

            return {
                docs: productos, totalPaginas,
                prevPage: hasPrevPage ? page -1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            }

        } catch (error) {
            console.log("Error al intentar mostrar los productos, ¡intenta de nuevo!", error)
            throw error
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("Este producto no existe");
                return null;
            }

            console.log("Aquí tienes el producto que estabas buscando");
            return product;
        } catch (error) {
            console.log("Este id no se encuentra en nuestra tienda, prueba de nuevo");
        }
    }

    async updateProduct(id, productActualizado) {
        try {

            const productActualizado = await ProductModel.findByIdAndUpdate(id, productActualizado);

            if (!productActualizado) {
                console.log("Este producto no se ha encontrado");
                return null;
            }

            console.log("Ya hemos actualizado el producto, ¡gracias!");
            return productActualizado;
        } catch (error) {
            console.log("No hemos podido actualizar el producto, prueba de nuevo", error);

        }
    }

    async deleteProduct(id) {
        try {

            const productEliminado = await ProductModel.findByIdAndDelete(id);

            if (!productEliminado) {
                console.log("No se puede eliminar este producto porque no existe");
                return null;
            }

            console.log("Hemos eliminado el producto correctamente, ¡gracias!");
        } catch (error) {
            console.log("No hemos podido eliminar el producto, prueba de nuevo", error);
            throw error;
        }
    }

}

export default ProductManager