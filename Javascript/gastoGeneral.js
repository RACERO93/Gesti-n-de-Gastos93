let gastos = []
let categoriaAPI = []

// ======================== OBTENER GASTOS ========================
async function obtenerGastosDesdeAPI() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (!usuario) {
      alert('Debes iniciar sesión primero')
      return
    }

    const res = await fetch(
      `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses?userId=${usuario.id}`
    )
    if (!res.ok) throw new Error('Error al obtener gastos')

    const data = await res.json()

    gastos = data.map((g) => ({
      id: g.id,
      userId: g.userId,
      titulo: g.titulo || g.title || 'Sin titulo',
      categoriaId: g.categoria || g.category || g.categoryId || null,
      monto: Number(g.monto || g.amount || 0),
      fecha: g.fecha || g.date || '',
    }))

    renderizarTabla(gastos)
  } catch (err) {
    console.error('Error al cargar datos:', err)
    alert('No se pudieron cargar los gastos.')
  }
}

// ======================== FILTROS ========================
function aplicarFiltros() {
  const texto = document.getElementById('filtroTitulo').value.toLowerCase()
  const categoria = document.getElementById('filtroCategoria').value
  const fechaFiltro = document.getElementById('filtroFecha').value
  const montoExacto = document.getElementById('filtroMontoExacto').value
  const min = parseFloat(document.getElementById('filtroMin').value) || 0
  const max = parseFloat(document.getElementById('filtroMax').value) || Infinity
  const ordenarPor = document.getElementById('ordenarPor').value
  const mes = document.getElementById('filtroMes').value

  const filtrados = gastos
    .filter((g) => g.titulo.toLowerCase().includes(texto))
    .filter((g) => !categoria || g.categoriaId == categoria) // ahora sí compara id
    .filter((g) => !fechaFiltro || g.fecha === fechaFiltro)
    .filter((g) => !montoExacto || g.monto == montoExacto)
    .filter((g) => g.monto >= min && g.monto <= max)
    .filter((g) => mes === '' || new Date(g.fecha).getMonth() === parseInt(mes))

  // aplicar el ordenamiento
  if (ordenarPor === 'fecha') {
    filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  } else if (ordenarPor === 'monto') {
    filtrados.sort((a, b) => a.monto - b.monto)
  }

  renderizarTabla(filtrados)
}
function limpiarFiltros() {
  document.getElementById('filtroTitulo').value = ''
  document.getElementById('filtroCategoria').value = ''
  document.getElementById('filtroMin').value = ''
  document.getElementById('filtroMax').value = ''
  document.getElementById('filtroMes').value = ''
  document.getElementById('filtroFecha').value = ''
  document.getElementById('filtroMontoExacto').value = ''
  document.getElementById('ordenarPor').value = ''

  // Mostrar todos los gastos otra vez
  renderizarTabla(gastos)
}

// function parsedDate(date) {
//   const [y, m, d] = date.split('-').map(Number)
//   return new Date(y, m - 1, d)
// }
// ---------- TABLA
function renderizarTabla(lista) {
  const tbody = document.getElementById('tablaGastos')
  tbody.innerHTML = ''

  if (lista.length === 0) {
    const fila = document.createElement('tr')
    fila.innerHTML = `<td colspan="5">No hay resultados</td>`
    tbody.appendChild(fila)
    return
  }

  lista.forEach((g) => {
    let nombreCategoria = 'Sin categoria'
    const cat = categoriaAPI.find((c) => c.id == g.categoriaId)
    if (cat) nombreCategoria = cat.name

    const fila = document.createElement('tr')
    fila.innerHTML = `
<td>${g.titulo}</td>
<td>${nombreCategoria}</td>
<td>$${g.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
  <td>${new Date(g.fecha).toLocaleDateString()}</td>
    <td>
      <button onclick="editarGasto(${g.id})">Editar</button>
      <button onclick="eliminarGasto(${g.id})">Eliminar</button>
    </td>
`
    tbody.appendChild(fila)
  })
}

// --------------- EDITAR
function abrirModalEditar() {
  document.getElementById('modalEditar').style.display = 'block'
}
function cerrarModalEditar() {
  document.getElementById('modalEditar').style.display = 'none'
}
window.onclick = function (event) {
  const modal = document.getElementById('modalEditar')
  if (event.target === modal) cerrarModalEditar()
}

function editarGasto(id) {
  const gasto = gastos.find((g) => g.id === id)
  if (!gasto) {
    alert('Gasto no encontrado.')
    return
  }
  document.getElementById('idEditar').value = gasto.id
  document.getElementById('tituloEditar').value = gasto.titulo
  document.getElementById('categoriaEditar').value = gasto.categoriaId
  document.getElementById('montoEditar').value = gasto.monto
  document.getElementById('fechaEditar').value = gasto.fecha

  abrirModalEditar()
}

// NUEVO: Guardar edición
async function guardarEdicion() {
  const id = document.getElementById('idEditar').value
  const titulo = document.getElementById('tituloEditar').value
  const categoriaId = document.getElementById('categoriaEditar').value
  const monto = document.getElementById('montoEditar').value
  const fecha = document.getElementById('fechaEditar').value

  if (!titulo || !categoriaId || !monto || !fecha) {
    alert('Todos los campos son obligatorios')
    return
  }

  try {
    const res = await fetch(
      `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          titulo,
          categoria: categoriaId,
          monto,
          fecha,
        }),
      }
    )

    if (!res.ok) throw new Error('Error al actualizar el gasto en la API')

    // actualizar en memoria
    const index = gastos.findIndex((g) => g.id == id)
    if (index !== -1) {
      gastos[index] = {
        ...gastos[index],
        titulo,
        categoriaId,
        monto: Number(monto),
        fecha,
      }
    }

    aplicarFiltros() // refrescar la tabla
    cerrarModalEditar()
    alert('Gasto actualizado con éxito ')
  } catch (error) {
    console.error(error)
    alert('No se pudo guardar la edición: ' + error.message)
  }
}

// -------------------- ELIMINAR
function eliminarGasto(id) {
  if (!confirm('¿Seguro que deseas eliminar este gasto?')) return

  fetch(
    `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`,
    {
      method: 'DELETE',
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error('Error al eliminar de la API.')
      gastos = gastos.filter((g) => g.id !== id)
      aplicarFiltros()
    })
    .catch((error) => {
      alert('Error al eliminar gasto: ' + error.message)
    })
}

// ---------------------- CATEGORIAS
async function cargarCategoria() {
  try {
    const respuestaCategoria = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories'
    )
    categoriaAPI = await respuestaCategoria.json()
    mostrarCategorias()
  } catch (error) {
    console.error('Error al traer las categorias:', error)
  }
}
// para mostrar en la tabla de categoria
function mostrarCategorias() {
  const categoriaFiltro = document.getElementById('filtroCategoria')
  categoriaAPI.map((dato) => {
    const option = document.createElement('option')

    option.id = dato.id
    option.text = dato.name
    categoriaFiltro.appendChild(option)
  })
}
cargarCategoria()

setTimeout(() => {
  mostrarCategorias()
}, 200)

obtenerGastosDesdeAPI()

function mostrarCategorias() {
  const categoriaFiltro = document.getElementById('filtroCategoria')
  const categoriaEditar = document.getElementById('categoriaEditar')

  categoriaFiltro.innerHTML =
    '<option value="">-- Todas  las Categorias --</option>'
  categoriaEditar.innerHTML =
    '<option value="" disabled selected >-- Seleccione --</option>'

  categoriaAPI.forEach((dato) => {
    const optionFiltro = document.createElement('option')
    optionFiltro.value = dato.id // ahora guarda el ID
    optionFiltro.text = dato.name
    categoriaFiltro.appendChild(optionFiltro)

    const optionEditar = document.createElement('option')
    optionEditar.value = dato.id // ahora guarda el ID
    optionEditar.text = dato.name
    categoriaEditar.appendChild(optionEditar)
  })
}

cargarCategoria()
obtenerGastosDesdeAPI()
