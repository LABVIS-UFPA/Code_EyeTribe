
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
        //"./bin/Tribe_Code.jar",
        ".\\bin\\Tribe_Code.jar ",
        "-dir",
        ".\\data\\",
        "-oname",
        msg.name,
        "-framerate",
        "15",
        "-webcamname",
        "HD Pro Webcam C920",
        "-noscreen",
        //"-screenname",
        //"screen-capture-recorder",
        "-microphonename",
        "Microfone (Realtek Audio)",
        "-noeyetracker",
        //msg.ft==="true"?"-append":""
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
    if(subprocess) {
        subprocess.stdin.end('q\r\n\n\r');
        //subprocess.kill();
    }
});
console.log(socket.callbacks);