// const express = require("express");
import express from "express";
const app = express();
import {dirname, join} from "path";
import {fileURLToPath} from "url";

//Importa el endpoint generado desde el .js de rutas (El nombre puede ser cualquiera y se le asignará al endpoint)
import indexRoutes from "./routes/routes.js"

app.listen(3000);

import * as helpers from "./helpers/hbs.js"
import hbs from "hbs";
const __dirname = dirname(fileURLToPath(import.meta.url));
hbs.registerPartials(join(__dirname,"/views/partials"));
app.set('view engine', 'hbs');
app.set('views' , './views');


app.use(express.static("public"));

//Indicamos que express utilizará el siguiente módulo de rutas
app.use(indexRoutes);





