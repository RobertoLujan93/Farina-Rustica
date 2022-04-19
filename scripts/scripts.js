// Variables principales
const carritoBtn = document.querySelector(".carrito-btn1")
const carritoContador = document.getElementById("carrito-contador")
const productosDOM = document.querySelector(".productos-card-container")
const carritoOverlay = document.querySelector(".carrito-overlay")
const carritoDOM = document.querySelector(".carrito-principal")
const carritoCerrar = document.querySelector(".carrito-cerrar")
const carritoContenido = document.querySelector(".carrito-contenido")
const carritoTotal = document.querySelector(".carrito-total")
const carritoVaciar = document.querySelector(".carrito-vaciar")

// Arrays principales
let carrito = []
let botonesDOM = []

// Función para activar contenido del DOM mediante un evento
document.addEventListener("DOMContentLoaded", () => {
    const productos = new Productos()
    const desplegar = new Desplegar()
    // Cargar el carrito con toda su información
    desplegar.utilidadesCarrito()
    Storage.cargarCarrito()
    // Activar los productos desde el JSON
    productos.activarProductos().then(productos => {
        desplegar.desplegarProductos(productos)
        // Guardar productos en local storage
        Storage.guardarProductos(productos)
    }).then(() => {
        // Activar botones para agregar productos al carrito
        desplegar.activarBotonesComprar()
        desplegar.herramientasCarrito()
    })
})


// Crear clase "Productos" para cargar productos desde el JSON 
class Productos {
    // Utilizo async/await para cumplir la promesa.
    async activarProductos() {
        try {
            let contenido = await fetch("../farina-rustica-productos.json")
            let resultado = await contenido.json()
            return resultado;
        } catch (error) {
            console.log(error);
        }
    }
}

// Crear clase "Desplegar" para mostrar los productos cargados por la clase "Productos" o el Local Storage en la página web
class Desplegar {
    desplegarProductos(productos) {
        let productosHtml = ""
        // Utilizo el método forEach para que todas las propiedas de cada producto aparezcan en el HTML
        productos.forEach(producto => {
            productosHtml += `
                <div class="card">
                    <div class="card-contenedor-imagen">
                        <img
                            src=${producto.imgSrc}
                            class="card-img-top card-imagen"
                            alt="Imagen de producto"
                            />
                        <button class="carrito-btn2" data-id=${producto.id}>
                            <i class="fa-solid fa-cart-shopping"> </i>
                            Agregar al carrito
                        </button>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-center">${producto.nombre}</h3>
                        <h3 class="card-title text-center card-precio">$${producto.precio}</h3>
                    </div>
                </div>
            `
        })
        // Utilizo la propiedad innerHTML para mostrar cada producto con sus propiedades en el HTML
        productosDOM.innerHTML = productosHtml
    }
    // Habilitar el uso de los botones para agregar productos al carrito
    activarBotonesComprar() {
        const botonesComprar = [...document.querySelectorAll(".carrito-btn2")]
        botonesDOM = botonesComprar
        botonesComprar.forEach(button => {
            let id = button.dataset.id
            let productoAgregado = carrito.find(item => item.id === id)
            // Si el producto ya está el carrito
            if (productoAgregado) {
                button.innerText = "El producto ya está en el carrito"
                button.disabled = true
                // Si el producto no está en el carrito
            } else {
                button.addEventListener("click", e => {
                    e.target.innerText = "El producto ya está en el carrito"
                    e.target.disabled = true
                    iziToast.success({
                        title: '',
                        message: 'Tu producto ha sido agregado al carrito!',
                    })
                    // Hacer que el boton "agregar al carrito" añada el item con sus características mediante el id
                    let carritoItem = { ...Storage.obtenerProducto(id), cantidad: 1 }
                    // Agregar el producto al carrito
                    carrito = [...carrito, carritoItem]
                    // Guardar el carrito en local storage
                    Storage.guardarCarrito(carrito)
                    // Número total de items en el carrito y sub-total del carrito 
                    this.infoCarrito(carrito)
                    // Mostrar los productos en el carrito
                    this.agregarItemCarrito(carritoItem)
                    // Mostrar el carrito
                    this.mostrarCarrito()
                })
            }
        })
    }
    // Número total de items en el carrito y sub-total del carrito
    infoCarrito(carrito) {
        let totalItems = 0
        let subTotal = 0
        carrito.map(item => {
            totalItems += item.cantidad
            subTotal += item.precio * item.cantidad
        })
        carritoContador.innerText = totalItems
        carritoTotal.innerText = parseFloat(subTotal.toFixed(2))
        if (carrito.length === 0) {
            pagarBtn.setAttribute("disabled", "")
            pagarBtn.innerText = "Carrito vacío"
            pagarBtn.style.fontWeight = "bold"
            return
        } else {
            pagarBtn.removeAttribute("disabled")
            pagarBtn.innerText = "Pagar"
        }
    }
    // Creo un div que contendrá los items una vez agregados al carrito
    agregarItemCarrito(item) {
        const div = document.createElement("div")
        div.classList.add("carrito-producto")
        div.innerHTML = `
        <img
            src="${item.imgSrc}"
            class="carrito-producto-imagen"
            alt="Producto del Carrito"
            />
            <div>
                <h4 class="carrito-producto-nombre">
                <strong>${item.nombre}</strong>
                </h4>
                <h5 class="carrito-producto-precio">
                <strong>$${item.precio}</strong>
                </h5>
                <span class="carrito-producto-borrar" data-id=${item.id}
                >Borrar</span
                >
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="carrito-producto-cantidad">
                <strong>${item.cantidad}</strong>
                </p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        // Pasamos el método appendChild a la clase "carrito-contenido"
        carritoContenido.appendChild(div)
    }
    // Mostrar el carrito
    mostrarCarrito() {
        carritoDOM.classList.toggle("carrito-mostrar")
        carritoOverlay.classList.toggle("carrito-magia")
    }
    // Cargar el carrito con toda su información
    utilidadesCarrito() {
        carrito = Storage.cargarCarrito()
        this.infoCarrito(carrito)
        this.llenarCarrito(carrito)
        // Abrir y cerrar el carrito
        carritoBtn.addEventListener("click", this.mostrarCarrito)
        carritoCerrar.addEventListener("click", this.cerrarCarrito)
    }
    llenarCarrito(carrito) {
        carrito.forEach(item => this.agregarItemCarrito(item))
    }
    cerrarCarrito() {
        carritoDOM.classList.remove("carrito-mostrar")
        carritoOverlay.classList.remove("carrito-magia")
    }
    // Activar los botones adentro del carrito
    herramientasCarrito() {
        carritoVaciar.addEventListener("click", () => {
            this.vaciarCarrito()
        })
        carritoContenido.addEventListener("click", e => {
            // Borrar producto del carrito y del DOM
            if (e.target.classList.contains("carrito-producto-borrar")) {
                let borrarProducto = e.target
                let id = borrarProducto.dataset.id
                carritoContenido.removeChild(borrarProducto.parentElement.parentElement)
                this.borrarItem(id)
                // Agregar cantidad a los productos
            } else if (e.target.classList.contains("fa-chevron-up")) {
                let agregarCantidad = e.target
                let id = agregarCantidad.dataset.id
                let sumarItem = carrito.find(item => item.id === id)
                sumarItem.cantidad = sumarItem.cantidad + 1
                Storage.guardarCarrito(carrito)
                this.infoCarrito(carrito)
                agregarCantidad.nextElementSibling.innerText = sumarItem.cantidad
                // Restar cantidad a los productos
            } else if (e.target.classList.contains("fa-chevron-down")) {
                let restarCantidad = e.target
                let id = restarCantidad.dataset.id
                let restarItem = carrito.find(item => item.id === id)
                restarItem.cantidad = restarItem.cantidad - 1
                // Evitar que la cantidad y el total bajen a número negativos
                if (restarItem.cantidad > 0) {
                    Storage.guardarCarrito(carrito)
                    this.infoCarrito(carrito)
                    restarCantidad.previousElementSibling.innerText = restarItem.cantidad
                } else {
                    carritoContenido.removeChild(restarCantidad.parentElement.parentElement)
                    this.borrarItem(id)
                }
            }
        })
    }
    // Vaciar el carrito
    vaciarCarrito() {
        let itemsCarrito = carrito.map(item => item.id)
        itemsCarrito.forEach(id => this.borrarItem(id))
        while (carritoContenido.children.length > 0) {
            carritoContenido.removeChild(carritoContenido.children[0])
        }
        this.cerrarCarrito()
    }
    // Proceso para borrar los items dentro del carrito y que los cambios se guarden en local storage
    borrarItem(id) {
        carrito = carrito.filter(item => item.id !== id)
        iziToast.info({
            title: '',
            message: 'Tu producto ha sido eliminado del carrito',
        })
        this.infoCarrito(carrito)
        Storage.guardarCarrito(carrito)
        // Regresar el botón a la normalidad después de borrar
        let botoncarrito = this.encontrarBoton(id)
        botoncarrito.disabled = false
        botoncarrito.innerHTML = `<i class="fa-solid fa-cart-shopping"> </i> Agregar al carrito`
    }
    encontrarBoton(id) {
        return botonesDOM.find(botoncarrito => botoncarrito.dataset.id === id)
    }
}

// Crear clase "Storage" encargada del almacenamiento en Local Storage
class Storage {
    static guardarProductos(productos) {
        localStorage.setItem("productos", JSON.stringify(productos))
    }
    // Hacer que el boton "agregar al carrito" añada el item con sus características mediante el id
    static obtenerProducto(id) {
        let productosCarrito = JSON.parse(localStorage.getItem("productos"))
        return productosCarrito.find(producto => producto.id === id)
    }
    // Guardar el carrito en local storage
    static guardarCarrito(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    // Cargar carrito desde local storage
    static cargarCarrito() {
        return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
    }
}

