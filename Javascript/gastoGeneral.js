let gastos = []
let categoriaAPI = []

// obtener los gatos desde las APIs
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
      categoriaId: g.categoria || g.category || g.categoryId || 'Sin categoria',
      monto: Number(g.monto || g.amount || 0),
      fecha: g.fecha || g.date || '',
    }))

    renderizarTabla(gastos)
  } catch (err) {
    console.error('Error al cargar datos:', err)
    alert('No se pudieron cargar los gastos.')
  }
}

function aplicarFiltros() {
  const texto = document.getElementById('filtroTitulo').value.toLowerCase()
  const categoria = document.getElementById('filtroCategoria').value
  const min = parseFloat(document.getElementById('filtroMin').value) || 0
  const max = parseFloat(document.getElementById('filtroMax').value) || Infinity
  const mes = document.getElementById('filtroMes').value

  const filtrados = gastos
    .filter((g) => g.titulo.toLowerCase().includes(texto)) //para verfirificar si la cadena de texto es verdadero
    .filter((g) => !categoria || g.categoriaId === categoria)
    .filter((g) => g.monto >= min && g.monto <= max)
    .filter((g) => mes === '' || new Date(g.fecha).getMonth() === parseInt(mes))

  renderizarTabla(filtrados)
}
//  esta funcion es para que me muestre lo que tengo en la tabla
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
    // Buscar el nombre de la categoría en categoriaAPI
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
  const gasto = gastos.find((g) => g.id === id) // pasra conseguir un unoco elemento con el find
  if (!gasto) {
    alert('Gasto no encontrado.')
    return
  }
  document.getElementById('idEditar').value = gasto.id
  document.getElementById('tituloEditar').value = gasto.titulo
  document.getElementById('categoriaEditar').value = gasto.categoryId
  document.getElementById('montoEditar').value = gasto.monto
  document.getElementById('fechaEditar').value = gasto.fecha

  abrirModalEditar()
}

document
  .getElementById('modalEditar')
  .addEventListener('submit', async function (e) {
    e.preventDefault()

    const id = document.getElementById('idEditar').value
    const titulo = document.getElementById('tituloEditar').value.trim()
    const categoria = document.getElementById('categoriaEditar').value
    const monto = parseFloat(document.getElementById('montoEditar').value)
    const fecha = document.getElementById('fechaEditar').value
    try {
      const respuesta = await fetch(
        `https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ titulo, categoria, monto, fecha }),
        }
      )

      if (!respuesta.ok) throw new Error('Error al actualizar el gasto')

      alert('Gasto actualizado correctamente.')
      //  document.getElementById("formEditar").reset();
      //  document.getElementById("formEditar").style.display = "none";
      gastoEditandoId = null
      obtenerGastosDesdeAPI()
    } catch (error) {
      console.error('Error al guardar los cambios:', error)
      alert('Hubo un error al guardar los cambios.')
    }
  })
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

//obtener  categoria
const url =
  'https://.booksandbooksdigital.com.co/practicante/backend/categories'

async function cargarCategoria() {
  try {
    const respuestaCategoria = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories'
    )

    categoriaAPI = await respuestaCategoria.json()
    mostrarCategorias()
    // console.log("Categorias cargadas:", categoriaAPI);
  } catch (error) {
    console.error(' Error al traer las categorias:', error)
  }
}

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

  categoriaAPI.forEach((dato) => {
    const optionFiltro = document.createElement('option')
    optionFiltro.value = dato.name
    optionFiltro.text = dato.name
    categoriaFiltro.appendChild(optionFiltro)

    const optionEditar = document.createElement('option')
    optionEditar.value = dato.name
    optionEditar.text = dato.name
    categoriaEditar.appendChild(optionEditar)
  })
}
