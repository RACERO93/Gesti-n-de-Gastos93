function cambiarColorFiltro() {
  const IS_TOP = 0

  // Obtenemos el elemento HTML
  const element = document.querySelector('.filtros')
  // Luego obtenemos sus coordenadas en pantalla
  const { y } = element.getBoundingClientRect()

  // Verificamos si está arriba, si es así cambiamos el color
  if (y === IS_TOP) {
    //condicion
    element.style.background = 'linear-gradient( rgb(177 243 235) 77%)'
    element.style.boxShadow = 'rgb(183 200 203) -1px 9px 7px 3px'
  }

  // Verificamos si tiene la propiedad style y si no está arriba, esto
  // para quitarle los estilos.
  if (element.hasAttribute('style') && y > IS_TOP) {
    element.removeAttribute('style')
  }
}
