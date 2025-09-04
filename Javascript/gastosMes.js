const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let gastos = [];



let mesSeleccionado = new Date().getMonth(); //para identificar los meses por numeros desde 0
let idEditando = null;

const mesesContainer = document.getElementById("mesesContainer");    //  buscando el elementos id="mesescontaines"en html//
const tbody = document.getElementById("tablaGastos");
const mensajeError = document.getElementById("mensajeError");

//VALIDAR SESION
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  mensajeError.style.display = "block";
  mensajeError.style.backgroundColor = "red";
  mensajeError.textContent = "no hay sesion iniciada";

  setTimeout(() => {
    window.location.href = "iniciarSesion.html";
  }, 2000);

} else {
  mensajeError.style.display = "none"
}
// Mostrar botones de meses
tbody.innerHTML = "";
meses.forEach((mes, i) => {
  const btn = document.createElement("button");
  btn.textContent = mes;
  if (i === mesSeleccionado) btn.classList.add("activo");
  btn.onclick = () => {
    mesSeleccionado = i;
    document.querySelectorAll(".meses button").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    obtenerGastosDesdeAPI();
  };
  mesesContainer.appendChild(btn);
});

//   FUNCION PARA NORMALIZAR DATOS DE LA API 
function normalizarGasto(gasto) {
  return {
    id: gasto.id || null,
    userId: gasto.userId,
    categoria: gasto.categoria || gasto.categoryId || gasto.categoryId,
    titulo: gasto.titulo || gasto.title,
    descripcion: gasto.descripcion || gasto.description,
    monto: isNaN(Number(gasto.monto || gasto.amount)) ? 0 : Number(gasto.monto || gasto.amount),
    fecha: gasto.fecha || gasto.date || new Date().toISOString().split()[0]
  };
}



async function obtenerGastosDesdeAPI() {
  mensajeError.style.display = "none";
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert(" No hay usuario agregado")
    return;
  }
  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses");
    if (!res.ok) throw new Error("Error al obtener gastos");
    const datos = await res.json();

    gastos = datos.map(normalizarGasto)
      .filter(g => g.userId === usuario.id);

    filtrarGastos();
  } catch (err) {
    console.error("Error al cargar gastos:", err);
    mensajeError.textContent = "Error al conectarse con la API.";
    mensajeError.style.display = "block";
  }
}

function filtrarGastos() {
  const tituloFiltro = document.getElementById("filtroTitulo").value.toLowerCase();
  const categoriaFiltro = document.getElementById("filtroCategoria").value;
  const min = parseFloat(document.getElementById("filtroMin").value);
  const max = parseFloat(document.getElementById("filtroMax").value);

  const filtrados = gastos
    .filter(g => new Date(g.fecha).getMonth() === mesSeleccionado)
    .filter(g => g.titulo.toLowerCase().includes(tituloFiltro))
    .filter(g => categoriaFiltro === "" || g.categoria === categoriaFiltro)
    .filter(g => isNaN(min) || g.monto >= min)
    .filter(g => isNaN(max) || g.monto <= max)
    .sort((a, b) => a.id - b.id);

  Tabla(filtrados);
}
function limpiarFiltros() {
  document.getElementById("filtroTitulo").value = "";
  document.getElementById("filtroCategoria").value = "";
  document.getElementById("filtroMin").value = "";
  document.getElementById("filtroMax").value = "";
  filtrarGastos();
}


function validarFormularioGasto() {
  let valido = true;

  // Limpiar errores anteriores
  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const monto = parseFloat(document.getElementById("monto").value);
  const categoria = document.getElementById("categoria").value;
  const fecha = document.getElementById("fecha").value;


  //Validacion de formulario 
  if (!titulo) {
    document.getElementById("errorTitulo").textContent = "El titulo es obligatorio.";
    valido = false;
  }

  if (!descripcion) {
    document.getElementById("errorDescripcion").textContent = "La descripcion es obligatoria.";
    valido = false;
  }

  if (isNaN(monto) || monto <= 0) {
    document.getElementById("errorMonto").textContent = "El monto debe ser mayor que 0.";
    valido = false;
  }

  if (!categoria) {
    document.getElementById("errorCategoria").textContent = "Selecciona una categoria.";
    valido = false;
  }

  if (!fecha) {
    document.getElementById("errorFecha").textContent = "Selecciona una fecha.";
    valido = false;
  }

  return valido;
}

async function agregarGasto() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return alert("no hay sesion iniciada");

  if (!validarFormularioGasto()) return;

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const categoria = parseInt(document.getElementById("categoria").value);
  const fecha = document.getElementById("fecha").value;
  // usuarioEmail= usuario.email

  if (!titulo || !monto || !categoria || !fecha || !descripcion) {
    return alert("Completa todos los campos");
  }

  const gasto = {
    userId: usuario.id,
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha,
    categoryId: categoria

  };

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto)
    });

    if (!res.ok) throw new Error("Error al agregar gasto");

    alert("Enviado y Guardado correctamente");
    obtenerGastosDesdeAPI();

    const modal = document.querySelector(".modalGastos") //para llemar el elemento de la cada modal
    modal.style.display = "none"

    // Limpiar formulario
    document.getElementById("titulo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("fecha").value = "";

  } catch (error) {
    console.error("Error al agregar gasto:", error);
    alert("No se pudo agregar el gasto.");
  }




}

let gastoEditandoId = null;

function iniciarEdicion(id) {
  try {
    fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`)
      .then(res => res.json())
      .then(data => {
        // click para abrir modal al btn de abrir modal
        document.getElementById("btnOpenModalGastos").click()
        // document.getElementById("btnOpenModalGastos").click()


        // Llama los datos modal Editar 

        document.getElementById("titulo").value = data.titulo || data.title;
        document.getElementById("descripcion").value = data.descripcion || data.description;
        document.getElementById("monto").value = data.monto || data.amount;
        document.getElementById("fecha").value = data.fecha || data.Date;
        // document.getElementById("categoria").value = gasto.categoryId;


        document.getElementById("tituloModal").innerText = "Editar Gasto"
        document.getElementById("btnAgregar").style.display = "none";
        document.getElementById("btnGuardar").style.display = "inline-block";
        // document.getElementById("btnCancelar").style.display = "inline-block";




        gastoEditandoId = id;

      })



  } catch (error) {
    console.error("Error al cargar gasto:", error)
  }

}


function cancelarEdicion() {
  // Limpiar campos del formulario
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("monto").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("fecha").value = "";

  // Restaurar botones
  document.getElementById("btnAgregar").style.display = "inline-block";
  document.getElementById("btnGuardar").style.display = "inlene-block";
  document.getElementById("btnCancelar").style.display = "none";
  document.getElementById("modalEditar").style.display = "inlne-block";

  // Resetear ID de edición
  gastoEditandoId = null;

  // Ocultar errores si hay
  const mensajeError = document.getElementById("mensajeError");
  if (mensajeError) mensajeError.style.display = "none";
}

function actualizarGasto() {
  if (!validarFormularioGasto()) return;
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto")).value;
  const fecha = document.getElementById("fecha").value;
  const categoria = parseInt(document.getElementById("categoria").value);

  const gastoActualizado = {
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha,
    // categoryId: categoria

  };

  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${gastoEditandoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gastoActualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    })
    .then(() => {
      alert("Gasto actualizado correctamente");

      // Limpiar formulario y restaurar botones
      document.getElementById("btnAgregar").style.display = "inline-block";
      document.getElementById("btnGuardar").style.display = "none";
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("fecha").value = "";
      document.getElementById("categoria").value = "";

      gastoEditandoId = null;
      obtenerGastosDesdeAPI();
      const modal = document.querySelector(".modalGastos")

      modal.style.display = "none"
    })
    .catch(err => {
      console.error("Error:", err);
      alert("No se pudo actualizar el gasto.");
    });
}

async function agregarCategoria() {
  const name = document.getElementById("nuevaCategoria").value.trim();
  const mensaje = document.getElementById("mensajeCategoria");
  const select = document.getElementById("categoria");

  if (!name) {
    mensaje.textContent = " Ingresa un nombre de categoria";
    mensaje.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (!res.ok) throw new Error("No se pudo crear la categoria");

    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = name;
    nuevaOpcion.textContent = name;
    select.appendChild(nuevaOpcion);

    select.value = name;

    mensaje.textContent = " Categoria agregada";
    mensaje.style.color = "green";
    document.getElementById("nuevaCategoria").value = "";


    setTimeout(() => {

      mensaje.textContent = "";
    }, 1500);


  } catch (error) {
    console.error("Error al agregar categoria:", error);
    mensaje.textContent = "Error al agregar la categoria";
    mensaje.style.color = "red";
    setTimeout(() => {
      mensaje.textContent = "";
    }, 1500);
  }
}
// obtenerGastosDesdeAPI();
async function cargarCategorias() {
  const select = document.getElementById("categoria");
  select.innerHTML = "";

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
    const categorias = await res.json();

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.nombre;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar categorias:", error);
  }
}

obtenerGastosDesdeAPI();

function eliminarGasto(id) {
  if (!confirm("¿Estas seguro de eliminar este gasto?")) return;

  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar el gasto");
      alert("Gasto eliminado");
      obtenerGastosDesdeAPI();
    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo eliminar el gasto.");
    });
}

function Tabla(lista) {
  tbody.innerHTML = "";
  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">No hay gastos en este mes</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach((gasto) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${gasto.titulo}</td>
      <td>${gasto.categoria}</td>
      <td>$${Number(gasto.monto).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
      <td>${new Date(gasto.fecha).toLocaleDateString('es-CO')}</td>
      <td>
        <button onclick="iniciarEdicion(${gasto.id})" class="btnEditar">Editar</button>
        <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
      </td>
    `;

    function limpiarFormulario() {
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("categoria").value = "";
      document.getElementById("fecha").value = "";

      document.getElementById("btnGuardar").style.display = "none"
      document.getElementById("btnAgregar").style.display = "inline-block"

      const mensajeError = document.getElementById("mensajeError");
      if (mensajeError) {
        mensajeError.style.display = "none"
      }

      //  document.getElementById("mensajeError").style.display="none";

    }
    tbody.appendChild(tr);
  });
}

obtenerGastosDesdeAPI();

//close Modal categoria
const btnCloseModal = document.getElementById("closeModal")
btnCloseModal.addEventListener('click', () => {
  document.querySelector(".modal").style.display = "none"

})
// Open modal de categoria  
const btnOpenModal = document.getElementById("btnOpenModal")

btnOpenModal.addEventListener('click', () => {
  document.querySelector(".modal").style.display = "inline-block"

})
//modal gastos
// abrir modal de agregar nun gasto

const modalGastos = document.querySelector(".modalGastos")
const openModalGastos = document.getElementById("btnOpenModalGastos")
openModalGastos.addEventListener("click", () => {
  modalGastos.style.display = "inline-block"

  document.getElementById("titulo").value = null;
  document.getElementById("descripcion").value = null;
  document.getElementById("monto").value = null;
  document.getElementById("fecha").value = null;


  document.getElementById("tituloModal").innerText = "Nuevo Gasto"
  document.getElementById("btnAgregar").style.display = "inline-block";
  document.getElementById("btnGuardar").style.display = "none";

  // document.getElementById("btnCancelar").style.display = "inline-block";

})

// cerra modal gastos 
//que devuelve una lista de nodos
document.querySelectorAll(".btnModal").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".modalGastos").style.display = "none";
  });
});

function cerrarModalEditar() {

  const modal = document.getElementById(".modalGasto")

  modal.style.display = "none";

}
//obtener  categoria
const url = "https://.booksandbooksdigital.com.co/practicante/backend/categories";

let categoriaAPI = [];

async function cargarCategoria() {
  try {
    const respuestaCategoria = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");


    categoriaAPI = await respuestaCategoria.json();


    // console.log("Categorias cargadas:", categoriaAPI);
  } catch (error) {
    console.error(" Error al traer las categorías:", error);
  }
}


function mostrarCategorias() {

  const categoria = document.getElementById("categoria")
  const categoriaFiltro = document.getElementById("filtroCategoria")
  categoriaAPI.map((dato) => {
    const option1 = document.createElement("option")

    option1.value = dato.id
    option1.textContent = dato.name
    categoria.appendChild(option1)

    const option2 = document.createElement("option")
    option2.value = dato.id
    option2.textContent = dato.name
    categoriaFiltro.appendChild(option2)

  })
}

cargarCategoria();

setTimeout(() => {
  mostrarCategorias();
}, 200);


