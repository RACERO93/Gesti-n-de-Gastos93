document
  .getElementById('registerForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const nombre = document.getElementById('nombre').value.trim()
    const correo = document.getElementById('correo').value.trim()
    const contraseña = document.getElementById('contraseña').value.trim()
    const mensajeError = document.getElementById('mensajeError')

    // Validaciones
    if (!nombre || !correo || !contraseña) {
      mensajeError.textContent = 'Todos los campos son obligatorios.'
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      //  es una validacion basica pera los correos
      mensajeError.textContent = 'Por favor, ingrese un correo valido.'
      return
    }

    if (contraseña.length < 6) {
      // si tienes menos de 6 caracteres entra al bloque
      mensajeError.textContent =
        'La contraseña debe tener al menos 6 caracteres.'
      return
    }

    mensajeError.textContent = ''
    registrarUsuario(nombre, correo, contraseña, mensajeError)
  })

async function registrarUsuario(name, email, password, mensajeError) {
  //+declaro una fujncion con 4 parametros
  const usuario = { name, email, password } //se crea una variable donde se guardan los parametros u objeto
  console.log('Intentando registrar usuario:', usuario) //depuración

  try {
    //  Hace una peticion en GET para otener la lista de los usurios y esperar repuesta
    const res = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/users'
    )
    if (!res.ok) throw new Error('Error al obtener los usuarios') //se lanza una excepcion y detiene la ejecuicion del codigo

    const usuarios = await res.json() //convierte la rspuest en json y lo guarda en el usuario
    console.log('Usuarios obtenidos:', usuarios)

    //  Validar si ya existe este usuario por correo
    const existe = usuarios.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    )
    if (existe) {
      // y si ya existe envia una alerta
      mensajeError.textContent = 'Este correo ya esta registrado.'
      alert('Este correo ya esta registrado')
      return
    }

    //  Si no existe, registrar el nuevo usuario
    const resRegistro = await fetch(
      'https://demos.booksandbooksdigital.com.co/practicante/backend/users',
      {
        method: 'POST',
        body: JSON.stringify(usuario), // envia al cuerpo como json
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!resRegistro.ok) throw new Error('Error al registrar usuario')

    const data = await resRegistro.json()
    console.log('Usuario creado:', data) //imprime en consola la respuesta del servidor

    alert(' Usuario creado exitosamente')

    window.location.href = '../iniciarSesion.html' //carga a la pagina iniciar sesión
  } catch (error) {
    console.error('Error al conectar con la API:', error) //loguea el error detallado en la consola para la depuración
    mensajeError.textContent = 'Error al registrar el usuario.'
  }
}
