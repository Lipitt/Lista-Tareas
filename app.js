//declaro variables
const lista = document.querySelector(".collection");
const form = document.querySelector("#task-form");
const campo = document.querySelector("#task-input");
const limpiar = document.querySelector(".clear-tasks");
const campoFiltro = document.querySelector("#filter-input");

//inicializo los event listeners
form.addEventListener("submit", agregarTarea);
lista.addEventListener("click", borrarTarea);
limpiar.addEventListener("click", limpiarTareas);
campoFiltro.addEventListener("keyup", filtrarTareas);
document.addEventListener("DOMContentLoaded", traerLista);

//traigo los elementos del local storage a la lista de la UI
function traerLista() {
  let tareas;
  //si el LS no tiene el elemento tareas, lo seteo como un array vacio
  if (localStorage.getItem("tareas") === null) {
    tareas = [];
    //si lo tiene, le asigno al array lo que esta en el LS
  } else {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }

  //por cada elemento en el LS, lo voy a agregar a la lista de la UI
  tareas.forEach(function (tarea) {
    agregarItemLista(tarea);
  });
}

//funcion de agregar tarea
function agregarTarea(e) {
  //evito la funcion por defecto del boton
  e.preventDefault();
  //pregunto si el campo esta vacio. si lo esta, pido que se ingrese una tarea
  //si no lo esta, lo agrego a la lista y lo guardo en local storage
  if (campo.value === "") {
    alert("Ingrese una tarea");
  } else {
    agregarItemLista(campo.value);
    guardarEnAlmacenamientoLocal(campo.value);

    //vacio el campo
    campo.value = "";
  }
}

function agregarItemLista(textoTarea) {
  // utilizo template literals para insertar el html con el valor
  // introducio en el campo, generando un nuevo item en la lista
  lista.innerHTML =
    lista.innerHTML +
    `<li class="collection-item">
      ${textoTarea} <a href="#!" class="delete-item secondary-content">
        <i class="fa fa-remove"></i></a></li>`;
}

function guardarEnAlmacenamientoLocal(tarea) {
  let tareas;
  if (localStorage.getItem("tareas") === null) {
    tareas = [];
  } else {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }

  //le agrego al array el nuevo elemento y lo guardo en local storage
  tareas.push(tarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function borrarTarea(e) {
  //pregunto si el padre del evento contiene la clase delete item
  //para asegurarme de que estoy escuchando al elemento correcto
  if (e.target.parentElement.classList.contains("delete-item")) {
    //borro el tag <li> que se encuentra 3 niveles mas arriba del evento
    //y tambien lo borro en el local storage
    e.target.parentElement.parentElement.remove();
    borrarTareaEnAlmacenamientoLocal(e.target.parentElement.parentElement);
  }
}

function borrarTareaEnAlmacenamientoLocal(itemTarea) {
  let tareas;
  if (localStorage.getItem("tareas") === null) {
    tareas = [];
  } else {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }

  //por cada elemento en el array tareas pregunto si el elemento que me llega por parametro
  //es igual al elemento del array. si lo es, uso splice para quitar el elemento

  tareas.forEach(function (tarea, indice) {
    if (itemTarea.textContent.replace(/\s/g, "") === tarea) {
      tareas.splice(indice, 1);
    }
  });
  //vuelvo a guardar el array en el local storage despues de modificarlo
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function limpiarTareas(e) {
  e.preventDefault();
  //quito los elementos de la lista
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }
  localStorage.clear();
}

function filtrarTareas(e) {
  //guardo el texto ingresado en el filtro en una variable para poder compararlo mas adelante
  const textoFiltro = e.target.value.toLowerCase();

  //hago un for each de la lista
  document.querySelectorAll(".collection-item").forEach(function (tarea) {
    //guardo en una variable el texto del elemento correspondiente
    const item = tarea.firstChild.textContent;

    //pregunto si el texto del elemento de la lista contiene el texto ingresado por el usuario
    //usando indexOf. si indexOf no encuentra un match, devuelve -1, asi que
    //cuando el resultado sea distinto a -1, significa que hay match, y el elemento queda visible
    //caso contrario, se oculta.
    if (item.toLowerCase().indexOf(textoFiltro) != -1) {
      tarea.style.display = "block";
    } else {
      tarea.style.display = "none";
    }
  });
}
