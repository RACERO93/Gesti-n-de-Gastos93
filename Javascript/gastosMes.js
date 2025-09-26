// declarando la constante con todos los meses del año

let gastos = []
let mesSeleccionado = new Date().getMonth() //para identificar los meses por numeros desde 0
let idEditando = null
let categoriaAPI = []

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const mesesContainer = document.getElementById('mesesContainer') //  buscando el elementos id="mesescontaines"en html//
const tbody = document.getElementById('tablaGastos')
const mensajeError = document.getElementById('mensajeError')

//VALIDAR SESION
const usuario = JSON.parse(localStorage.getItem('usuario')) //convierte una cadena de texto a un formato JSON
if (!usuario) {
  mensajeError.style.display = 'block'
  mensajeError.style.backgroundColor = 'red'
  mensajeError.textContent = 'no hay sesion iniciada'

  setTimeout(() => {
    window.location.href = '../iniciarSesion.html'
  }, 2000)
} else {
  mensajeError.style.display = 'none'
}
// Mostrar botones de los meses
function cargarMeses() {
  mesesContainer.innerHTML = ''
  meses.forEach((mes, i) => {
    //con el metodo forEach recorre todo los elementos de la funciion fecha en cda vuela
    const btn = document.createElement('button')
    btn.textContent = mes
    btn.classList.add('btnMes')
    if (i === mesSeleccionado) btn.classList.add('activo')

    btn.onclick = () => {
      mesSeleccionado = i //es la variable donde se guadar el mes asignado
      // recorre cada boton y quira la clase css activo
      document
        .querySelectorAll('#mesesContainer button')
        .forEach((b) => b.classList.remove('activo'))
      btn.classList.add('activo')

      filtrarGastos()
    }

    mesesContainer.appendChild(btn)
  })
}

// para mostrar los botones de los meses

document.addEventListener('DOMContentLoaded', () => {
  // el navegador llama primero documento de html y despues lo muestra
  cargarMeses()
  obtenerGastosDesdeAPI()
})

function parsedDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

//   FUNCION PARA NORMALIZAR DATOS DE LA API
function normalizarGasto(gasto) {
  return {
    id: gasto.id || null, //si esxiste se usa y si no manda null
    userId: gasto.userId,
    categoria: gasto.categoria || gasto.categoryId, //Esto se hace por si el dato viene en españpl o en ingle desde la api
    titulo: gasto.titulo || gasto.title,
    descripcion: gasto.descripcion || gasto.description,
    monto: isNaN(Number(gasto.monto || gasto.amount)) //si no es numero lo pone en cero y si es numero le da el valor
      ? 0
      : Number(gasto.monto || gasto.amount),
    fecha: parsedDate(gasto.fecha || gasto.date), //||
    // new Date().toISOString().split()[0],
  }
}
// obtiene los gastos desde la api Expenses
async function obtenerGastosDesdeAPI() {
  mensajeError.style.display = 'none'
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  if (!usuario) {
    alert(' No hay usuario agregado')
    return
  }
  try {
    // Para llamar los gastos de cada usuarios
    const res = await fetch(
      `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses?userId=${usuario.id}`
    )
    if (!res.ok) throw new Error('Error al obtener gastos')
    const datos = await res.json()

    //Normalizar datos        funcion
    gastos = datos.map(normalizarGasto) //se una el metodo map para recorrer cada elemntos de los datos que viene desde la api
    // .filter(g => g.userId === usuario.id);

    filtrarGastos()
  } catch (err) {
    console.error('Error al cargar gastos:', err)
    mensajeError.textContent = 'Error al conectarse con la API.'
    mensajeError.style.display = 'block'
  }
}

function validarFormularioGasto() {
  let valido = true

  // Limpiar errores anteriores
  document.querySelectorAll('.error').forEach((e) => (e.textContent = ''))

  const titulo = document.getElementById('titulo').value.trim()
  const descripcion = document.getElementById('descripcion').value.trim()
  const monto = parseFloat(document.getElementById('monto').value)
  const categoria = document.getElementById('categoria').value
  const fecha = document.getElementById('fecha').value

  //Validacion de formulario
  if (!titulo) {
    document.getElementById('errorTitulo').textContent =
      'El titulo es obligatorio.'
    valido = false
  }

  if (!descripcion) {
    document.getElementById('errorDescripcion').textContent =
      'La descripcion es obligatoria.'
    valido = false
  }

  if (isNaN(monto) || monto <= 0) {
    document.getElementById('errorMonto').textContent =
      'El monto debe ser mayor que 0.'
    valido = false
  }

  if (!categoria) {
    document.getElementById('errorCategoria').textContent =
      'Selecciona una categoria.'
    valido = false
  }

  if (!fecha) {
    document.getElementById('errorFecha').textContent = 'Selecciona una fecha.'
    valido = false
  }

  return valido
}

async function agregarGasto() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) //---
  if (!usuario) return alert('no hay sesion iniciada') //-----

  if (!validarFormularioGasto()) return //----

  const titulo = document.getElementById('titulo').value
  const descripcion = document.getElementById('descripcion').value
  const monto = parseFloat(document.getElementById('monto').value)
  const categoria = parseInt(document.getElementById('gastoCategoria').value)
  console.log(categoria)
  const fecha = document.getElementById('fecha').value
  // usuarioEmail= usuario.email

  if (!titulo || !monto || !categoria || !fecha || !descripcion) {
    //si algunos de los elementos esta vacio retorna y manda un mensaje de alert
    return alert('Completa todos los campos')
  }

  const gasto = {
    userId: usuario.id,
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha,
    categoryId: categoria,
  }

  try {
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gasto),
      }
    )

    if (!res.ok) throw new Error('Error al agregar gasto')

    alert('Enviado y Guardado correctamente')
    obtenerGastosDesdeAPI()

    // cerrar modal
    const modal = document.querySelector('.modalGastos') //para llemar el elemento de la cada modal
    modal.style.display = 'none'

    // Limpiar formulario
    document.getElementById('titulo').value = ''
    document.getElementById('descripcion').value = ''
    document.getElementById('monto').value = ''
    console.log(document.getElementById('gastoCategoria'))
    document.getElementById('gastoCategoria').value = ''
    document.getElementById('fecha').value = ''
  } catch (error) {
    console.error('Error al agregar gasto:', error)
    alert('No se pudo agregar el gasto.')
  }
}

let gastoEditandoId = null
// consultar los gastos por id metodo get

function filtrarGastos() {
  const tituloFiltro =
    document.getElementById('filtroTitulo')?.value.toLowerCase() || ''
  const categoriaFiltro =
    document.getElementById('filtroCategoria')?.value || ''
  const min = parseFloat(document.getElementById('filtroMin')?.value) || 0
  const max =
    parseFloat(document.getElementById('filtroMax')?.value) || Infinity
  const fechaFiltro = document.getElementById('filtroFecha')?.value || ''
  const diaFiltro = document.getElementById('filtroDias')?.value || ''
  // const mesFiltro = document.getElementById('filtroMes')?.value || ''
  const añoFiltro = document.getElementById('filtroaño')?.value || ''

  // mes seleccionado por Botones
  const mesFiltro = mesSeleccionado

  //   --------Filtro por FRONTEND-----------
  const filtrados = gastos
    .filter((g) => g.titulo.toLowerCase().includes(tituloFiltro))
    .filter(
      (g) =>
        !categoriaFiltro ||
        g.categoria == categoriaFiltro ||
        g.categoryId == categoriaFiltro
    )
    .filter((g) => g.monto >= min && g.monto <= max)
    .filter((g) => !fechaFiltro || g.fecha === fechaFiltro)
    .filter((g) => {
      const fecha = new Date(g.fecha)
      return (
        (!diaFiltro || fecha.getDate() == Number(diaFiltro) + 1) && // +1 porque los días inician en 1
        fecha.getMonth() === mesFiltro &&
        // (!mesFiltro || fecha.getMonth() == Number(mesFiltro)) &&
        (!añoFiltro || fecha.getFullYear() == 2020 + Number(añoFiltro))
      )
    })
    .sort((a, b) => a.id - b.id)

  Tabla(filtrados)
}

function limpiarFiltros() {
  document.getElementById('filtroTitulo').value = ''
  document.getElementById('filtroCategoria').value = ''
  document.getElementById('filtroMin').value = ''
  document.getElementById('filtroMax').value = ''
  document.getElementById('filtroFecha').value = ''
  document.getElementById('filtroDias').value = ''
  document.getElementById('filtroMes').value = ''
  document.getElementById('filtroaño').value = ''
  filtrarGastos()
}

function iniciarEdicion(id) {
  try {
    fetch(
      `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Abrir modal
        document.getElementById('btnOpenModalGastos').click()

        // Llenar campos del modal
        document.getElementById('titulo').value = data.title || data.titulo
        document.getElementById('descripcion').value =
          data.description || data.descripcion
        document.getElementById('monto').value = data.amount || data.monto
        document.getElementById('fecha').value = data.date || data.fecha
        document.getElementById('gastoCategoria').value =
          data.categoryId || data.categoria

        // Cambiar titulos y botones
        document.getElementById('tituloModal').innerText = 'Editar Gasto'
        document.getElementById('btnAgregar').style.display = 'none'
        document.getElementById('btnGuardar').style.display = 'inline-block'

        // guardar id del gasto en edición
        gastoEditandoId = id
      })
  } catch (error) {
    console.error('Error al cargar gasto:', error)
  }
}

function cancelarEdicion() {
  document.getElementById('titulo').value = ''
  document.getElementById('descripcion').value = ''
  document.getElementById('monto').value = ''
  document.getElementById('gastoCategoria').value = ''
  document.getElementById('fecha').value = ''

  document.getElementById('btnAgregar').style.display = 'inline-block'
  document.getElementById('btnGuardar').style.display = 'none'

  gastoEditandoId = null

  const mensajeError = document.getElementById('mensajeError')
  if (mensajeError) mensajeError.style.display = 'none'
}

function actualizarGasto() {
  if (!validarFormularioGasto()) return

  const usuario = JSON.parse(localStorage.getItem('usuario'))
  if (!usuario) return alert('no hay sesion iniciada')

  const titulo = document.getElementById('titulo').value.trim()
  const descripcion = document.getElementById('descripcion').value.trim()
  const monto = parseFloat(document.getElementById('monto').value)
  const fecha = document.getElementById('fecha').value
  const categoria = parseInt(document.getElementById('gastoCategoria').value)

  const gastoActualizado = {
    userId: usuario.id,
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha,
    categoryId: categoria,
  }

  fetch(
    `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${gastoEditandoId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gastoActualizado),
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error('Error al actualizar')
      return res.json()
    })
    .then(() => {
      alert('Gasto actualizado correctamente')

      // Cerrar modal
      const modal = document.querySelector('.modalGastos')
      modal.style.display = 'none'

      // Restaurar formulario
      cancelarEdicion()

      // Recargar gastos en pantalla
      obtenerGastosDesdeAPI()
    })
    .catch((err) => {
      console.error('Error:', err)
      alert('No se pudo actualizar el gasto.')
    })
}

async function agregarCategoria() {
  const name = document.getElementById('nuevaCategoria').value.trim()
  const mensaje = document.getElementById('mensajeCategoria')
  const select = document.getElementById('categoria')

  if (!name) {
    mensaje.textContent = ' Ingresa un nombre de categoria'
    mensaje.style.color = 'red'
    return
  }

  try {
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }
    )

    if (!res.ok) throw new Error('No se pudo crear la categoria')

    const nuevaCategoria = await res.json()

    // Crear la opción usando el id
    const nuevaOpcion = document.createElement('option')
    nuevaOpcion.value = nuevaCategoria.id
    nuevaOpcion.textContent = nuevaCategoria.name
    select.appendChild(nuevaOpcion)

    // Seleccionar automáticamente la nueva categoría
    select.value = nuevaCategoria.id

    mensaje.textContent = ' Categoria agregada'
    mensaje.style.color = 'green'
    document.getElementById('nuevaCategoria').value = ''
    setTimeout(() => {
      mensaje.textContent = ''
    }, 1500)
  } catch (error) {
    console.error('Error al agregar categoria:', error)
    mensaje.textContent = 'Error al agregar la categoria'
    mensaje.style.color = 'red'
    setTimeout(() => {
      mensaje.textContent = ''
    }, 1500)
  }
}

function eliminarGasto(id) {
  if (!confirm('¿Estas seguro de eliminar este gasto?')) return

  fetch(
    `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error('Error al eliminar el gasto')
      alert('Gasto eliminado')
      obtenerGastosDesdeAPI()
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('No se pudo eliminar el gasto.')
    })
}

function Tabla(lista) {
  tbody.innerHTML = ''
  if (lista.length === 0) {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td colspan="5">No hay gastos en este mes</td>`
    tbody.appendChild(tr)
    return
  }

  lista.forEach((gasto) => {
    //verifia que el ide de categoria sea igual al de gasto.cateroria para mostrar el nombre de la categoria y no el id.

    const categoria = categoriaAPI.find((cat) => cat.id === gasto.categoria)

    // Si lo encuentra, usar el nombre; si no, poner 'Sin categoría'
    const nombreCategoria = categoria ? categoria.name : 'Sin categoría'

    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${gasto.titulo}</td>
      <td>${nombreCategoria}</td>
      <td>$${Number(gasto.monto).toLocaleString('es-CO', {
        minimumFractionDigits: 2,
      })}</td>
      <td>${gasto.fecha.toLocaleDateString('es-CO')}</td>
      <td>
        <button onclick="iniciarEdicion(${
          gasto.id
        })" class="btnEditar">Editar</button>
        <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
      </td>
    `
    limpiarFormulario()
    tbody.appendChild(tr)
  })
}
function limpiarFormulario() {
  document.getElementById('titulo').value = ''
  document.getElementById('descripcion').value = ''
  document.getElementById('monto').value = ''
  document.getElementById('gastoCategoria').value = ''
  document.getElementById('fecha').value = ''

  document.getElementById('btnGuardar').style.display = 'none'
  document.getElementById('btnAgregar').style.display = 'inline-block'

  const mensajeError = document.getElementById('mensajeError')
  if (mensajeError) {
    mensajeError.style.display = 'none'
  }

  //  document.getElementById("mensajeError").style.display="none";
}

obtenerGastosDesdeAPI()

//close Modal categoria
const btnCloseModal = document.getElementById('closeModal')
btnCloseModal.addEventListener('click', () => {
  document.querySelector('.modal').style.display = 'none'
})
// Open modal de categoria
const btnOpenModal = document.getElementById('btnOpenModal')

btnOpenModal.addEventListener('click', () => {
  document.querySelector('.modal').style.display = 'inline-block'
})
//modal gastos
// abrir modal de agregar nun gasto

const modalGastos = document.querySelector('.modalGastos')
const openModalGastos = document.getElementById('btnOpenModalGastos')
openModalGastos.addEventListener('click', () => {
  modalGastos.style.display = 'inline-block'

  document.getElementById('titulo').value = null
  document.getElementById('descripcion').value = null
  document.getElementById('monto').value = null
  document.getElementById('fecha').value = null

  document.getElementById('tituloModal').innerText = 'Nuevo Gasto'
  document.getElementById('btnAgregar').style.display = 'inline-block'
  document.getElementById('btnGuardar').style.display = 'none'

  // document.getElementById("btnCancelar").style.display = "inline-block";
})

// cerra modal gastos
//que devuelve una lista de nodos
document.querySelectorAll('.btnModal').forEach((btn) => {
  btn.addEventListener('click', () => {
    limpiarFormulario()
    document.querySelector('.modalGastos').style.display = 'none'
  })
})

function cerrarModalEditar() {
  const modal = document.getElementById('.modalGasto')

  modal.style.display = 'none'
}
//obtener  categoria
const url =
  'https://.booksandbooksdigital.com.co/practicante/backend/categories'
async function cargarCategorias() {
  const select = document.getElementById('categoria')
  select.innerHTML = ''

  try {
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories'
    )
    categoriaAPI = await res.json()

    categoriaAPI.forEach((cat) => {
      const option = document.createElement('option')
      option.value = cat.id // usar id como value
      option.textContent = cat.name
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Error al cargar categorias:', error)
  }
}

obtenerGastosDesdeAPI()
// funcion para mostrar las categorias en la tabla
function mostrarCategorias() {
  const categoria = document.getElementById('gastoCategoria')
  const categoriaFiltro = document.getElementById('filtroCategoria')
  categoriaAPI.map((dato) => {
    const option1 = document.createElement('option')

    option1.value = dato.id
    option1.textContent = dato.name
    categoria.appendChild(option1)

    const option2 = document.createElement('option')
    option2.value = dato.id
    option2.textContent = dato.name
    categoriaFiltro.appendChild(option2)
  })
}

cargarCategorias()

setTimeout(() => {
  mostrarCategorias()
}, 200)

// -------------------------------------------------
