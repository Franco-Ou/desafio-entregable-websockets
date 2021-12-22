const fs = require('fs');

class Contenedor {
    constructor(fileName) {
        this.file = fileName;
        this.productList = [];
        this.counterID = 0;
    }

    async save(object) {
        //Aumento el contador
        this.counterID++;

        //Agrego una key id con ese id como value
        object["id"] = this.counterID

        //Agrego el objeto al array de productos
        this.productList.push(object)

        //Obtengo el archivo con la información actualizada
        await this.write()

        //Devuelvo el ID del nuevo objeto guardado
        return object;
    }

    async updateById(id, object) {

        //Busco el index del objeto según su id
        const foundIndex = this.productList.findIndex(product => product.id == id);
        
        //Reemplazo en el index por el nuevo objeto
        object.id = id;
        this.productList[foundIndex] = object;

        //Obtengo el archivo con la información actualizada
        await this.write()

        //Devuelvo el objeto
        return object;
    }

    async deleteById(id) {
        //Filtro el array de productos para eliminar aquel que tiene el id pasado por parámetro
        this.productList = this.productList.filter(element => element.id != id)
        await this.write()
    }
    
    async deleteAll() {
        //Al darle un length de 0 al array, elimino todos los objetos guardados en él
            while(this.productList.length > 0) {
                this.productList.pop();
            }
            await this.write();
    }

    async write() {
        //Guardo el array de productos como string
        let string = JSON.stringify(this.productList)

        //Guardo el archivo añadiéndole el string anterior
        await fs.promises.writeFile(this.file, string)
    }

    getById(id) {
        return this.productList.find(product => product.id === id);
    }

    getAll() {
        //Devuelvo el array de productos
        return this.productList
    }

    async initializer() {
        try {
            //Leo el archivo con readFile, viene como string
            let stringData = await fs.promises.readFile(this.file)

            //Parseo ese string a json para que el array de productos tome su valor
            this.productList = JSON.parse(stringData)

            //Cada vez que genero un nuevo objeto, actualizo el contador para que valga lo mismo que el id del último objeto guardado
            for (const object of this.productList) {
                if (object.id > this.counterID) this.counterID = object.id
            }

        } catch (error) {
            console.log("Creando el archivo");
        }
    }
}


module.exports = Contenedor;