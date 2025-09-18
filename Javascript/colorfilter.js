function cambiarColorFiltro() {
  const IS_TOP = 0

  // Obtenemos el elemento HTML
  const element = document.querySelector('.filtros')
  // Luego obtenemos sus coordenadas en pantalla
  const { y } = element.getBoundingClientRect()
  console.log(element.getBoundingClientRect())

  // Verificamos si está arriba, si es así cambiamos el color
  if (y === IS_TOP) {
    element.style.background = 'linear-gradient( rgba(60, 220, 200, 1) 77%)'
  }

  // Verificamos si tiene la propiedad style y si no está arriba, esto
  // para quitarle los estilos.
  if (element.hasAttribute('style') && y > IS_TOP) {
    element.removeAttribute('style')
  }
}
