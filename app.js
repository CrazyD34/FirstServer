import path from "path";
import { promises as fs } from "fs";


export default (async (req, res) => {
    // Desestructurando de "req" o request
    //es una "propiedad del request"
    let { url, method } = req;
    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);


    // Enrutando peticiones
    //Peticion raiz
    switch (url) {
        case '/':
            
            const indexPath = path.join(__dirname, 'index.html');
            try
            {
                const pageData = await fs.readFile(indexPath);
                res.writeHead(200, {'Content-Type:': 'text/html'});
                console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 200;
                res.end(data);
            }
            catch(err)
            {
                console.log("Error 500");
                console.error(err);
            }
        
            break;
        //Peticion Autor
        case '/author':
            res.setHeader('Content-Type', 'text/html');
            //
            res.write(``);
            res.statusCode = 200;
            res.end();
            break;

        //Peticion del icono en la pestaña
        case "/favicon.ico":
            // Especificar la ubicación del archivo de icono
            const faviconPath = path.join(__dirname, 'favicon.ico');
            console.log(faviconPath);
            console.log("--");
            try {
                const data = await fs.readFile(faviconPath);
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            } catch (err) {
                console.error(err);
                // Peticion raiz
                // Estableciendo cabeceras
                res.setHeader('Content-Type', 'text/html');
                // Escribiendo la respuesta
                //ERROR 500
                res.write(``);
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                console.log(`Error: 500 ${err.message}`);
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
                    fs.writeFile('message.txt', parsedParams.message);
                });
                //Estableciendo una respuesta
                //El estado 302 es un estado de redireccionamiento
                res.statusCode = 302;
                //Especificando el redireccionamiento
                //Cuando se establece un redireccionamiento el header debe ser Location y el segundo parametro es a donde va.
                res.setHeader('Location', '/');
                // Se termina la conexion y el redireccionamiento
                return res.end();
            }
            //En caso que no exista en endpoint se muestra el error 404 
            else {
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
            //ERROR 404
            res.write(``);
            console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 404;
            // Cerrando la comunicacion
            res.end();
            break;
    }
});