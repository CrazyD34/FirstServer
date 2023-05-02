//1,. Se importa el Fs como promesa y la ruta, con un dirname que declara una ruta
//Importacion de librerias node
import http from "http";
import path from "path";
import {promises as fs} from "fs";
//Bloques globales built-in variables
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);

//request / response
const server = http.createServer(async (req, res) => {
  // Desestructurando de "req" o request
  //es una "propiedad del request"
  let { url, method } = req;
  console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);


  // Enrutando peticiones
  //Peticion raiz
  switch (url) {
    case '/':
      // Peticion raiz
      // Estableciendo cabeceras
      res.setHeader('Content-Type','text/html');
      // Escribiendo la respuesta
      res.write(`
      <html>
        <head>
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
          <title>My App</title>
        <style>
          body{
            background-color: #ECF0F1;
            font-family: Arial,sans-serif;
          }
          h1,h2{
            color: #3498DB;
            text-align: center;
            margin-top: 50px;
          }
          form{
            margin-top: 30px;
            text-align:center;
          }
          input[type="text"]
          {
            width: 300px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            box-shadow: 0px 0px 5px #3498DB;
            outline: none;
          }
          button[type="submit"]
          {
            background-color: #3498DB;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding 10px 20px;
            cursor: pointer;
            box-shadow: 0px 0px 5px #3498DB;
            outline: none;
          }
          button[type="submit"]:hover{
            background-color: #2980B9;
          }
        </style>
        </head>
        <body>
        <h1> Hola desde mi servidor</h1>
        <h2> Ingresa un mensaje </h2>
        <div>
          <form action="/message" method="POST">
          <!--Aqui esta el nombre del parametro, este sera utilizado en los demas casos, si el nombre fuera mensaje,
          parsedParams.message pasaria a parsedParams.mensaje-->
          <input type="text" name="message">
          <button type="submit"> Enviar </button>
          </form>
        </div>
        </body>
      </html>
      `);
      console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 200;
      // Cerrando la comunicacion
      res.end();
      break;

    //Peticion Autor
    case '/author':
        res.setHeader('Content-Type', 'text/html');
        //
        res.write(`
        <html>
            <head>
            <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
                <title> About Me </title>
            </head>
                <body>
                <h1 style="color: #333">About me, the author</h1>
                <p style="color #34495E">David Israel Gonzalez Osorio</p>
                <p style="color #34495E">Student of ITGAM</p>
                <p style="color #34495E">Career ITIC's</p>
                <p style="color #34495E">My first server</p>
                </body>
        </html>
        `);
        res.statusCode = 200;
        res.end();
    break;

    //Peticion del icono en la pestaña
    case "/favicon.ico":
      // Especificar la ubicación del archivo de icono
      const faviconPath = path.join(__dirname, 'favicon.ico');
      try{
        const data = await fs.readFile(faviconPath);
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end(data);
      }catch (err) {
        console.error(err);
        // Peticion raiz
        // Estableciendo cabeceras
        res.setHeader('Content-Type', 'text/html');
        // Escribiendo la respuesta
        res.write(`
        <html>
          <head>
            <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
            <title>My App</title>
          </head>
          <body> 
            <h1>&#128534; 500 El server esta fuera de servicio</h1>
            <p>Lo sentimos pero hubo un error en nuestro server...</p>
            <p> ${err.message}</p>
          </body>
        </html>
        `);
        console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
        // Estableciendo codigo de respuesta
        res.statusCode = 500;
        // Cerrando la comunicacion
        res.end();
      }
    break;

    //Peticion mensaje
    //Agregando un BackEnd y un Endpoint para enviar informacion
    case "/message":
      // Verificando si es post
      //La barra de navegacion siempre pide un metodo GET
      if (method === "POST") {
		  // Se crea una variable para almacenar los datos del cliente
      let body = "";
      //--------------
		  // Se registra un manejador de evento para la recepción de datos
      req.on("data", (data => {
      body += data;
      //---Si la informacion supera cierta longitud destruye la conexion.---
      if (body.length > 1e6) return req.socket.destroy();
      }));
      ///------------
		  // Se registra una manejador de eventos para el termino de recepción de datos
      req.on("end", async () => {
      // Procesa el formulario
       //Antes de escribir una respuesta (res.write) hay que establecer el tipo de contenido
			// Mediante URLSearchParams se extraen los campos del formulario
      const params = new URLSearchParams(body);
			// Se construye un objeto a partir de los datos en la variable params
      const parsedParams = Object.fromEntries(params);

      //---Almacenar un valor en un archivo
      //Se utiliza una libreria fs, si no le pongo una ruta absoluta lo va a crear en el lugar donde este el index
      //Espera a que se haga esta peticion, por el async await
      //--Le quitamos el await
      fs.writeFile('message.txt',parsedParams.message);
    });
      //Estableciendo una respuesta
      //El estado 302 es un estado de redireccionamiento
      res.statusCode = 302;
      //Especificando el redireccionamiento
      //Cuando se establece un redireccionamiento el header debe ser Location y el segundo parametro es a donde va.
      res.setHeader('Location','/');
      // Se termina la conexion y el redireccionamiento
      return res.end();
      }
      //En caso que no exista en endpoint se muestra el error 404 
      else 
      {
        res.statusCode = 404;
        res.write("404: Endpoint no encontrado")
        res.end();
      }
      break;

    //Peticion default
    default:
      // Peticion raiz
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html');
      // Escribiendo la respuesta
      res.write(`
      <html>
        <head>
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
          <title>My App</title>
        </head>
        <body> 
          <h1>&#128534; 404 Recurso no encontrado</h1>
          <p>Lo sentimos pero no tenemos lo que buscas...</p>
        </body>
      </html>
      `);
      console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 404;
      // Cerrando la comunicacion
      res.end();
      break;
  }
}); 

//El servidor escucha las peticiones en el puerto 3000, la IP default y un callback que muestra en consola
//Que se esta escuchando
server.listen(3000, "0.0.0.0", () => {
  console.log("👩‍🍳 Servidor escuchando en http://localhost:3000"); 
});

//Un redireccionamiento es decirle al frontend enviarme a una pagina del mismo dominio