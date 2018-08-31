
const socket = new (require("./ServerSocket.js"))();
const spawn = require('child_process').spawn;


let subprocess;
//Controller
socket.on("createTest", function(socket, msg){
    console.log("createTest");
    console.log(msg);

    if(subprocess)
        subprocess.kill("SIGKILL");

    subprocess = spawn('java',  [
        "-jar",
        "C:\\Users\\Gustavo\\IdeaProjects\\Tribe_Code\\out\\artifacts\\Tribe_Code_jar\\Tribe_Code.jar",
        msg.name+".txt",
        msg.ft
    ]);

    subprocess.on("exit", function () {
        console.log("TERMINATED");
    });
    subprocess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    subprocess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

}).on("pause", function(socket, msg){
    console.log("pause");
    if(subprocess)
        subprocess.kill();
});
console.log(socket.callbacks);