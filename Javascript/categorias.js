let categoriaEditandoId = null

async function mostrarCategoriasEnTabla() {
  // para convertir la funcion en asincrona
  const tabla = document.getElementById('tablaCategoria') //traer el elemento de html id
  tabla.innerHTML = ''
  try {
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories'
    )
    const categorias = await res.json()
    categorias.forEach((cat) => {
      //  para  recorrer a cada uno de los elementos
      const tr = document.createElement('tr') // Crea un nodo elemento de html, fila de la tabbla

      // Crear una fila de una tabla de cada categoria y eje cuta la funcion editarCategoria y pasa los dos valores
      tr.innerHTML = `   
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td>
      <button onclick="editarCategoria(${cat.id}, '${cat.name}')">Editar</button>
      <button disabled>Eliminar</button>
      </td>
  `
      tabla.appendChild(tr) //agrega una fila dentro de una tabla
    })
  } catch (error) {
    //este error pasa si la api no responde, hay un error de red o el codigo tiene un fallo
    alert('Error al cargar categorias') //abre una ventana de emergrncia en el navegador
  }
}

async function agregarCategoria() {
  //el async va un await que esperando un resultados des peticiones a una APi
  const name = document.getElementById('nuevaCategoria').value.trim() //toma lo que el usirio ecribe y loguarda en una const name
  const mensaje = document.getElementById('mensajeCategoria')
  if (!name) {
    //esto es por si el campo name  esta vacion o no hay nada escrito manda un mensaje
    mensaje.textContent = 'ingresar una categoria'
    mensaje.style.color = 'red'
    return //  se detiene la funcion ahi mismo, y no guarda porqu el campo esta vacio
  }
  try {
    //abre un bloque para que se pueda ejecutar un codigo
    //consultar categorias existente
    const resCategorias = await fetch(
      //se hace una peticion GET al endpoint de categoria y await espera la respuest en objecto
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories'
    )
    //lee el cuerpo de la tarjeta y lo convuerte en objeto
    const categorias = await resCategorias.json()

    // validar si ya existe o no.
    const existe = categorias.some(
      //some: Su proposito es verificar la existencia de un elemento que satisfaga una prueba
      //recorre el Array para que no me repita las categorias manda elemennto true si es verdadero
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    )

    if (existe) {
      // si ya existe una categoria con el mismo nombre manda el mensaje
      mensaje.textContent = 'la categoria ya existe '
      mensaje.style.color = 'red'
      return //sale de la funcion y no se crea la categoria porque ya existe
    }
    //  si no existe agrega la categoria lanzando la peticion POST
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/categories',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }
    )
    // lanza una excepciono una condicion de error
    if (!res.ok) throw new Error('la categoria ya existe')
    mensaje.textContent = 'Categoria agregada'
    alert('Categoria Agregada')
    mensaje.style.color = 'green'
    document.getElementById('nuevaCategoria').value = '' //limpia el input donde el usuario escribio el nombre, dejandolo vacio
    mostrarCategoriasEnTabla() // llama a la funcon la carga y la muestra en la tabla
    cerrarModal()
  } catch (error) {
    mensaje.textContent = 'la categoria ya existe'
    mensaje.style.color = 'red'
  }
}

function editarCategoria(id, nombre) {
  categoriaEditandoId = id //guarda un id en una variable probablemente gobla
  document.getElementById('nuevaCategoria').value = nombre //busca el elmento del formulario id
  document.getElementById('btnAgregarCategoria').style.display = 'none'
  document.getElementById('btnGuardarCategoria').style.display = 'inline-block'
  document.getElementById('tituloModal').textContent = 'Editar Categoria'
  document.getElementById('myModal').style.display = 'block'
}

async function actualizarCategoria() {
  const nombre = document.getElementById('nuevaCategoria').value.trim()
  const mensaje = document.getElementById('mensajeCategoria')
  //compruba que no este vacio y que exista
  if (!nombre || !categoriaEditandoId) {
    mensaje.textContent = 'Nombre invalido o sin categoria seleccionada'
    mensaje.style.color = 'red'
    return
  }
  try {
    const res = await fetch(
      `https://demos.booksandbooksdigital.com.co/practicante/backend/categories/${categoriaEditandoId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nombre }), // conviete un objeto o array en cadena de texto forma json
      }
    )
    if (!res.ok) throw new Error('Error al actualizar')
    mensaje.textContent = 'Categoria actualizada'
    alert('Gasto Actualizado')
    mensaje.style.color = 'green'
    categoriaEditandoId = null
    document.getElementById('nuevaCategoria').value = ''
    mostrarCategoriasEnTabla()

    cerrarModal()
  } catch (error) {
    mensaje.textContent = 'Error al actualizar'
    mensaje.style.color = 'red'
  }
}

// Agregar categoria por modal
function cerrarModal() {
  document.getElementById('myModal').style.display = 'none'
  document.getElementById('btnAgregarCategoria').style.display = 'inline-block'
  document.getElementById('btnGuardarCategoria').style.display = 'none'
  document.getElementById('tituloModal').textContent = 'Agregar Categoria'
  document.getElementById('mensajeCategoria').textContent = ''
}
// Boton para abrir el modal con un click
document.getElementById('btnOpenModal').addEventListener('click', () => {
  document.getElementById('myModal').style.display = 'block'
})
// Boton para cerra el modal y los click de aagregar y atualizar en los botones
document.getElementById('closeModalBtn').addEventListener('click', cerrarModal)
document
  .getElementById('btnAgregarCategoria')
  .addEventListener('click', agregarCategoria)
document
  .getElementById('btnGuardarCategoria')
  .addEventListener('click', actualizarCategoria)

// Inicializar tabla
mostrarCategoriasEnTabla()
