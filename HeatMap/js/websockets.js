/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var AppSocket = function (port) {
    
    var myappsocket = this;
    
    var _port = port || 6661;
    var socket = new WebSocket("ws://" + (location.host.split(":")[0]) + ":"+_port);

    myappsocket.status = {
        open: false
    };
    
    myappsocket.callbacks = {};
    
    socket.onopen = function () {
        myappsocket.status.open = true;
        //socket.send(JSON.stringify({email: "email", password: "id"}));
        console.log("connection open!");
        if(myappsocket.callbacks.open) myappsocket.callbacks.open();
        
   };

    //método chamado quando ocorre um erro no socket de comunicação com servidor.
    socket.onerror = function (e) {
        console.log('ERROR');
        console.log(e);
    };

    socket.onclose = function () {
        console.log('CLOSED');
        myappsocket.status.open = false;
    };

    socket.onmessage = function (e) {
        var objMsg = JSON.parse(e.data);
        if((typeof myappsocket.callbacks[objMsg.act]) === "function")
            myappsocket.callbacks[objMsg.act](objMsg.msg);
    };

    myappsocket.socket = socket;
    
    return myappsocket;
};

//Enviando requisições e recencendo no callback.
AppSocket.prototype.send = function (act, msg) {
    this.socket.send(JSON.stringify({act: act, msg: msg}));
};

AppSocket.prototype.on = function(act, callback){
    this.callbacks[act] = callback;
    return this;
};


