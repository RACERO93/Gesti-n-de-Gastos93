let gastos = [];

function obtenerGastosDesdeAPI() {

  fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses")
    .then(res => res.json())
    .then(data => {
      // Filtrar solo gastos validos (con monto numrico y fecha valida)
      gastos = data.filter(g => !isNaN(parseFloat(g.monto)) && g.fecha);
      actualizarDashboard(gastos);
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
      
    });
}

function actualizarDashboard(gastos) {
  if (!gastos.length) return;

  // Ordenar de mayor a menor por monto
  const gastosOrdenados = [...gastos].sort((a, b) => parseFloat(b.monto) - parseFloat(a.monto));

  const gastoMasAlto = gastosOrdenados[0];
  const gastoMasBajo = gastosOrdenados[gastosOrdenados.length - 1];

  
  const totalGeneral = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

  // Mostrar en HTML
  // document.querySelector()hace llamdo del primer elemento que necesita en html
  document.querySelector("#gastoAlto span").textContent = `$${parseFloat(gastoMasAlto.monto).toLocaleString('es-CO', {minimumFractionDigits:2})}`;
  document.querySelector("#gastoBajo span").textContent = `$${parseFloat(gastoMasBajo.monto).toLocaleString('es-CO', {minimumFractionDigits:2})}`;
  document.querySelector("#totalMes span").textContent = `$${totalGeneral.toLocaleString('es-CO',{minimumFractionDigits:2})}`;
}


document.addEventListener("DOMContentLoaded", obtenerGastosDesdeAPI)

