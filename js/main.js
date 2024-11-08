import { GastoCombustible } from '../models/gastoCombustible.js';

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './data/tarifasCombustible.json';
let gastosJSONpath = './data/gastosCombustible.json';

// array asociativo con clave=año y valor=gasto total

let aniosArray = {
    2010: 0,
    2011: 0,
    2012: 0,
    2013: 0,
    2014: 0,
    2015: 0,
    2016: 0,
    2017: 0,
    2018: 0,
    2019: 0,
    2020: 0
}

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);


    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    gastosJSON.map(gasto => {
        let date = new Date(gasto.date);
        let anio = date.getFullYear();
        aniosArray[anio] += gasto.precioViaje;

        document.getElementById(`gasto${anio}`).innerText = aniosArray[anio].toFixed(2);
    })
}

function actualizarGastoTotal(anio, precioViaje) {
   aniosArray[anio] += precioViaje;
   document.getElementById(`gasto${anio}`).innerText = aniosArray[anio].toFixed(2);

   console.log(aniosArray);

}
// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);


    let anio = fecha.getFullYear();

    let tarifa = tarifasJSON.tarifas.find(t => t.anio === anio)

    if (!tarifa) {
        throw new Error(`Tarifa no encontrada para la fecha indicada`);
    }
        
    let tarifaVehiculo = tarifa.vehiculos[tipoVehiculo];
    let precioViaje = tarifaVehiculo * kilometros;
    
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);

    document.getElementById('expense-list').innerHTML += `<li>${nuevoGasto.convertToJSON()}</li>`;

    gastosJSON.push(nuevoGasto);

    actualizarGastoTotal(anio, precioViaje);

    document.getElementById("fuel-form").reset();
}
