const express = require('express');
const app = express();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static('./public/'));
app.use(express.static(__dirname + "/views"));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');

const Contenedor = require("./contenedor.js");
const contenedorDeProductos = new Contenedor("productos.txt");
contenedorDeProductos.initializer();

let counter = 0;

let messages = [];

let products = [];


io.on("connection", (socket) => {
    counter++;
    console.log("New user, number: ", counter);
    socket.emit('messages', messages);
    
    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', [data]) //io.sockets permite que todos los conectados vean el mensaje. socket.emit solo permite a uno verlo.
    })

    socket.on('new-product', data => {
        products.push(data);
        console.log("se pusheó");
        io.sockets.emit('products', [data]) //io.sockets permite que todos los conectados vean el mensaje. socket.emit solo permite a uno verlo.
    })
})

app.get("/", async (req, res) => {
  try {
    const allItems = await contenedorDeProductos.getAll();
    res.render("index", { listaDeProductos: products });
  } catch (error) {
    console.log(error);
  }
});

httpServer.listen(3000, () => {
    console.log("Server running...");
})
