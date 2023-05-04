//1,. Se importa el Fs como promesa y la ruta, con un dirname que declara una ruta
//Importacion de librerias node
//---Monolito es una seccion larga de codigo, mucho codigo pues.
//--Separacion de responsabilidades es separar el codigo en secciones a traves de archivos.
//Este codigo o index.js inicia el servidor nadamas.
import http from "http";
import path from "path";

//importar el archivo de app
import app from './app.js';

//Bloques globales built-in variables
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);

//request / response
//mainRequestHandler un metodo que recibe request y response
const server = http.createServer(app); 

//El servidor escucha las peticiones en el puerto 3000, la IP default y un callback que muestra en consola
//Que se esta escuchando
server.listen(3000, "0.0.0.0", () => {
  console.log("👩‍🍳 Servidor escuchando en http://localhost:3000"); 
});

//Un redireccionamiento es decirle al frontend enviarme a una pagina del mismo dominio