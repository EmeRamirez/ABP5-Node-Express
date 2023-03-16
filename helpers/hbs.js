import hbs from "hbs";

//El método registerHelper nos permite crear Helpers para utilizar al renderizar con hbs

//Este helper convierte la primera letra de cada palabra separada por espacio de un string, en mayúscula
hbs.registerHelper('capitalizar', function (str) {
    let arr = str.split(" ");

    for (let i=0; i < arr.length; i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");

    return str2;
})

//Este helper transforma los valores numéricos en formato CLP
hbs.registerHelper('CLP', function(num){
    const formatoCL = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        useGrouping: true,
    });

    return formatoCL.format(num);
})


