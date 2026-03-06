/**
 * ══════════════════════════════════════════════════════════════════════════
 * TYPESCRIPT BÁSICO - Web Store con API
 * ══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPTOS ESENCIALES USADOS EN ESTE ARCHIVO:
 * 
 * 1. INTERFACES - Definen la estructura de objetos
 *    interface Product { id: number; title: string; }
 * 
 * 2. ENUM - Conjunto de constantes nombradas
 *    enum LoadingState { Loading = "LOADING" }
 * 
 * 3. ASYNC/AWAIT - Manejar operaciones asíncronas
 *    async function fetchData() { const data = await fetch(url); }
 * 
 * 4. GENERICS - Funciones que trabajan con cualquier tipo
 *    function getElement<T>(selector): T { }
 * 
 * 5. MAP - Estructura de datos clave-valor
 *    const cart = new Map<number, number>();
 * ══════════════════════════════════════════════════════════════════════════
 */

import './style.css';

// ═══ CONFIGURACIÓN ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ CONST vs LET - Declaración de Variables en JavaScript/TypeScript       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ SINTAXIS BÁSICA:                                                        │
 * │   const nombreVariable: tipo = valor;  // No se puede reasignar         │
 * │   let nombreVariable: tipo = valor;    // Se puede reasignar            │
 * │                                                                         │
 * │ CONST (constante):                                                      │
 * │   - Una vez asignado un valor, NO puede cambiar                         │
 * │   - Ideal para valores que nunca cambian (URLs, configuración)          │
 * │   - NOTA: Si es un objeto/array, sus propiedades SÍ pueden cambiar      │
 * │                                                                         │
 * │ LET (variable):                                                         │
 * │   - El valor PUEDE cambiar después de ser asignado                      │
 * │   - Ideal para contadores, estados, valores temporales                  │
 * │                                                                         │
 * │ EJEMPLOS:                                                               │
 * │   const PI = 3.14159;        // Nunca cambiará                          │
 * │   const API = "https://..."; // URL fija                                │
 * │   let contador = 0;          // Cambiará: contador++                    │
 * │   let nombre = "Juan";       // Puede cambiar: nombre = "Pedro"         │
 * │                                                                         │
 * │ ¿CUÁNDO USAR CADA UNO?                                                  │
 * │   - Por defecto, usa CONST                                              │
 * │   - Solo usa LET cuando NECESITES cambiar el valor                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// const API_URL → Usamos const porque esta URL NUNCA cambiará durante la ejecución
// : string → TypeScript infiere el tipo, pero podríamos escribir: const API_URL: string = "..."
const API_URL = "https://api.escuelajs.co/api/v1/products";

// ═══ INTERFACES ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ INTERFACE - Definir la Forma/Estructura de un Objeto                   │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES UNA INTERFACE?                                                  │
 * │   Una interface es como un "contrato" o "molde" que define qué          │
 * │   propiedades debe tener un objeto y de qué tipo son.                   │
 * │   Es como un plano arquitectónico: define la estructura antes de        │
 * │   construir.                                                            │
 * │                                                                         │
 * │ SINTAXIS BÁSICA:                                                        │
 * │   interface NombreInterface {                                           │
 * │     propiedad1: tipo;                                                   │
 * │     propiedad2: tipo;                                                   │
 * │     propiedadOpcional?: tipo;  // El ? indica que es opcional           │
 * │   }                                                                     │
 * │                                                                         │
 * │ TIPOS COMUNES:                                                          │
 * │   - string   → texto ("hola", "mundo")                                  │
 * │   - number   → números (42, 3.14)                                       │
 * │   - boolean  → verdadero/falso (true, false)                            │
 * │   - string[] → array de strings (["a", "b", "c"])                       │
 * │   - number[] → array de números ([1, 2, 3])                             │
 * │   - OtraInterface → una interface dentro de otra                        │
 * │                                                                         │
 * │ ¿POR QUÉ USAR INTERFACES?                                               │
 * │   1. El editor te avisa si olvidas una propiedad                        │
 * │   2. Autocompletado al escribir código                                  │
 * │   3. Detecta errores de tipeo antes de ejecutar                         │
 * │   4. Documenta qué datos espera cada parte del código                   │
 * │                                                                         │
 * │ EJEMPLO SIMPLE:                                                         │
 * │   interface Persona {                                                   │
 * │     nombre: string;                                                     │
 * │     edad: number;                                                       │
 * │     email?: string;  // opcional                                        │
 * │   }                                                                     │
 * │                                                                         │
 * │   const juan: Persona = { nombre: "Juan", edad: 25 }; // ✓ Válido       │
 * │   const pedro: Persona = { nombre: "Pedro" };         // ✗ Falta edad   │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Interface Category: Define la estructura de una categoría de producto
// Esta interface describe los datos que la API nos envía para cada categoría
interface Category {
  id: number;       // Identificador único de la categoría (ej: 1, 2, 3)
  name: string;     // Nombre de la categoría (ej: "Electronics", "Clothes")
  image: string;    // URL de la imagen de la categoría
  slug: string;     // Versión URL-friendly del nombre (ej: "electronics")
}

// Interface Product: Define la estructura completa de un producto
// Nota cómo "category" usa la interface Category definida arriba (interfaces anidadas)
interface Product {
  id: number;           // Identificador único del producto
  title: string;        // Nombre/título del producto
  slug: string;         // URL-friendly del título
  price: number;        // Precio del producto (número, no string)
  description: string;  // Descripción detallada
  category: Category;   // Objeto Category completo (interface anidada)
  images: string[];     // Array de URLs de imágenes (puede tener varias)
}

// ═══ ENUM ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ENUM - Conjunto de Constantes Nombradas                                │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES UN ENUM?                                                        │
 * │   Un enum (enumeration) es un conjunto de valores con nombres.          │
 * │   En lugar de usar strings sueltos como "loading", "error", usamos      │
 * │   valores predefinidos que el editor puede verificar.                   │
 * │                                                                         │
 * │ SINTAXIS BÁSICA:                                                        │
 * │   enum NombreEnum {                                                     │
 * │     Valor1 = "VALOR1",                                                  │
 * │     Valor2 = "VALOR2",                                                  │
 * │     Valor3 = "VALOR3"                                                   │
 * │   }                                                                     │
 * │                                                                         │
 * │ USO:                                                                    │
 * │   const estado = NombreEnum.Valor1;  // Accedemos con punto             │
 * │                                                                         │
 * │ ¿POR QUÉ USAR ENUM EN VEZ DE STRINGS?                                   │
 * │                                                                         │
 * │   SIN ENUM (propenso a errores):                                        │
 * │     if (status === "loadng") { }  // ¡Typo! No hay error                │
 * │     if (status === "LOADING") { } // ¿Mayúsculas? ¿Minúsculas?          │
 * │                                                                         │
 * │   CON ENUM (seguro):                                                    │
 * │     if (status === LoadingState.Loading) { }  // ✓ Autocompletado       │
 * │     if (status === LoadingState.Loadng) { }   // ✗ Error inmediato      │
 * │                                                                         │
 * │ VENTAJAS:                                                               │
 * │   1. Autocompletado: el editor sugiere los valores válidos              │
 * │   2. Refactoring: cambiar un valor lo cambia en todos lados             │
 * │   3. Documentación: sabes todos los valores posibles                    │
 * │   4. Errores en tiempo de compilación, no de ejecución                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Enum LoadingState: Define los 4 estados posibles de carga de datos
// Usamos = "STRING" para que sea legible en console.log y debugging
enum LoadingState {
  Idle = "IDLE",         // Estado inicial: no se ha hecho nada aún
  Loading = "LOADING",   // Cargando: esperando respuesta del servidor
  Success = "SUCCESS",   // Éxito: datos cargados correctamente
  Error = "ERROR"        // Error: algo salió mal
}

// ═══ ESTADO DE LA APLICACIÓN ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ESTADO DE LA APLICACIÓN (Application State)                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES EL ESTADO?                                                      │
 * │   El "estado" son todos los DATOS que tu aplicación necesita recordar  │
 * │   en un momento dado. Es como la "memoria" de tu app.                  │
 * │                                                                         │
 * │ PIENSA EN UN CARRITO DE COMPRAS:                                        │
 * │   - ¿Qué productos hay? → productos[]                                   │
 * │   - ¿Está cargando? → status                                            │
 * │   - ¿Hubo error? → error                                                │
 * │                                                                         │
 * │ ¿POR QUÉ CENTRALIZAR EL ESTADO?                                         │
 * │   En lugar de tener variables sueltas por todo el código:               │
 * │     let productos = [];                                                 │
 * │     let estaCargando = false;                                           │
 * │     let hayError = null;                                                │
 * │                                                                         │
 * │   Las agrupamos en UN SOLO OBJETO:                                      │
 * │     const appState = {                                                  │
 * │       products: [],                                                     │
 * │       status: "idle",                                                   │
 * │       error: null                                                       │
 * │     };                                                                  │
 * │                                                                         │
 * │ VENTAJAS:                                                               │
 * │   1. Todo el estado está en un solo lugar (fácil de encontrar)          │
 * │   2. Fácil de pasar a otras funciones                                   │
 * │   3. Fácil de guardar/restaurar (ej: localStorage)                      │
 * │   4. Base para patrones como Redux, Zustand, etc.                       │
 * │                                                                         │
 * │ FLUJO TÍPICO:                                                           │
 * │   1. Usuario hace clic → status = Loading                               │
 * │   2. Fetch exitoso → status = Success, products = [...]                 │
 * │   3. Fetch falla → status = Error, error = "mensaje"                    │
 * │   4. UI se actualiza según el status actual                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Interface AppState: Define la estructura del estado de nuestra app
interface AppState {
  status: LoadingState;     // Estado actual de carga (usa el enum)
  products: Product[];      // Array de productos (usa interface Product)
  error: string | null;     // Mensaje de error O null si no hay error
  // string | null → "Union Type": puede ser string O null
}

// let appState → Usamos LET porque este valor CAMBIARÁ durante la ejecución
// Inicializamos con valores por defecto (estado inicial de la app)
let appState: AppState = {
  status: LoadingState.Idle,  // Empezamos en estado "inactivo"
  products: [],               // Sin productos al inicio (array vacío)
  error: null                 // Sin errores al inicio
};

// ═══ CARRITO CON MAP ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ MAP - Estructura de Datos Clave-Valor                                  │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES UN MAP?                                                         │
 * │   Un Map es como un diccionario: asocia CLAVES con VALORES.             │
 * │   Cada clave es única y tiene exactamente un valor asociado.            │
 * │                                                                         │
 * │ SINTAXIS BÁSICA:                                                        │
 * │   const miMap = new Map<TipoClave, TipoValor>();                        │
 * │                                                                         │
 * │ MÉTODOS PRINCIPALES:                                                    │
 * │   map.set(clave, valor)  → Agregar o actualizar un par clave-valor      │
 * │   map.get(clave)         → Obtener el valor de una clave (o undefined)  │
 * │   map.has(clave)         → ¿Existe esta clave? (true/false)             │
 * │   map.delete(clave)      → Eliminar un par clave-valor                  │
 * │   map.size               → Cantidad de elementos                        │
 * │   map.values()           → Iterador de todos los valores                │
 * │   map.keys()             → Iterador de todas las claves                 │
 * │                                                                         │
 * │ EJEMPLO PRÁCTICO (CARRITO):                                             │
 * │   const cart = new Map<number, number>();  // productId → cantidad      │
 * │                                                                         │
 * │   cart.set(101, 2);    // Producto 101: 2 unidades                      │
 * │   cart.set(205, 1);    // Producto 205: 1 unidad                        │
 * │   cart.set(101, 3);    // Actualizar: Producto 101 ahora tiene 3        │
 * │                                                                         │
 * │   cart.get(101);       // → 3                                           │
 * │   cart.get(999);       // → undefined (no existe)                       │
 * │   cart.has(205);       // → true                                        │
 * │                                                                         │
 * │ ¿POR QUÉ MAP Y NO UN OBJETO {}?                                         │
 * │   - Las claves pueden ser números (objetos las convierten a string)     │
 * │   - Métodos útiles como .size, .has(), .delete()                        │
 * │   - Mejor rendimiento para agregar/eliminar frecuentemente              │
 * │   - Mantiene el orden de inserción                                      │
 * │                                                                         │
 * │ ITERAR SOBRE UN MAP:                                                    │
 * │   for (const [clave, valor] of miMap) { }                               │
 * │   Array.from(map.values())  → Convertir valores a array                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// cart: Map<number, number> significa:
//   - La CLAVE es number (el ID del producto)
//   - El VALOR es number (la cantidad de ese producto)
// Ejemplo: cart = { 101: 2, 205: 1 } → Producto 101 tiene 2 unidades
const cart: Map<number, number> = new Map();

// ═══ HELPER: OBTENER ELEMENTO DEL DOM ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ HELPER FUNCTION CON GENERICS - Obtener Elementos del DOM               │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES EL DOM?                                                         │
 * │   DOM (Document Object Model) es la representación del HTML como        │
 * │   objetos JavaScript. Cada etiqueta HTML es un "nodo" que podemos       │
 * │   manipular: cambiar texto, estilos, agregar eventos, etc.              │
 * │                                                                         │
 * │ ¿QUÉ HACE document.querySelector?                                       │
 * │   Busca UN elemento en el HTML usando selectores CSS.                   │
 * │   Ejemplo: document.querySelector("#mi-boton") → <button id="mi-boton"> │
 * │                                                                         │
 * │ EL PROBLEMA:                                                            │
 * │   document.querySelector devuelve Element | null                        │
 * │   - Element es muy genérico (no tiene .value, .checked, etc.)           │
 * │   - Puede ser null si el elemento no existe                             │
 * │                                                                         │
 * │ LA SOLUCIÓN - GENERICS <T>:                                             │
 * │   Generics permiten crear funciones que trabajan con CUALQUIER tipo     │
 * │   pero mantienen la seguridad de tipos.                                 │
 * │                                                                         │
 * │ SINTAXIS DE GENERICS:                                                   │
 * │   function nombreFuncion<T>(parametro: tipo): T {                       │
 * │     return algo as T;                                                   │
 * │   }                                                                     │
 * │                                                                         │
 * │ EXPLICACIÓN DE LA FUNCIÓN getElement<T>:                                │
 * │                                                                         │
 * │   function getElement<T extends HTMLElement>(selector: string): T       │
 * │   ─────────────────────────────────────────────────────────────────     │
 * │   │              │                        │                      │      │
 * │   │              │                        │                      │      │
 * │   │    <T extends HTMLElement>            │                      │      │
 * │   │    "T es un tipo que DEBE ser        │                      │      │
 * │   │     HTMLElement o algo más           │                      │      │
 * │   │     específico"                      │                      │      │
 * │   │                                       │                      │      │
 * │   │                              (selector: string)              │      │
 * │   │                              "Recibe un string CSS"          │      │
 * │   │                                                       : T    │      │
 * │   │                                              "Retorna tipo T"       │
 * │                                                                         │
 * │ USO:                                                                    │
 * │   const btn = getElement<HTMLButtonElement>("#mi-btn");                 │
 * │   // btn tiene tipo HTMLButtonElement, con .disabled, .click(), etc.    │
 * │                                                                         │
 * │   const input = getElement<HTMLInputElement>("#mi-input");              │
 * │   // input tiene tipo HTMLInputElement, con .value, .checked, etc.      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función getElement con Generic <T>
// T extends HTMLElement → T debe ser HTMLElement o un tipo más específico
function getElement<T extends HTMLElement>(selector: string): T {
  // document.querySelector<T>(selector) → Busca el elemento y lo tipa como T
  const element = document.querySelector<T>(selector);
  
  // Si no encontramos el elemento, lanzamos un error
  // Esto evita que el código siga ejecutándose con null
  if (!element) {
    throw new Error(`Elemento no encontrado: ${selector}`);
  }
  
  // Retornamos el elemento ya tipado como T
  return element;
}

// ═══ FETCH: OBTENER PRODUCTOS DE LA API ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ FETCH API - Obtener Datos de un Servidor                               │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES FETCH?                                                          │
 * │   fetch() es una función nativa del navegador para hacer peticiones     │
 * │   HTTP (GET, POST, PUT, DELETE) a servidores remotos (APIs).            │
 * │                                                                         │
 * │ SINTAXIS BÁSICA:                                                        │
 * │   const response = await fetch(url);                                    │
 * │   const data = await response.json();                                   │
 * │                                                                         │
 * │ ¿QUÉ ES UNA PROMISE?                                                    │
 * │   Una Promise es un "vale" por un valor futuro. Como cuando pides       │
 * │   comida: te dan un ticket (Promise) y luego recibes la comida (valor). │
 * │                                                                         │
 * │ ¿QUÉ ES ASYNC/AWAIT?                                                    │
 * │   - async → Marca una función como asíncrona (puede esperar)            │
 * │   - await → "Espera aquí hasta que la Promise se resuelva"              │
 * │                                                                         │
 * │ SINTAXIS ASYNC/AWAIT:                                                   │
 * │   async function obtenerDatos(): Promise<TipoRetorno> {                 │
 * │     const resultado = await operacionAsincrona();                       │
 * │     return resultado;                                                   │
 * │   }                                                                     │
 * │                                                                         │
 * │ FLUJO DE FETCH:                                                         │
 * │                                                                         │
 * │   Tu App                API Server                                      │
 * │     │                      │                                            │
 * │     │──── fetch(url) ─────>│  1. Enviamos petición                      │
 * │     │      (await)         │  2. Esperamos...                           │
 * │     │<──── Response ───────│  3. Recibimos respuesta                    │
 * │     │                      │                                            │
 * │     │── response.json() ──>│  4. Parseamos JSON                         │
 * │     │      (await)         │  5. Esperamos...                           │
 * │     │<──── Data[] ─────────│  6. Tenemos los datos!                     │
 * │                                                                         │
 * │ MANEJO DE ERRORES:                                                      │
 * │   - response.ok → true si status es 200-299                             │
 * │   - response.status → código HTTP (200, 404, 500, etc.)                 │
 * │                                                                         │
 * │ CÓDIGOS HTTP COMUNES:                                                   │
 * │   200 → OK (éxito)                                                      │
 * │   404 → Not Found (recurso no existe)                                   │
 * │   500 → Internal Server Error (error del servidor)                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// async function → Esta función es asíncrona (puede usar await)
// Promise<Product[]> → Promete retornar un array de Products
// limit: number = 20 → Parámetro con valor por defecto
async function fetchProducts(limit: number = 20): Promise<Product[]> {
  // Template literal: construimos la URL con el límite
  const url = `${API_URL}?limit=${limit}`;
  console.log(`Fetching: ${url}`);
  
  // await fetch(url) → Esperamos a que el servidor responda
  // response es de tipo Response (objeto con metadata + métodos)
  const response = await fetch(url);
  
  // Verificar si la respuesta fue exitosa (status 200-299)
  if (!response.ok) {
    // Si no fue exitosa, lanzamos un error con el código HTTP
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  // await response.json() → Esperamos y parseamos el JSON
  // as Product[] → Le decimos a TypeScript que el JSON es un array de Products
  const data = await response.json() as Product[];
  console.log(`Productos recibidos: ${data.length}`);
  
  // Retornamos los productos
  return data;
}

// ═══ CREAR HTML DE PRODUCTO ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TEMPLATE LITERALS - Crear HTML Dinámico                                │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ SON TEMPLATE LITERALS?                                             │
 * │   Son strings especiales con comillas invertidas ` ` que permiten:      │
 * │   - Múltiples líneas sin concatenar                                     │
 * │   - Insertar variables con ${variable}                                  │
 * │   - Insertar expresiones con ${expresion}                               │
 * │                                                                         │
 * │ SINTAXIS:                                                               │
 * │   const nombre = "Juan";                                                │
 * │   const saludo = `Hola, ${nombre}!`;  // → "Hola, Juan!"                │
 * │   const suma = `2 + 2 = ${2 + 2}`;    // → "2 + 2 = 4"                  │
 * │                                                                         │
 * │ PARA HTML:                                                              │
 * │   const html = `                                                        │
 * │     <div class="card">                                                  │
 * │       <h1>${titulo}</h1>                                                │
 * │       <p>${descripcion}</p>                                             │
 * │     </div>                                                              │
 * │   `;                                                                    │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que recibe un Product y retorna un string de HTML
function createProductCardHTML(product: Product): string {
  // toLocaleString formatea el número como moneda mexicana
  // { style: 'currency', currency: 'MXN' } → Formato: $1,234.00
  const formattedPrice = product.price.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
  });
  
  // Obtener la primera imagen, o una imagen placeholder si no hay
  // product.images[0] || 'fallback' → Si [0] es undefined/null, usa el fallback
  const imageUrl = product.images[0] || 'https://placehold.co/400x300?text=Sin+imagen';
  
  // Limpiar caracteres extraños que a veces vienen en las URLs de la API
  // .replace(/["\[\]]/g, '') → Elimina ", [ y ] de la URL
  const cleanImageUrl = imageUrl.replace(/["\[\]]/g, '');
  
  // Retornamos el HTML usando template literal
  // data-product-id="${product.id}" → Guardamos el ID en el HTML para usarlo después
  return `
    <article class="product-card" data-product-id="${product.id}">
      <figure class="product-card__figure">
        <img 
          src="${cleanImageUrl}" 
          alt="${product.title}"
          class="product-card__image"
          loading="lazy"
          onerror="this.src='https://placehold.co/400x300?text=Error'"
        />
      </figure>
      <div class="product-card__content">
        <span class="product-card__category">${product.category.name}</span>
        <h3 class="product-card__title" title="${product.title}">${product.title}</h3>
        <p class="product-card__price">
          ${formattedPrice}
          <span class="product-card__shipping">Envío gratis</span>
        </p>
        <button type="button" class="product-card__btn" data-action="add-to-cart">
          Agregar al carrito
        </button>
      </div>
    </article>
  `;
}

// ═══ ACTUALIZAR UI SEGÚN ESTADO ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SWITCH STATEMENT - Manejar Múltiples Casos                             │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES SWITCH?                                                         │
 * │   Switch es como varios if-else, pero más limpio cuando comparas       │
 * │   una variable contra múltiples valores posibles.                       │
 * │                                                                         │
 * │ SINTAXIS:                                                               │
 * │   switch (variable) {                                                   │
 * │     case valor1:                                                        │
 * │       // código si variable === valor1                                  │
 * │       break;  // ¡Importante! Sin break, sigue al siguiente case        │
 * │     case valor2:                                                        │
 * │       // código si variable === valor2                                  │
 * │       break;                                                            │
 * │     default:                                                            │
 * │       // código si no coincide con ninguno                              │
 * │   }                                                                     │
 * │                                                                         │
 * │ CON ENUM ES MUY ÚTIL:                                                   │
 * │   switch (status) {                                                     │
 * │     case LoadingState.Loading: mostrarSpinner(); break;                 │
 * │     case LoadingState.Success: mostrarDatos(); break;                   │
 * │     case LoadingState.Error: mostrarError(); break;                     │
 * │   }                                                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que actualiza toda la UI según el estado actual
// : void → No retorna nada (solo produce efectos secundarios)
function updateUI(): void {
  // Obtenemos referencias a los elementos del DOM que vamos a manipular
  const grid = getElement<HTMLDivElement>("#products-grid");       // Contenedor de productos
  const loading = getElement<HTMLDivElement>("#products-loading"); // Spinner de carga
  const error = getElement<HTMLDivElement>("#products-error");     // Mensaje de error
  const loadBtn = getElement<HTMLButtonElement>("#load-products-btn"); // Botón de cargar
  
  // Por defecto, ocultamos loading y error
  // .hidden es una propiedad que oculta/muestra elementos
  loading.hidden = true;
  error.hidden = true;
  
  // Switch según el estado actual de la aplicación
  switch (appState.status) {
    // ESTADO IDLE: Esperando que el usuario haga algo
    case LoadingState.Idle:
      // Mostramos mensaje inicial
      grid.innerHTML = `<p class="products__empty-state">Haz clic en "Cargar Productos" para ver el catálogo</p>`;
      loadBtn.disabled = false;          // Botón habilitado
      loadBtn.textContent = "Cargar Productos";  // Texto del botón
      break;  // ¡No olvides el break!
      
    // ESTADO LOADING: Cargando datos del servidor
    case LoadingState.Loading:
      grid.innerHTML = '';               // Limpiamos el grid
      loading.hidden = false;            // Mostramos el spinner
      loadBtn.disabled = true;           // Deshabilitamos el botón
      loadBtn.textContent = "Cargando...";
      break;
      
    // ESTADO SUCCESS: Datos cargados correctamente
    case LoadingState.Success:
      renderProducts();                  // Renderizamos los productos
      loadBtn.disabled = false;
      loadBtn.textContent = "Recargar Productos";
      break;
      
    // ESTADO ERROR: Algo salió mal
    case LoadingState.Error:
      grid.innerHTML = '';               // Limpiamos el grid
      error.hidden = false;              // Mostramos el contenedor de error
      // Buscamos el elemento donde mostrar el mensaje de error
      const errorMessage = error.querySelector(".products__error-message");
      if (errorMessage) {
        // Mostramos el mensaje de error del estado, o uno genérico
        errorMessage.textContent = appState.error || "Error desconocido";
      }
      loadBtn.disabled = false;
      loadBtn.textContent = "Reintentar";
      break;
  }
}

// ═══ RENDERIZAR PRODUCTOS ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ARRAY METHODS - map() y join()                                         │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES .map()?                                                         │
 * │   Transforma CADA elemento de un array y retorna un NUEVO array.        │
 * │   No modifica el array original.                                        │
 * │                                                                         │
 * │ SINTAXIS DE MAP:                                                        │
 * │   const nuevo = array.map(elemento => transformacion(elemento));        │
 * │                                                                         │
 * │ EJEMPLO:                                                                │
 * │   const numeros = [1, 2, 3];                                            │
 * │   const dobles = numeros.map(n => n * 2);  // → [2, 4, 6]               │
 * │                                                                         │
 * │   const nombres = ["ana", "luis"];                                      │
 * │   const mayus = nombres.map(n => n.toUpperCase()); // → ["ANA", "LUIS"] │
 * │                                                                         │
 * │ ¿QUÉ ES .join()?                                                        │
 * │   Une todos los elementos de un array en UN string.                     │
 * │   Puedes especificar el separador (por defecto es coma).                │
 * │                                                                         │
 * │ SINTAXIS DE JOIN:                                                       │
 * │   const string = array.join(separador);                                 │
 * │                                                                         │
 * │ EJEMPLOS:                                                               │
 * │   ["a", "b", "c"].join("")    // → "abc"                                │
 * │   ["a", "b", "c"].join("-")   // → "a-b-c"                              │
 * │   ["a", "b", "c"].join(", ")  // → "a, b, c"                            │
 * │                                                                         │
 * │ COMBINADOS PARA RENDERIZAR:                                             │
 * │   products                                                              │
 * │     .map(p => crearHTML(p))   // → ["<div>A</div>", "<div>B</div>"]     │
 * │     .join('')                 // → "<div>A</div><div>B</div>"           │
 * │                                                                         │
 * │ ARROW FUNCTIONS (FUNCIONES FLECHA):                                     │
 * │   product => createProductCardHTML(product)                             │
 * │   ───────────────────────────────────────────                           │
 * │   │                │                                                    │
 * │   parámetro    lo que retorna                                           │
 * │                                                                         │
 * │   Es equivalente a:                                                     │
 * │   function(product) { return createProductCardHTML(product); }          │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que renderiza todos los productos en el grid
function renderProducts(): void {
  // Obtenemos el contenedor donde mostraremos los productos
  const grid = getElement<HTMLDivElement>("#products-grid");
  
  // Si no hay productos, mostramos un mensaje
  if (appState.products.length === 0) {
    grid.innerHTML = `<p class="products__empty-state">No se encontraron productos</p>`;
    return;  // Salimos de la función (no hay nada más que hacer)
  }
  
  // MAGIA: Transformamos el array de productos en HTML
  // 1. .map(product => createProductCardHTML(product))
  //    → Convierte cada Product en un string HTML
  //    → Resultado: ["<article>...</article>", "<article>...</article>", ...]
  // 2. .join('')
  //    → Une todos los strings en uno solo (sin separador)
  //    → Resultado: "<article>...</article><article>...</article>..."
  grid.innerHTML = appState.products
    .map(product => createProductCardHTML(product))
    .join('');
  
  // Después de insertar el HTML, configuramos los event listeners
  setupAddToCartButtons();
}

// ═══ EVENT DELEGATION PARA CARRITO ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ EVENT DELEGATION - Un Solo Listener para Muchos Elementos              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ EL PROBLEMA:                                                            │
 * │   Si tienes 100 productos, ¿pondrías 100 addEventListener?              │
 * │   Eso es ineficiente y problemático cuando el HTML cambia.              │
 * │                                                                         │
 * │ LA SOLUCIÓN - EVENT DELEGATION:                                         │
 * │   Ponemos UN solo listener en el contenedor padre, y cuando algo        │
 * │   dentro de él es clickeado, el evento "burbujea" hacia arriba.         │
 * │                                                                         │
 * │   <div id="grid">                    ← Listener aquí                    │
 * │     <article>                                                           │
 * │       <button>Agregar</button>       ← Click aquí                       │
 * │     </article>                                                          │
 * │     <article>                                                           │
 * │       <button>Agregar</button>                                          │
 * │     </article>                                                          │
 * │   </div>                                                                │
 * │                                                                         │
 * │   El click en el botón "burbujea" hasta #grid donde lo capturamos.      │
 * │                                                                         │
 * │ CÓMO FUNCIONA:                                                          │
 * │   1. Usuario hace clic en un botón                                      │
 * │   2. event.target = el elemento exacto donde se hizo clic               │
 * │   3. .closest(selector) busca hacia arriba hasta encontrar el selector  │
 * │   4. Si encontramos el botón correcto, ejecutamos la acción             │
 * │                                                                         │
 * │ VENTAJAS:                                                               │
 * │   - UN solo listener, no importa cuántos productos haya                 │
 * │   - Funciona con productos agregados dinámicamente (después del render) │
 * │   - Mejor rendimiento (menos listeners = menos memoria)                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que configura el event listener para todos los botones de carrito
function setupAddToCartButtons(): void {
  // Obtenemos el contenedor padre (el grid de productos)
  const grid = getElement<HTMLDivElement>("#products-grid");
  
  // Agregamos UN solo listener de click al contenedor
  // event: MouseEvent → TypeScript sabe que es un evento de ratón
  grid.addEventListener('click', (event: MouseEvent) => {
    // event.target es el elemento exacto donde se hizo clic
    // Lo convertimos a HTMLElement para acceder a sus métodos
    const target = event.target as HTMLElement;
    
    // .closest() busca hacia arriba en el DOM hasta encontrar un elemento
    // que coincida con el selector. Retorna null si no encuentra.
    // Buscamos un elemento con data-action="add-to-cart"
    const button = target.closest('[data-action="add-to-cart"]');
    
    // Si no encontramos el botón, el clic fue en otro lugar; salimos
    if (!button) return;
    
    // Buscamos la tarjeta de producto padre para obtener el ID
    // .closest('.product-card') sube hasta encontrar la tarjeta
    const card = button.closest('.product-card') as HTMLElement;
    if (!card) return;
    
    // dataset.productId accede al atributo data-product-id del HTML
    // <article data-product-id="123"> → card.dataset.productId = "123"
    const productId = card.dataset.productId;
    if (productId) {
      // parseInt convierte el string "123" a número 123
      // El segundo parámetro 10 indica base decimal
      addToCart(parseInt(productId, 10));
    }
  });
}

// ═══ AGREGAR AL CARRITO ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ USANDO EL MAP - Operaciones de Carrito                                 │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ RECORDATORIO DE MÉTODOS DEL MAP:                                        │
 * │   cart.get(productId)  → Obtiene la cantidad (o undefined si no existe)│
 * │   cart.set(productId, cantidad) → Establece la cantidad                │
 * │                                                                         │
 * │ LÓGICA PARA AGREGAR:                                                    │
 * │   1. Obtener cantidad actual (o 0 si no existe)                         │
 * │   2. Sumar 1 a la cantidad                                              │
 * │   3. Guardar la nueva cantidad                                          │
 * │                                                                         │
 * │ FIND EN ARRAYS:                                                         │
 * │   .find() busca el PRIMER elemento que cumple una condición             │
 * │   products.find(p => p.id === 5)  // → El producto con id 5 (o undefined)│
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que agrega un producto al carrito
function addToCart(productId: number): void {
  // Obtenemos la cantidad actual del producto en el carrito
  // Si no existe, cart.get() retorna undefined, y || 0 lo convierte a 0
  const currentQuantity = cart.get(productId) || 0;
  
  // Establecemos la nueva cantidad (actual + 1)
  cart.set(productId, currentQuantity + 1);
  
  // Actualizamos el contador visual del carrito
  updateCartCount();
  
  // Buscamos el producto en el array para mostrar su nombre
  // .find(p => p.id === productId) busca el producto con ese ID
  const product = appState.products.find(p => p.id === productId);
  if (product) {
    // Mostramos una notificación con el nombre del producto
    showNotification(`"${product.title}" agregado al carrito`);
  }
}

// ═══ ACTUALIZAR CONTADOR DEL CARRITO ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ REDUCE - Reducir un Array a un Solo Valor                              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES .reduce()?                                                      │
 * │   Toma todos los elementos de un array y los "reduce" a un solo valor. │
 * │   Útil para sumar, calcular promedios, concatenar, etc.                │
 * │                                                                         │
 * │ SINTAXIS:                                                               │
 * │   array.reduce((acumulador, elementoActual) => {                        │
 * │     return nuevoAcumulador;                                             │
 * │   }, valorInicial);                                                     │
 * │                                                                         │
 * │ EJEMPLO - SUMAR NÚMEROS:                                                │
 * │   [1, 2, 3, 4].reduce((suma, num) => suma + num, 0);                    │
 * │                                                                         │
 * │   Iteración 1: suma=0, num=1 → retorna 1                                │
 * │   Iteración 2: suma=1, num=2 → retorna 3                                │
 * │   Iteración 3: suma=3, num=3 → retorna 6                                │
 * │   Iteración 4: suma=6, num=4 → retorna 10                               │
 * │   Resultado final: 10                                                   │
 * │                                                                         │
 * │ ARRAY.FROM() + MAP.VALUES():                                            │
 * │   cart.values() → Iterador de los valores del Map                       │
 * │   Array.from() → Convierte el iterador en un array                      │
 * │   Array.from(cart.values()) → [2, 1, 3] (las cantidades)                │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que actualiza el número del badge del carrito
function updateCartCount(): void {
  // 1. cart.values() → Iterador de cantidades [2, 1, 3]
  // 2. Array.from() → Convierte a array real
  // 3. .reduce() → Suma todas las cantidades
  const totalItems = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
  
  // Buscamos el elemento con data-cart-count (el badge del carrito)
  const cartLink = document.querySelector('[data-cart-count]');
  
  if (cartLink) {
    // setAttribute cambia el valor del atributo data-cart-count
    // Esto permite que CSS muestre el número con ::after { content: attr(data-cart-count) }
    cartLink.setAttribute('data-cart-count', totalItems.toString());
  }
}

// ═══ MOSTRAR NOTIFICACIÓN ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ CREAR ELEMENTOS DINÁMICAMENTE                                          │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ document.createElement('div') → Crea un nuevo elemento                  │
 * │ element.style.cssText → Asigna múltiples estilos CSS de una vez         │
 * │ document.body.appendChild(element) → Agrega al final del body           │
 * │ element.remove() → Elimina el elemento del DOM                          │
 * │                                                                         │
 * │ SETTIMEOUT:                                                             │
 * │   setTimeout(función, milisegundos)                                     │
 * │   Ejecuta una función DESPUÉS de los milisegundos especificados         │
 * │   setTimeout(() => console.log("Hola"), 3000) → "Hola" después de 3s    │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que muestra una notificación temporal
// duration: number = 3000 → Valor por defecto de 3 segundos
function showNotification(message: string, duration: number = 3000): void {
  // Creamos un nuevo div para la notificación
  const notification = document.createElement('div');
  
  // Aplicamos estilos directo al elemento
  // cssText permite asignar múltiples propiedades CSS de una vez
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: #333;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  // Establecemos el texto de la notificación
  notification.textContent = message;
  
  // Agregamos la notificación al final del body
  document.body.appendChild(notification);
  
  // Después de 'duration' milisegundos, removemos la notificación
  setTimeout(() => {
    // Primero cambiamos la animación para que salga suavemente
    notification.style.animation = 'slideOut 0.3s ease';
    // Después de la animación (300ms), removemos el elemento del DOM
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// Estilos de animación para notificaciones
// Creamos un elemento <style> y lo agregamos al <head>
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// ═══ CARGAR PRODUCTOS ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TRY/CATCH - Manejo de Errores                                          │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ ¿QUÉ ES TRY/CATCH?                                                      │
 * │   Permite "atrapar" errores sin que el programa se detenga.             │
 * │   Si algo falla en try, el código salta a catch.                        │
 * │                                                                         │
 * │ SINTAXIS:                                                               │
 * │   try {                                                                 │
 * │     // Código que PODRÍA fallar                                         │
 * │     const data = await fetch(url);                                      │
 * │   } catch (error) {                                                     │
 * │     // Código que se ejecuta SI hay error                               │
 * │     console.error("Falló:", error);                                     │
 * │   }                                                                     │
 * │                                                                         │
 * │ INSTANCEOF:                                                             │
 * │   error instanceof Error → ¿Es 'error' una instancia de la clase Error? │
 * │   Si es true, podemos acceder a error.message                           │
 * │                                                                         │
 * │ ¿CUÁNDO USAR TRY/CATCH?                                                 │
 * │   - Llamadas a APIs (fetch puede fallar por red, servidor, etc.)        │
 * │   - Parseo de JSON (el texto podría no ser JSON válido)                 │
 * │   - Acceso a recursos externos (archivos, bases de datos)               │
 * │   - Cualquier operación que pueda fallar impredeciblemente              │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función asíncrona que carga los productos desde la API
async function loadProducts(): Promise<void> {
  // 1. Actualizamos el estado a "cargando"
  appState.status = LoadingState.Loading;
  appState.error = null;  // Limpiamos cualquier error anterior
  updateUI();  // Reflejamos el cambio en la UI (muestra spinner)
  
  // 2. Intentamos cargar los productos (puede fallar)
  try {
    // await espera a que fetchProducts termine
    const products = await fetchProducts(20);
    
    // Si llegamos aquí, la carga fue exitosa
    appState.status = LoadingState.Success;
    appState.products = products;
    
  } catch (error) {
    // Si algo falla (red, servidor, etc.), llegamos aquí
    
    // Verificamos si 'error' es una instancia de Error para acceder a .message
    // Si no es Error (podría ser un string u otra cosa), usamos un mensaje genérico
    appState.error = error instanceof Error ? error.message : "Error desconocido";
    appState.status = LoadingState.Error;
    
    // Logueamos el error en consola para debugging
    console.error("Error al cargar productos:", error);
  }
  
  // 3. Actualizamos la UI (sea éxito o error)
  updateUI();
}

// ═══ CONFIGURAR EVENT LISTENERS ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ EVENT LISTENERS - Escuchar Acciones del Usuario                        │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ SINTAXIS:                                                               │
 * │   elemento.addEventListener('evento', función);                         │
 * │                                                                         │
 * │ EVENTOS COMUNES:                                                        │
 * │   'click'    → Cuando se hace clic                                      │
 * │   'submit'   → Cuando se envía un formulario                            │
 * │   'input'    → Cuando cambia el valor de un input                       │
 * │   'keydown'  → Cuando se presiona una tecla                             │
 * │   'load'     → Cuando algo termina de cargar                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que configura todos los event listeners de la aplicación
function setupEventListeners(): void {
  // Event listener para el botón principal de cargar productos
  const loadBtn = getElement<HTMLButtonElement>("#load-products-btn");
  // Cuando se haga clic, ejecutar loadProducts
  loadBtn.addEventListener('click', loadProducts);
  
  // Event listener para el botón de reintentar en caso de error
  // Usamos querySelector normal porque este elemento es opcional
  const retryBtn = document.querySelector("#retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener('click', loadProducts);
  }
}

// ═══ INICIALIZAR APLICACIÓN ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ FUNCIÓN DE INICIALIZACIÓN                                              │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ Es una buena práctica tener una función que:                            │
 * │   1. Configure todos los event listeners                                │
 * │   2. Establezca el estado inicial de la UI                              │
 * │   3. Opcionalmente, cargue datos iniciales                              │
 * │                                                                         │
 * │ Esto mantiene el código organizado y fácil de entender.                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Función que inicializa toda la aplicación
function initApp(): void {
  console.log("🚀 Inicializando ML Store...");
  
  // 1. Configuramos los event listeners
  setupEventListeners();
  
  // 2. Actualizamos la UI al estado inicial (Idle)
  updateUI();
  
  console.log("✅ ML Store lista");
}

// ═══ PUNTO DE ENTRADA ═══
/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ DOMCONTENTLOADED - Esperar a que el HTML esté Listo                    │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ EL PROBLEMA:                                                            │
 * │   El JavaScript puede ejecutarse ANTES de que el HTML esté listo.       │
 * │   Si buscamos un elemento que aún no existe, obtenemos null.            │
 * │                                                                         │
 * │ LA SOLUCIÓN:                                                            │
 * │   Esperar al evento 'DOMContentLoaded' que se dispara cuando            │
 * │   todo el HTML ha sido parseado (pero no necesariamente las imágenes).  │
 * │                                                                         │
 * │ document.readyState:                                                    │
 * │   'loading'     → El documento se está cargando                         │
 * │   'interactive' → El HTML está parseado, recursos cargando              │
 * │   'complete'    → Todo completamente cargado                            │
 * │                                                                         │
 * │ PATRÓN COMÚN:                                                           │
 * │   if (document.readyState === 'loading') {                              │
 * │     // Aún cargando, esperamos al evento                                │
 * │     document.addEventListener('DOMContentLoaded', init);                │
 * │   } else {                                                              │
 * │     // Ya está listo, ejecutamos directamente                           │
 * │     init();                                                             │
 * │   }                                                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// Verificamos el estado del documento
if (document.readyState === 'loading') {
  // El DOM aún se está cargando, esperamos al evento
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // El DOM ya está listo (el script se cargó con defer o al final del body)
  initApp();
}
