// Variables principales
const carritoBtn = document.querySelector (".carrito-btn1")
const carritoContador = document.getElementById ("carrito-contador")
const productosDOM = document.querySelector (".productos-card-container")
const carritoOverlay = document.querySelector (".carrito-overlay")
const carritoDOM = document.querySelector (".carrito-principal")
const carritoCerrar = document.querySelector (".carrito-cerrar")
const carritoContenido = document.querySelector (".carrito-contenido")
const carritoTotal = document.querySelector (".carrito-total")
const carritoVaciar = document.querySelector (".carrito-vaciar")

// Arrays principales
let carrito = []
let botonesDOM = []

// Función para activar contenido del DOM mediante un evento
document.addEventListener ("DOMContentLoaded", () => {
    const productos = new Productos ()
    const desplegar = new Desplegar ()
    // Activar los productos desde el JSON
    productos.activarProductos ().then (productos => {
    desplegar.desplegarProductos (productos)
    // Guardar productos en local storage
    Storage.guardarProductos (productos)
    }) .then(() => {
        // Activar botones para agregar productos al carrito
        desplegar.activarBotonesComprar ()
    })
})


// Crear clase "Productos" para cargar productos desde el JSON 
class Productos {
    // Utilizo async/await para cumplir la promesa.
    async activarProductos () {
        try {
        let contenido = await fetch ("../farina-rustica-productos.json")
        let resultado = await contenido.json ()
        let productos = resultado.panes
        // Después de cierto punto se rompió el código así que tuve que hacer un map para que regresara un nuevo array y todo volviera a la normalidad
        productos = productos.map (item => {
            const nombre = item.nombre
            const precio = item.precio
            const id = item.id
            const imagen =item.imgSrc
            return {nombre,precio,id,imagen}
        })
        return productos;
        } catch (error) {
            console.log (error);
        }
    }
}

// Crear clase "Desplegar" para mostrar los productos cargados por la clase "Productos" o el Local Storage en la página web
class Desplegar {
    desplegarProductos (productos) {
        let productosHtml = ""
        // Utilizo el método forEach para que todas las propiedas de cada producto aparezcan en el HTML
        productos.forEach (producto => {
            productosHtml += `
                <div class="card">
                    <div class="card-contenedor-imagen">
                        <img
                            src=${producto.imagen}
                            class="card-img-top card-imagen"
                            alt="Imagen de Conchita"
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
    activarBotonesComprar () {
        const botonesComprar = [...document.querySelectorAll (".carrito-btn2")]
        botonesDOM = botonesComprar
        botonesComprar.forEach (button => {
            let id = button.dataset.id
            let productoAgregado = carrito.find (item => item.id === id)
            // Si el producto ya está el carrito
            if (productoAgregado) {
                button.innerText = "El producto ya está en el carrito"
                button.disabled = true
            // Si el producto no está en el carrito
            } else {
                button.addEventListener ("click", e => {
                    e.target.innerText = "El producto ya está en el carrito"
                    e.target.disabled = true
                    // Hacer que el boton "agregar al carrito" añada el item con sus características mediante el id
                    let carritoItem = {...Storage.obtenerProducto (id), cantidad: 1}
                    // Agregar el producto al carrito
                    carrito = [...carrito, carritoItem]
                    // Guardar el carrito en local storage
                    Storage.guardarCarrito (carrito)
                    // Número total de items en el carrito y sub-total del carrito 
                    this.infoCarrito (carrito)
                    // Mostrar los productos en el carrito
                    this.agregarItemCarrito (carritoItem)
                    // Mostrar el carrito
                    this.mostrarCarrito ()
                })
            }
        })
    }
    // Número total de items en el carrito y sub-total del carrito
    infoCarrito (carrito) {
        let totalItems = 0
        let subTotal = 0
        carrito.map (item => {
            totalItems += item.cantidad
            subTotal += item.precio * item.cantidad
        })
        carritoContador.innerText = totalItems
        carritoTotal.innerText = parseFloat (subTotal.toFixed (2))
    }
    // Creo un div que contendrá los items una vez agregados al carrito
    agregarItemCarrito (item) {
        const div = document.createElement ("div")
        div.classList.add ("carrito-producto")
        div.innerHTML = `
        <img
            src="${item.imagen}"
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
                ><strong>Borrar</strong></span
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
        carritoContenido.appendChild (div)
    }
    // Mostrar el carrito
    mostrarCarrito () {
        carritoDOM.classList.add ("carrito-mostrar")
        carritoOverlay.classList.add ("carrito-magia")
    }
}

// Crear clase "Storage" encargada del almacenamiento en Local Storage
class Storage {
    static guardarProductos (productos) {
        localStorage.setItem ("productos", JSON.stringify (productos))
    }
    // Hacer que el boton "agregar al carrito" añada el item con sus características mediante el id
    static obtenerProducto (id) {
        let productosCarrito = JSON.parse (localStorage.getItem ("productos"))
        return productosCarrito.find (producto => producto.id === id)
    }
    // Guardar el carrito en local storage
    static guardarCarrito (carrito) {
        localStorage.setItem ("carrito", JSON.stringify (carrito))
    }
}

