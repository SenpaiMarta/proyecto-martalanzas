const socket = io()

const productForm = document.getElementById('productForm')
const productList = document.getElementById('productList')

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(productForm)
    const product = {}
    formData.forEach((value, key) => {
        product[key] = key === 'precio' ? parseFloat(value) : key === 'stock' ? parseInt(value, 10) : value
    })
    socket.emit('addProduct', product)
    productForm.reset()
})

productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.closest('li').getAttribute('data-id')
        socket.emit('deleteProduct', parseInt(id, 10))
    }
})

socket.on('updateProducts', (products) => {
    productList.innerHTML = ''
    products.forEach((product) => {
        const div = document.createElement('div')
        div.setAttribute('data-id', product.id)
        div.innerHTML = `
            <strong>${product.titulo}</strong> - ${product.descripcion} - $${product.precio.toFixed(2)}
            <button class="delete-btn">Eliminar</button>
        `;
        productList.appendChild(div)
    });
})
