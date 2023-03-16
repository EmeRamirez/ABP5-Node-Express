import * as fs from "fs";
//Primero importamos el método Router de express
import { Router } from "express";
import { escribirArchivo, leerArchivo } from "../functions.js";

const router = Router();  //lo asignamos a una constante

router.get("/" , (req,res)=>{

    leerArchivo()
        .then(data => {
            let menu = data;
            let menuTitulo = Object.keys(menu);
            menu = Object.values(menu)[0];
            res.render("home",{listaplatos:menu , titulomenu:menuTitulo[0]})
        })  
});

router.get("/agregar" , (req,res)=>{  
    res.render("agregar")
});

router.get("/confirmacion" , (req,res)=>{
    //Primero almacenamos los datos extraidos del formulario
    let nombreplato = req.query.nombre.toLowerCase();
    let precioplato = req.query.precio;

    //Se lee el archivo JSON y se almacenan los datos
    leerArchivo()
        .then(data => {
            let json = data;
            
            //Se crea un nuevo objeto con los datos traidos del formulario
            let nuevoPlato = {
                "nombre": `${nombreplato}`,
                "precio": parseInt(precioplato)
            };

            
            //Se verifica si el plato está duplicado en el menú
            let encontrado = json.almuerzos.find(el => el.nombre.toLowerCase() == nuevoPlato.nombre.toLowerCase())
            if (!encontrado) {

            //Se agrega el nuevo objeto al arreglo traido del db.json
            json.almuerzos.push(nuevoPlato);

            //Finalmente sobreescribimos el archivo db.json
            escribirArchivo(json)
                .then(()=> {
                    let mensaje = "Se añadió el nuevo plato al menú.";
                    res.render("confirmacion",{resolucion:mensaje})
                })
                .catch(()=>{
                    let mensaje = "No se pudo añadir el plato al menú. Intente nuevamente.";
                    res.render("confirmacion",{resolucion:mensaje})
                })
            } else {
                let mensaje = "Este plato ya existe en el menú.";
                res.render("confirmacion",{resolucion:mensaje})
            }
        })  
});

router.get("/eliminar" , (req,res)=>{
    res.render("eliminar")
});

router.get("/confirmeliminar" , (req,res)=>{
    //Se almacena el nombre del plato a eliminar desde el formulario
    let nombreplato = req.query.nombre.toLowerCase();
    console.log(nombreplato);

    //Se lee la data del JSON y se almacena en la variable file
    fs.readFile('db.json' , (err,data) => {
        if (err) throw console.log("Error al leer el JSON.");
        const file = data; 
        
        let json = JSON.parse(file.toString());

        //Se busca el nombre ingresado para verificar si existe en el menú
        let encontrado = json.almuerzos.find(el => el.nombre.toLowerCase() == nombreplato);
        //Si se encuentra, se procede a eliminar
        if (json.almuerzos.indexOf(encontrado) != -1){
            json.almuerzos.splice(json.almuerzos.indexOf(encontrado),1);
            
            fs.writeFile('db.json',JSON.stringify(json),(err)=>{
                if (err){
                    let mensaje = "Error al sobreescribir el menú.";
                    res.render("confirmacion",{resolucion:mensaje})
                } else {
                    let mensaje = 'Se ha eliminado un plato del menú.';
                    res.render("confirmeliminar",{resolucion:mensaje});
                }
            })
            //Si no se encuentra se renderiza otro mensaje
        } else {
            let mensaje = 'Ese plato no se encuentra en el menú.';
            res.render("confirmeliminar",{resolucion:mensaje});
        }
    })
});

//Finalmente exportamos el endpoint de router para ser utilizado en otros módulos.
export default router;