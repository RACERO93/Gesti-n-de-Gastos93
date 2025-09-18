document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const mensajeError = document.getElementById('mensajeError');

  // Validaciones
  if (!nombre || !correo || !contraseña) {
    mensajeError.textContent = "Todos los campos son obligatorios.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {   //
    mensajeError.textContent = "Por favor, ingrese un correo valido.";
    return;
  }

  if (contraseña.length < 6) {
    mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }


  mensajeError.textContent = "";
  registrarUsuario(nombre, correo, contraseña, mensajeError);
});

async function registrarUsuario(name, email, password, mensajeError) {
  const usuario = { name, email, password };
  console.log('Intentando registrar usuario:', usuario);

  try {
    //  Consultar todos los usuarios antes de registrar
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/users");
    if (!res.ok) throw new Error("Error al obtener los usuarios");

    const usuarios = await res.json();
    console.log("Usuarios obtenidos:", usuarios);

    //  Validar si ya existe este usuario por correo
    const existe = usuarios.some(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existe) {
      mensajeError.textContent = "Este correo ya esta registrado.";
      alert("Este correo ya esta registrado")
      return;
    }

    //  Si no existe, registrar el nuevo usuario
    const resRegistro = await fetch('https://demos.booksandbooksdigital.com.co/practicante/backend/users', {
      method: 'POST',
      body: JSON.stringify(usuario),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!resRegistro.ok) throw new Error("Error al registrar usuario");

    const data = await resRegistro.json();
    console.log("Usuario creado:", data);

    alert(" Usuario creado exitosamente");
    

    
      window.location.href = "../iniciarSesion.html";

  } catch (error) {
    console.error('Error al conectar con la API:', error);
    mensajeError.textContent = "Error al registrar el usuario.";
  }
}