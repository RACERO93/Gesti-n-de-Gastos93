document.getElementById('perfilForm').addEventListener('submit', function (e) {
  e.preventDefault();  // para enviar el formuario

  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const id = usuario.id;


  perfil(id, nombre, correo, contraseña);
});


document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("No se encontro informcion del usuario");
    window.location.href = "inicioSesion.html";
    return;
  }
  // Traer los dastos de los usuario
  document.getElementById("nombre").value = usuario.name || "";
  document.getElementById("correo").value = usuario.email || "";

  document.getElementById("contraseña").value = "";
});

//  ACTUALIZAR USUARIO
async function perfil(id, nombre, correo, contraseña) {
  try {
    // Consultar todos los usuarios de la API
    const resUsuarios = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/users");
    if (!resUsuarios.ok) throw new Error("Error al obtener usuarios");
    const listaUsuarios = await resUsuarios.json();

    //  Verificar si el correo ya esta en uso por otro usuario
    const correoExistente = listaUsuarios.find(u => u.email === correo && u.id !== id);
    if (correoExistente) {
      alert(" El correo ya esta registrado por otro usuario.");
      return; 
    }

    //  Si no existe, actualizar usuario
    const response = await fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer TU_TOKEN_AQUI"
      },
      body: JSON.stringify({
        name: nombre,
        email: correo,
        password: contraseña
      })
    });

    if (!response.ok) {
      throw new Error("Error al modificar perfil");
    }

    const usuario = await response.json();

    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('autenticado', 'true');
      alert(" Perfil editado con éxito");
      // Redirigir a Menú
      window.location.href = '../menu.html';
    }
  } catch (error) {
    console.error("Error al editar usuario:", error);
    alert("Hubo un error al editar el perfil.");
  }
}