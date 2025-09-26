//añade un escuchador y manda el evento del DOM html
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm') //solo va a recorrer un elemento id indentificado loginform
  if (!form) {
    // es la forma segura de de
    console.error("No se encontro el formulario con id='loginForm")
    return
  }

  form.addEventListener('submit', function (e) {
    // cuando el formulario se envie manda la funcion que viene despues
    e.preventDefault() //e. envia un comportamiento por defecto

    const correo = document.getElementById('correo').value.trim()
    const contraseña = document.getElementById('contraseña').value.trim()

    iniciarSesion(correo, contraseña)
  })
})

// 3 Autenticacion del usuario por la API
function iniciarSesion(correo, contraseña) {
  fetch(
    `https://demos.booksandbooksdigital.com.co/practicante/backend/users?email=${correo}&password=${contraseña}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    }
  )
    .then((response) => {
      console.log(response.ok)

      if (!response.ok) {
        // si la respuesta no es exitosa, manda un error
        throw new Error('Error Al inciar sesion ')
      }
      return response.json() // Si la respuesta fue ok convierte el cuerpo em json
    })
    .then((usuario) => {
      usuario = usuario[0]
      console.log(usuario)

      if (!correo || !contraseña) {
        // validacion y despues de la petición
        alert('Debes ingresar correo y contraseña')
        return
      }

      if (usuario) {
        //si el usuario existe
        localStorage.setItem('usuario', JSON.stringify(usuario))
        localStorage.setItem('autenticado', 'true')
        alert('Inicio de sesión con éxito')
        window.location.href = 'menu.html'
      } else {
        alert('correo o contraseña incorrectas')
      }
    })
    .catch((error) => {
      console.error('Error al conectar con el servidor:', error)
      alert('Error al iniciar sesión')
    })
}
