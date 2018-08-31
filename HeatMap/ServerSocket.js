/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ServerSocket  = function(port){
    var WebSocketServer = require('ws').Server;
    var self = this;
    
    var default_port = port || 6661;
    
    self.wss = new WebSocketServer({port: default_port});
    
    self.callbacks = {};

    self.wss.on('connection', function (socket) {


        socket.on('message', function (message, flags) {

            //if (flags && !flags.binary) {
                var objMsg = JSON.parse(message);
                if (self.callbacks[objMsg.act])
                    self.callbacks[objMsg.act](socket, objMsg.msg);
            //}
        });
        
        socket.on('close', function(err){
            console.log("closed");
            console.log(err);
        });
        
    });
    
    self.wss.on("close", function(err){console.log("closed");console.log(err);});
    self.wss.on("error", function(err){console.log("error");console.log(err);});
    
    self.wss.on("open", function(err){console.log("open on port 6661");console.log(err);});

    self.wss.broadcast = function (data) {
        self.wss.clients.forEach(function (client) {
            client.send(data);
        });
    };
    
    return self;
};

ServerSocket.prototype.send = function(client, act, msg){
    client.send(JSON.stringify({act: act, msg: msg}));
};

ServerSocket.prototype.sendBroadcast = function(act, msg){
    this.wss.broadcast(JSON.stringify({act: act, msg: msg}));
};

ServerSocket.prototype.on = function(act, callback){
    this.callbacks[act] = callback;
    return this;
};


module.exports = ServerSocket;