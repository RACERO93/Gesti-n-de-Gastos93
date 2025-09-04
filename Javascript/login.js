
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('loginForm');  //solo va a recorrer un elemento id indentificado loginform
  if (!form) {
    console.error("No se encontro el formulario con id='loginForm");
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();

    

    iniciarSesion(correo, contraseña);
  });
});

        // 3 Autenticacion del usuario por la API
function iniciarSesion(correo, contraseña) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users?email=${correo}&password=${contraseña}`, {
    method: 'GET',
    headers: {
      "content-type": "application/json"
    },

  })

    .then(response => {
      console.log(response.ok);

      if (!response.ok) {
        throw new Error("Error Al inciar sesion ");
      }
      return response.json();
    })
    .then((usuario) => {

      usuario = usuario[0];
      console.log(usuario);


      if (!correo || !contraseña) {
        alert("Debes ingresar correo y contraseña");
        return;
      }
    
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('autenticado', 'true');
        alert("Inicio de sesion exitoso");
        window.location.href = 'menu.html';
      } else {
        alert("correo o contraseña incorrectas");
      }
    })
    .catch(error => {
      console.error('Error al conectar con el servidor:', error);
      alert("Error al iniciar sesión");
    });
}
// fetch`(https://demos.booksandbooksdigital.com.co/practicante/backend/users?email=${correo})`;
//     .then(res) =>{
      

//     }
