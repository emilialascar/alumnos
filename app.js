// Datos de ejemplo (simulación de base de datos)
const alumnos = [
  {
    id: 1,
    nombre: "Ana Pérez",
    rut: "11.111.111-1",
    curso: "3° Básico A",
    promedio: 6.2,
    apoderado: "María Pérez",
    contactoApoderado: "maria.perez@example.com"
  },
  {
    id: 2,
    nombre: "Diego Soto",
    rut: "22.222.222-2",
    curso: "3° Básico A",
    promedio: 5.8,
    apoderado: "Carlos Soto",
    contactoApoderado: "carlos.soto@example.com"
  },
  {
    id: 3,
    nombre: "Laura Díaz",
    rut: "33.333.333-3",
    curso: "4° Básico B",
    promedio: 6.5,
    apoderado: "Ana Díaz",
    contactoApoderado: "ana.diaz@example.com"
  }
];

const usuarios = [
  {
    email: "admin@colegio.cl",
    password: "1234",
    rol: "admin",
    nombre: "Administrador General"
  },
  {
    email: "profe3A@colegio.cl",
    password: "1234",
    rol: "docente",
    nombre: "Profesor Juan",
    cursos: ["3° Básico A"]
  },
  {
    email: "ana.alumna@colegio.cl",
    password: "1234",
    rol: "alumno",
    nombre: "Ana Pérez",
    alumnoId: 1
  },
  {
    email: "maria.apoderada@colegio.cl",
    password: "1234",
    rol: "apoderado",
    nombre: "María Pérez",
    alumnoId: 1
  }
];

// Referencias al DOM
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const dashboardTitle = document.getElementById("dashboard-title");
const bienvenida = document.getElementById("bienvenida");
const logoutBtn = document.getElementById("logoutBtn");

// Vistas por rol
const adminView = document.getElementById("admin-view");
const docenteView = document.getElementById("docente-view");
const alumnoView = document.getElementById("alumno-view");
const apoderadoView = document.getElementById("apoderado-view");

// Contenedores de datos
const adminAlumnosContainer = document.getElementById("admin-alumnos-container");
const docenteAlumnosContainer = document.getElementById("docente-alumnos-container");
const alumnoInfoContainer = document.getElementById("alumno-info-container");
const apoderadoAlumnoContainer = document.getElementById("apoderado-alumno-container");

// Estado
let usuarioActual = null;

// Manejar login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  const usuario = usuarios.find(
    u => u.email === email && u.password === password && u.rol === rol
  );

  if (!usuario) {
    loginError.textContent = "Datos o rol incorrectos.";
    return;
  }

  usuarioActual = usuario;
  mostrarDashboard();
});

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  usuarioActual = null;
  dashboardSection.classList.add("oculto");
  loginSection.classList.remove("oculto");
  logoutBtn.classList.add("oculto");
  limpiarVistas();
});

// Mostrar dashboard según rol
function mostrarDashboard() {
  if (!usuarioActual) return;

  loginSection.classList.add("oculto");
  dashboardSection.classList.remove("oculto");
  logoutBtn.classList.remove("oculto");

  limpiarVistas();

  const { rol, nombre } = usuarioActual;
  bienvenida.textContent = `Hola, ${nombre}. Has ingresado como ${rol}.`;

  switch (rol) {
    case "admin":
      dashboardTitle.textContent = "Panel Administrador";
      mostrarVistaAdmin();
      break;
    case "docente":
      dashboardTitle.textContent = "Panel Docente";
      mostrarVistaDocente();
      break;
    case "alumno":
      dashboardTitle.textContent = "Panel Alumno";
      mostrarVistaAlumno();
      break;
    case "apoderado":
      dashboardTitle.textContent = "Panel Apoderado";
      mostrarVistaApoderado();
      break;
  }
}

function limpiarVistas() {
  adminView.classList.add("oculto");
  docenteView.classList.add("oculto");
  alumnoView.classList.add("oculto");
  apoderadoView.classList.add("oculto");

  adminAlumnosContainer.innerHTML = "";
  docenteAlumnosContainer.innerHTML = "";
  alumnoInfoContainer.innerHTML = "";
  apoderadoAlumnoContainer.innerHTML = "";
}

// ADMIN: ve todos los alumnos
function mostrarVistaAdmin() {
  adminView.classList.remove("oculto");
  adminAlumnosContainer.appendChild(crearTablaAlumnos(alumnos));
}

// DOCENTE: ve solo alumnos de sus cursos
function mostrarVistaDocente() {
  docenteView.classList.remove("oculto");
  const cursosDocente = usuarioActual.cursos || [];
  const alumnosDocente = alumnos.filter(a => cursosDocente.includes(a.curso));

  if (alumnosDocente.length === 0) {
    docenteAlumnosContainer.textContent = "No hay alumnos asignados.";
  } else {
    docenteAlumnosContainer.appendChild(crearTablaAlumnos(alumnosDocente));
  }
}

// ALUMNO: ve su propia ficha
function mostrarVistaAlumno() {
  alumnoView.classList.remove("oculto");
  const alumnoId = usuarioActual.alumnoId;
  const alumno = alumnos.find(a => a.id === alumnoId);

  if (!alumno) {
    alumnoInfoContainer.textContent = "No se encontró información del alumno.";
    return;
  }

  alumnoInfoContainer.appendChild(crearFichaAlumno(alumno));
}

// APODERADO: ve información del hijo(a)
function mostrarVistaApoderado() {
  apoderadoView.classList.remove("oculto");
  const alumnoId = usuarioActual.alumnoId;
  const alumno = alumnos.find(a => a.id === alumnoId);

  if (!alumno) {
    apoderadoAlumnoContainer.textContent = "No se encontró información del alumno.";
    return;
  }

  apoderadoAlumnoContainer.appendChild(crearFichaAlumno(alumno));
}

// Crea una tabla de alumnos
function crearTablaAlumnos(lista) {
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>RUT</th>
      <th>Curso</th>
      <th>Promedio</th>
      <th>Apoderado</th>
      <th>Contacto</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  lista.forEach(alumno => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${alumno.nombre}</td>
      <td>${alumno.rut}</td>
      <td>${alumno.curso}</td>
      <td>${alumno.promedio}</td>
      <td>${alumno.apoderado}</td>
      <td>${alumno.contactoApoderado}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

// Crea ficha sencilla de un alumno
function crearFichaAlumno(alumno) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p><strong>Nombre:</strong> ${alumno.nombre}</p>
    <p><strong>RUT:</strong> ${alumno.rut}</p>
    <p><strong>Curso:</strong> ${alumno.curso}</p>
    <p><strong>Promedio:</strong> ${alumno.promedio}</p>
    <p><strong>Apoderado:</strong> ${alumno.apoderado}</p>
    <p><strong>Contacto apoderado:</strong> ${alumno.contactoApoderado}</p>
  `;
  return div;
}
