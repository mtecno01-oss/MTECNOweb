const WA = "5491133508318"; // Tu WhatsApp: 54 (país) + 9 (celular) + 11 (área) + 33508318, sin signos ni espacios
const R = { // Objeto "R": cada equipo con su lista de reparaciones
    "Celular": ["Cambio de pantalla", "Cambio de batería", "Pin de carga", "Cámara", "Altavoz o micrófono", "Equipo mojado", "Software o liberación", "Otro"], // Reparaciones de celulares
    "Tablet": ["Cambio de pantalla", "Cambio de batería", "Pin de carga", "Software", "Otro"], // Reparaciones de tablets
    "Computadora": ["Formateo e instalación", "Disco SSD", "Memoria RAM", "Limpieza y pasta térmica", "Fuente o placa", "No enciende", "Otro"], // Reparaciones de computadoras
    "Notebook": ["Cambio de pantalla", "Teclado", "Pin de carga", "Disco SSD o RAM", "Limpieza y pasta térmica", "Formateo e instalación", "No enciende", "Otro"], // Reparaciones de notebooks
    "Equipo electrónico": ["Diagnóstico general", "Fuente o placa", "Otro"]
}; // Reparaciones de equipos electrónicos
const eq = document.getElementById("eq"),
    rep = document.getElementById("rep"); // Busca en la página los dos desplegables por su id
eq.innerHTML = Object.keys(R).map(k => `<option>${k}</option>`).join(""); // Crea una opción por cada equipo del objeto R
function fill() { // Función que llena las reparaciones según el equipo elegido
    rep.innerHTML = R[eq.value].map(k => `<option>${k}</option>`).join(""); // Reemplaza las opciones del segundo desplegable
} // Fin de la función
eq.onchange = fill; // Cuando el cliente cambia de equipo, se vuelve a llenar la lista de reparaciones
fill(); // La llena una vez al cargar la página
document.getElementById("wal").href = "https://wa.me/" + WA; // Arma el enlace directo a tu WhatsApp en la sección de contacto
document.getElementById("f").onsubmit = e => { // Cuando se envía el formulario...
    e.preventDefault(); // ...evita que la página se recargue
    const v = id => document.getElementById(id).value.trim(); // Atajo: devuelve el texto de un campo sin espacios sobrantes
    const t = `Hola Mtecno, soy ${v("nom")}. Quiero solicitar un presupuesto.\nEquipo: ${eq.value}\nMarca: ${v("marca")}\nModelo: ${v("modelo")}\nReparación: ${rep.value}` + (v("det") ? `\nDetalle: ${v("det")}` : ""); // Arma el mensaje; \n es salto de línea; el detalle se agrega solo si lo completó
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank"); // Abre WhatsApp con el mensaje listo (encodeURIComponent lo adapta a una URL)
}; // Fin del envío