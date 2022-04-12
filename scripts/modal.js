// Variables principales
const modal = document.querySelector(".modal")
const pagarBtn = document.querySelector(".carrito-pagar")
const modalCerrar = document.querySelector(".modal-cerrar")
const formulario = document.querySelector(".form")
const inputNombre = document.querySelector('input[name="nombre"]')
let borrarTodo = new Desplegar

// Hacer que se abra el modal al hacer click en el botón
pagarBtn.onclick = () => {
    modal.style.display = "flex"
    modal.style.alignItems = "center"
    modal.style.justifyContent = "center"
    carritoDOM.classList.remove("carrito-mostrar")
}

// Cerrar el modal
modalCerrar.onclick = () => {
    carritoOverlay.classList.remove("carrito-magia")
    modal.style.display = "none"
}
window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none"
        carritoOverlay.classList.remove("carrito-magia")
    }
}

// Guardar valor del input
let nombre = inputNombre.addEventListener("input", (e) => {
    nombre = e.target.value
})

// Funcionalidad del form
formulario.addEventListener("submit", (e) => {
    e.preventDefault()
    mandarAlerta(nombre)
    borrarTodo.vaciarCarrito()
    formulario.reset()
})

// Alerta cuando finaliza compra
const mandarAlerta = (nombre) => {
    modal.style.display = "none"
    carritoOverlay.classList.remove("carrito-magia")
    Swal.fire({
        title: 'Felicidades por tu compra !',
        text: `${nombre}, te agradecemos por tu compra en Farina Rústica ! Te enviaremos un e-mail con los detalles de tu compra, vuelve a visitarnos pronto !`,
        imageUrl: "../imagenes/imagen-carousel-1.jpg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Imagen de compra',
    })
}
