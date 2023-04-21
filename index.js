//1.-Importando el modulo de node http
//import 'nombre de variable' from 
//Los unicos que no tengo que instalar son los que son parte de node
import http from 'http';

//2.- Crear el servidor
//Se crea una variable donde se guarde el servidor
const server = http.createServer( (request,response) => {
    //Toda la logica del servidor
    //1.-Respondiendo al cliente
    response._write("Hello from the server 🎉");
    //2.-Cerrar la conexion
    response.end();
} );

//3.- Arrancando el servidor
//en listen(<Puerto>,<IP>,<callback>)
server.listen(3000,"0.0.0.0",() =>{
    console.log("🙉Servidor escuchando en http://localhost:3000");
});