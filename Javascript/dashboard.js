let gastos = []

// Traer gastos desde API
async function obtenerGastosDesdeAPI(filtrarPorUsuario = true) {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    // Si hay usuario filtrar por el userId
    let url =
      'https://demos.booksandbooksdigital.com.co/practicante/backend/expenses'
    if (filtrarPorUsuario && usuario) {
      url += `?userId=${usuario.id}` //Operador
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error('Error en la API')

    const data = await res.json()
    console.log('Gastos Recibidos', data)

    // Filtrar datos válidos
    gastos = data.filter((g) => !isNaN(parseFloat(g.amount)) && g.date)

    actualizarDashboard(gastos)
  } catch (error) {
    console.error('Error al obtener los datos:', error)
  }
}

// Actualizar dashboard
function actualizarDashboard(gastos) {
  if (!gastos.length) return

  // Ordenar de mayor a menor por monto
  const gastosOrdenados = [...gastos].sort(
    (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
  )

  const gastoMasAlto = gastosOrdenados[0]
  const gastoMasBajo = gastosOrdenados[gastosOrdenados.length - 1]
  const totalGeneral = gastos.reduce((acc, g) => acc + parseFloat(g.amount), 0)

  document.getElementById('gastoAlto').textContent = `$${parseFloat(
    gastoMasAlto.amount
  ).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`

  document.getElementById('gastoBajo').textContent = `$${parseFloat(
    gastoMasBajo.amount
  ).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`

  document.getElementById(
    'totalMes'
  ).textContent = `$${totalGeneral.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
  })}`
}

document.addEventListener('DOMContentLoaded', () => obtenerGastosDesdeAPI(true))
