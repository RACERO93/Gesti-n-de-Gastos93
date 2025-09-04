


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "https://demosbooksandbooksdigital.com.co/practicante/backend/categories?name_like=transport"
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const categorias = await response.json();
    console.log("Categorias que incluyen 'transport':", categorias);
    
    
    const contenedor = document.querySelector(".info");
    const lista = document.createElement("ul");
    categorias.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = `${cat.id}: ${cat.name}`;
      lista.appendChild(li);
    });
    contenedor.appendChild(lista);
    
  } catch (error) {
    console.error("Error al obtener categorias:", error);
  }
});