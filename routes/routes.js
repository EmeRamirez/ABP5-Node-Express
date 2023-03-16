import * as fs from "fs";
//Primero importamos el método Router de express
import { Router } from "express";

const router = Router();  //lo asignamos a una constante



router.get("/" , (req,res)=>{

    fs.readFile('db.json' , (err,data) => {
        if (err) throw console.log('No se puede leer el archivo JSON');
        let menu =JSON.parse(data);
        let menuTitulo = Object.keys(menu);
        menu = Object.values(menu)[0];
        // console.log(menuTitulo,menu);
        res.render("home",{listaplatos:menu , titulomenu:menuTitulo[0]})
    });    
});

router.get("/agregar" , (req,res)=>{  
    res.render("agregar")
});

router.get("/confirmacion" , (req,res)=>{
    //Primero almacenamos los datos extraidos del formulario
    let nombreplato = req.query.nombre.toLowerCase();
    let precioplato = req.query.precio;

    //Asignamos el archivo JSON a una variable (Sync)
    // const file = fs.readFileSync('db.json')

    //Efectuamos la lectura del archivo JSON y dentro de esta función realizamos las siguientes tareas.
    fs.readFile('db.json' , (err,data) => {
        if (err) throw console.log("Error al leer el JSON.");
        const file = data; 
        
            //Ingresamos los datos del formulario al formato requerido por el JSON
            let nuevoPlato = {
                "nombre": `${nombreplato}`,
                "precio": parseInt(precioplato)
            };
            
            let json = JSON.parse(file.toString());
            //Se añade el nuevo objeto creado a la lista de platos del menú del JSON
            json.almuerzos.push(nuevoPlato);
            // console.log(json);
            
            // fs.writeFileSync('db.json',JSON.stringify(json));

            //Finalmente almacenamos el nuevo JSON sobreescribiendo el anterior
            fs.writeFile('db.json',JSON.stringify(json),(err)=>{
                if (err){
                    let mensaje = "Error al sobreescribir el menú.";
                    res.render("confirmacion",{resolucion:mensaje})
                } else {
                    let mensaje = "Se añadió el nuevo plato al menú.";
                    res.render("confirmacion",{resolucion:mensaje})
                }
            })        
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