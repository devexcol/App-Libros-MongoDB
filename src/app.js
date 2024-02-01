//Se debe requiere el paquete de  mongoose para poder empezar a utilziarlo
const mongoose = require("mongoose");
//Se requiere el paqute de dotenv para poder acceder a el.
//No se guarda directamente en una varible, si no que se configura para poder acceder a el
require("dotenv").config();//Ya queda configurado dotenv para crear y utilizar  las variables de entorno.
//Se requiere el paquete de express para poder utilizar sus funcionalidades
const express = require("express");
//Se ejectua express para poder empezar a usarlo.
const app = express();
//Use nos permite pasarle middlewares, crear las rutas entre otras.
app.use(express.json());

//Se llama la conexion a la url o varible de entorno
const mongoUri = process.env.MONGODB_URI;

//Se crea la conexion a esa base de datos con mongoose.
//Se necesita la uri y un objeto que conetiene la configuración para esa conexion.
mongoose.connect(mongoUri, {
   
}).then(()=>{//Debido a que es una promesa se debe usar el then y catch
    console.log("Conectado a MongoDB")
}).catch((error)=>{
    console.error("Error al conectar a mongoDB",error)
})

//Se utilizará la conexión a MongoDB para empezar a hacer las solicitudes
const db = mongoose.connection;

//Se crea une evnto de escucha de error para que identifique si hay algun error
db.on("error", console.error.bind(console, "Error de conexión"));

//Se debe abrir la conexión una vez y debe quedar establecida exitosamente
db.once("Open", ()=>{
    console.log("Conectado a MongoDB");
})

//Se crea el schema o estrucutra para poder guardar los datos o documentos en la colección.
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String
});

//Ahora se crea un modelo que utiliza el esquema, el cual nos permite hacer el CRUD

const Libro = mongoose.model("Libro", libroSchema);

//Espress nos permite crear diferentes tipos de rutas dependiendo de la necesidad
//Por medio de app tambien podemos generar peticiones por medio de HTTP
app.get("/",(req, res)=>{
    res.send("Bienvenidos a la aplicación de libros")
});

//Ruta que nos permite devolver los libros
app.get("/libros", async(req, res)=>{
    try{
        const libros = await Libro.find();
        res.json(libros)
    }catch{
        res.status(500).send("Error al obtener Libros");
    }
})

//Ruta que nos permite enviar información
app.post("/libros",async (req, res)=>{
    const libro = new Libro({
        titulo:req.body.titulo,
        autor: req.body.autor
    });
    try{
        await libro.save()
        res.json(libro)
    }catch(error){
        res.status(500).send("Error al guardar libros");
    }
})
//Ruta que nos permite traer el libro por su ID
app.get("/libros/:id", async(req, res)=>{
    try{
        const libro = await Libro.findById(req.params.id);
        if(libro){
            res.json(libro); 
        }else{
            res.status(404).send("Libro no encontrado")
        }
           
    }catch(error){
        res.status(500).send("Error al obtener libro")
    }
    

});

//Actualizar un dato de colección
app.put("/libros/:id",async (req, res)=>{
    try{
        const libro = await Libro.findByIdAndUpdate(req.params.id,
            {titulo: req.body.titulo, autor: req.body.autor},
            {new:true} )
            if(libro){
                res.json(libro);
            }else{
                res.status(404).send("Libro no encontrado")
            }
    }catch(error){
        res.status(500).send("Error al actualizar el libro")
    }
})

//Permite Eliminar un documento de la colección
app.delete("/libros/:id",async (req, res)=>{
    try{
        const libro = await Libro.findByIdAndDelete(req.params.id);
            if(libro){
                res.status(204).send("Libro Elimimnado Correctamente");
            }else{
                res.status(404).send("Libro no encontrado")
            }
    }catch(error){
        res.status(500).send("Error al eliminar el libro")
    }
})

//Ruta que nos permite actualizar un documento especifico 
//Se define cual es la ruta donde va estar escuchando el servidor cuando el cliente hace las peticiones
app.listen(3000, ()=>{
    console.log("Servidor ejecutandose en http://localhost:3000/");
})

