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

let messages = [];

let products = [];


io.on("connection", (socket) => {

    socket.emit('messages', messages);
    
    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', [data]) 
    })

    socket.on('new-product', data => {
        products.push(data);
        io.sockets.emit('products', [data]) 
    })
})

app.get("/", async (req, res) => {
  try {
    res.render("index", products);
  } catch (error) {
    console.log(error);
  }
});

httpServer.listen(3000, () => {
    console.log("Server running...");
})
