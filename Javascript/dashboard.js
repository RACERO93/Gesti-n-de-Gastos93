
let gastos = [];

// Traer gastos desde API
async function obtenerGastosDesdeAPI(filtrarPorUsuario = true) {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Si hay usuario y queremos filtrar por el  userId
    let url = "https://demos.booksandbooksdigital.com.co/practicante/backend/expenses";
    if (filtrarPorUsuario && usuario) {
      url += `?userId=${usuario.id}`;   //para llamar el expenses y el usuario id desde la api
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error en la API");

    const data = await res.json();
    console.log("Gasto Recibidos", data);
    

    
    gastos = data.filter(g => !isNaN(parseFloat(g.amount)) && g.date);

    actualizarDashboard(gastos);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Actualizar dashboard
function actualizarDashboard(gastos) {
  if (!gastos.length) return;

  // Ordenar de mayor a menor por monto
  const gastosOrdenados = [...gastos].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  const gastoMasAlto = gastosOrdenados[0];
  const gastoMasBajo = gastosOrdenados[gastosOrdenados.length - 1];

  const totalGeneral = gastos.reduce((acc, g) => acc + parseFloat(g.amount), 0);

  // Mostrar en HTML
  document.querySelector("#gastoAlto span").textContent =
    `$${parseFloat(gastoMasAlto.amount).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  document.querySelector("#gastoBajo span").textContent =
    `$${parseFloat(gastoMasBajo.amount).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  document.querySelector("#totalMes span").textContent =
    `$${totalGeneral.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
}

// Al cargar la pagina dashboard SOLO del usuario
document.addEventListener("DOMContentLoaded", () => obtenerGastosDesdeAPI(true));
