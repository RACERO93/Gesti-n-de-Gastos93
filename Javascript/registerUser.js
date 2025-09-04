document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('Se envio la peticion');

  const nombre = document.getElementById('nombre').value.trim();        //Quitar los espacios al principio y al final
  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const mensajeError = document.getElementById('mensajeError');

  //  Validaciones
  if (!nombre || !correo || !contraseña) {
    mensajeError.textContent = "Todos los campos son obligatorios.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    mensajeError.textContent = "Por favor, ingrese un correo valido.";
    return;
  }

  if (contraseña.length < 6) {
    mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }



  // Si todo esta bien, ocultar el mensaje y registrar
  mensajeError.style.display = "none";
  registrarUsuario(nombre, correo, contraseña);
});


function registrarUsuario(name, email, password) {
  const usuario = { name, email, password };


  console.log('usuario ', usuario);

    // 1  Consultar Todos Los Usuarios y crear un nuevo usuario 
  fetch('https://demos.booksandbooksdigital.com.co/practicante/backend/users', {
    method: 'POST',
    body: JSON.stringify(usuario),  // convirtiendo un array en texto
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
    .then(response => response.json())      // promesa
    .then(data => {
      console.log(data);
      alert("Usuario creado ")
      localStorage.clear();
      window.location.href = 'iniciarSesion.html';

    })
    // .catch(error => {
    //   console.error('Error al conectar con la API:', error);
    // });
}

