const socket = io.connect()

let dataStart = "";

socket.on('messages', data => {
    renderMessages(data);
})

socket.on('products', data => {
    renderProducts(data);
})

/* $(document).ready(function() {
    if(dataStart === "") {
        $("#no-products-found").append(`
        <div id="no-products-found" class="d-flex justify-content-center">
           <div class="p-5" style="background-color: #3E7FB9; width: fit-content"><h2>No se encontraron productos</h2></div>
       </div> 
        `)
    } 
}); */



const renderMessages = (data) => {
    data.forEach((info) => {
        $("#messages").prepend(`
            <div>
                <strong>${info.author}</strong>
                <em>${info.text}</em>
            </div>
        `)
    });
}

const renderProducts = (data) => {

    if(data !== {} && data[0].name !== "" && data[0].price !== "" && data[0].photo !== "") {
    dataStart = data;  
    data.forEach((product) => {
        $("#products").prepend(`
            <tr>
                <th scope="row"> </th>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><img src="${product.photo}" width="100px" height="100px"></td>
            </tr>
        `)
    });
    } 
}

$('#my-form').submit(e => {
    e.preventDefault();
    
    const mensaje = {
        author: $("#username").val(),
        text: $("#text").val()
    }

    socket.emit('new-message', mensaje);

    return false;

})

$('#insert-product-form').submit(e => {
    e.preventDefault();

    const product = {
        name: $("#inputName").val(),
        price: $("#inputPrice").val(),
        photo: $("#inputPhoto").val()
    }

    socket.emit('new-product', product);

    return false;
})
