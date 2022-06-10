function actualizarCarrito() {
    let montoCarrito = 0;
    let productosEnCarrito = "";
    for (idProductoCarrito of carritoDeCompras){
        let precioProducto = parseInt(document.getElementById("fichaPrecio_" + idProductoCarrito).innerText.split("$")[1]);
        montoCarrito += precioProducto;
        productosEnCarrito += "<li>" + document.getElementById("fichaNombre_" + idProductoCarrito).innerText + "</li>";
    }
    let divCarrito = document.getElementById("carritoCompra");
    divCarrito.innerHTML = `
        <p>Cantidad de productos agregados: ${carritoDeCompras.length} productos</p>
        <ul>
            ${productosEnCarrito}
        </ul>
        <p>SUBTOTAL: $${montoCarrito} CLP</p>
    `;
    localStorage.setItem("carrito",JSON.stringify(carritoDeCompras));
    return montoCarrito;
}

function vaciarCarrito(){
    carritoDeCompras = [];
    actualizarCarrito();
}

//Creo la clase necesaria para manejar los productos en venta, sus precios y creo una lista con 8 ejemplos
class Producto {
    constructor(id, nombre, marca, precio){
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = parseInt(precio);
    }
}

//Inicializo el carrito
let carritoDeCompras = [];

//Despliego las fichas de todos los productos disponibles y se agregan sus eventListener
let divGrillaProductos = document.getElementById("grillaProductos");
fetch("../productos.json").then(response => response.json()).then( (productos) => {
    productos.forEach( (producto) => {
        let ficha = document.createElement("div");
        ficha.className = "col-sm-3";
        ficha.innerHTML = `<div class="card" style="width: 10rem;">
            <img src="./img/id_${producto["id"]}.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title" id="fichaNombre_${producto["id"]}">${producto["nombre"]}</h5>
                <p class="card-text">${producto["marca"]}</p>
                <p class="card-text" id="fichaPrecio_${producto["id"]}">$${producto["precio"]} CLP</p>
                <a id="btnCompra_${producto["id"]}" href="#" class="btn btn-primary"> Agregar al carrito <i class="bi bi-cart-plus"></i> </a>
            </div>
        </div>`;
        divGrillaProductos.appendChild(ficha);
        let btn = document.getElementById("btnCompra_" + producto.id);
        btn.addEventListener ("click", function(){ carritoDeCompras.push(producto.id) });
        btn.addEventListener ("click", actualizarCarrito);
        btn.addEventListener("click", () => {
            Toastify({
                text: producto.nombre + " agregado al carrito!",
                duration: 3000,
                gravity: 'up',
                position: 'right',
                style: {
                    background: 'linear-gradient(to right, #00b09b, #96c92d)'
                }           
            }).showToast();
        })
    })
    //Aqui hago revision si habia algo guardado previamente en el carrito (va aqui porque debe revisarse despues que se ha inyectado el codigo de fichas de productos)
    let carritoAlmacenado = JSON.parse(localStorage.getItem("carrito"));
    if (carritoAlmacenado) {
        carritoDeCompras = carritoAlmacenado;
        actualizarCarrito();
    }
});

//Se agrega funcionalidad al boton de vaciar carrito
let btnVaciarCarrito = document.getElementById("vaciar_carrito");
btnVaciarCarrito.addEventListener ("click", vaciarCarrito);
btnVaciarCarrito.addEventListener("click", () => {
    Toastify({
        text: "Has vaciado el carrito!",
        duration: 3000,
        gravity: 'up',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #F37536, #F34736)'
        }           
    }).showToast();
})

//Se agrega funcionalidad al boton de Finalizar compra
let btnTerminarCompra = document.getElementById("terminar_compra");
btnTerminarCompra.addEventListener("click", () => {
    Swal.fire({
        title: '¿Finalizar la compra?',
        text: "Irás al portal de pagos para finalizar la compra de los productos en el carrito. Total: $" + actualizarCarrito() + " CLP",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ir al portal de pagos'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Llámanos para finalizar tu compra',
            'Esta función pronto estará integrada. Por ahora llámanos al 555-5555 para finalizar la compra vía telefónica',
            'info'
          )
        }
      })
})