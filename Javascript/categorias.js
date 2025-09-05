// const reactDom = require("react-dom");

let categoriaEditandoId = null;

async function mostrarCategoriasEnTabla() {  // para convertir la funcion en asincrona 
  const tabla = document.getElementById("tablaCategoria");       //traer el elemento de html id
  tabla.innerHTML = "";
  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
    const categorias = await res.json();
    categorias.forEach(cat => {      //  para  recorrer a cada uno de los elementos
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td>
      <button onclick="editarCategoria(${cat.id}, '${cat.name}')">Editar</button>
      <button disabled>Eliminar</button>
      </td>
  `;
      tabla.appendChild(tr);
    });
  } catch (error) {
    alert("Error al cargar categorias");
  }
}

function editarCategoria(id, nombre) {
  categoriaEditandoId = id;
  document.getElementById("nuevaCategoria").value = nombre;
  document.getElementById("btnAgregarCategoria").style.display = "none";
  document.getElementById("btnGuardarCategoria").style.display = "inline-block";
  document.getElementById("tituloModal").textContent = "Editar Categoria";
  document.getElementById("myModal").style.display = "block";
}



async function agregarCategoria() {
  const name = document.getElementById("nuevaCategoria").value.trim();
  const mensaje = document.getElementById("mensajeCategoria");
  if (!name) {

    mensaje.textContent = "ingresar una categoria";
    mensaje.style.color = "red";
    return;
  }
  try {
    //consultar categorias existente  
    const resCategorias =await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
    const categorias = await resCategorias.json();


    // validar si ya existe o no
    const existe = categorias.some(cat => cat.name.toLowerCase() === name.toLowerCase());

    if(existe){
      mensaje.textContent = "la categoria ya existe "
      mensaje.style.color = "red";
      return;
    }
    //  si no existe agrega la categoria
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error("la categoria ya existe");
    mensaje.textContent = "Categoria agregada";
    alert("Categoria Agregada")
    mensaje.style.color = "green";
    document.getElementById("nuevaCategoria").value = "";
    mostrarCategoriasEnTabla();
    cerrarModal();
  } catch (error) {
    mensaje.textContent = "la categoria ya existe";
    mensaje.style.color = "red";
  }
}

async function actualizarCategoria() {
  const nombre = document.getElementById("nuevaCategoria").value.trim();
  const mensaje = document.getElementById("mensajeCategoria");
  if (!nombre || !categoriaEditandoId) {

    mensaje.textContent = "Nombre invalido o sin categoria seleccionada";
    mensaje.style.color = "red";
    return;
  }
  try {
    const res = await fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/categories/${categoriaEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombre })   // conviete un objeto o array en cadena de texto forma json
    });
    if (!res.ok) throw new Error("Error al actualizar");
    mensaje.textContent = "Categoria actualizada";
    alert("Gasto Actualizado")
    mensaje.style.color = "green";
    categoriaEditandoId = null;
    document.getElementById("nuevaCategoria").value = "";
    mostrarCategoriasEnTabla();

    cerrarModal();
  } catch (error) {
    mensaje.textContent = "Error al actualizar";
    mensaje.style.color = "red";

  }
}

// Agregar categoria por modal  
function cerrarModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("btnAgregarCategoria").style.display = "inline-block";
  document.getElementById("btnGuardarCategoria").style.display = "none";
  document.getElementById("tituloModal").textContent = "Agregar Categoria";
  document.getElementById("mensajeCategoria").textContent = "";
}
// Boton para abrir el modal con un click
document.getElementById("btnOpenModal").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "block";
});
// Boton para cerra el modal y los click de aagregar y atualizar en los botones
document.getElementById("closeModalBtn").addEventListener("click", cerrarModal);
document.getElementById("btnAgregarCategoria").addEventListener("click", agregarCategoria);
document.getElementById("btnGuardarCategoria").addEventListener("click", actualizarCategoria);

// Inicializar tabla
mostrarCategoriasEnTabla();
