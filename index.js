//1.-Importando el modulo de node http
//import 'nombre de variable' from 
//Los unicos que no tengo que instalar son los que son parte de node
import http from 'http';
//Biblioteca Path para administrador de rutas
import path from 'path';
//let http = require('http');

//4.-Recreando Built-In Variables
//Un ambito es un bloque de codigo, las variables se ejecutaran dentro de un ambito y ya
//Bloque global solo en casos especiales
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);
global["__filename"] = path.join(__dirname, path.basename(new URL(import.meta.url).pathname));


//2.- Crear el servidor
//Se crea una variable donde se guarde el servidor
// cuando no se usa una variable se le pone como nombre o se le pone un _
const server = http.createServer( (request,response) => {
    //Toda la logica del servidor
    //1.-Respondiendo al cliente
    //response._write("Hello from the server 🎉");
    //Variables default
    //En que directorio estoy metodo que response al cliente
    //Creando un logger de peticiones
    console.log(`📢Re;Quest ${request.method} ${request.url}`)
    response.setHeader('Content-Type', 'text/html');
    response.write("<html>");
    response.write("<head> </head>");
    response.write("<title>My App</title>");
    response.write("<body> <h1> Hello from my server... </h1> </body>");
    response.write("</html>");
    console.log(`📢Contestando recurso: ${request.method} ${request.url}`)
    console.log("Cerando la conexion...");
    //2.-Cerrar la conexion
    response.end();
} );

//3.- Arrancando el servidor
//en listen(<Puerto>,<IP>,<callback>)
server.listen(3000,"0.0.0.0",() =>{
    console.log("🙉Servidor escuchando en http://localhost:3000");
});