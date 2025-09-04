document.getElementById('perfilForm').addEventListener('submit', function (e) {
  e.preventDefault();  // para enviar el formuario

  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const id = usuario.id;



  //    if (!id) {
  //      alert("No se pudo obtener el ID del usuario.");
  //      return;
  //    }

  perfil(id, nombre, correo, contraseña);
});


document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("No se encontro informcion del usuario");
    window.location.href = "inicioSesion.html";
    return;
  }
  // Trae los dastos de los usuario
  document.getElementById("nombre").value = usuario.name || "";
  document.getElementById("correo").value = usuario.email || "";

  document.getElementById("contraseña").value = "";
});


//  ACTUALIZAR USUARIO
function perfil(id, nombre, correo, contraseña) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users/${id}`, {
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
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al modificar perfil");
      }
      return response.json();
    })
    .then(usuario => {
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('autenticado', 'true');
        alert("Perfil editado con Exito");
        window.location.href = 'menu.html';
      }
    })
    .catch(error => {
      console.error("Error al editar usuario:", error);
      alert("Hubo un error al editar el perfil.");
    });
}



// ELIMINAR CUENTA 


document.getElementById('eliminarUsuario').addEventListener('click', function () {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const id = usuario.id;



  if (confirm("perdera toda su informacion")) {
    eliminarUsuario(id);
  }
});

function eliminarUsuario(id) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Bearer TU_TOKEN_AQUI"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        alert("Cuenta eliminada correctamente.");
        localStorage.clear();
        window.location.href = 'iniciarSesion.html';
      }
    })
    .catch(error => {
      console.error("Error al eliminar el usuario:", error);
      alert("Hubo un error al eliminar la cuenta.");
    });
}
