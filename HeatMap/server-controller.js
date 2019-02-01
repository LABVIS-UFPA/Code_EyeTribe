
const socket = new (require("./ServerSocket.js"))();
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const fs = require('fs');


let process_eyetracker, process_webcam, process_sreen;
let hasEyeTracker=true, hasWebCam=true, hasScreen=true;


//Controller
socket.on("createTest", function(socket, msg){
    console.log("createTest");
    console.log(msg);

    if(process_eyetracker) {
        process_eyetracker.kill("SIGKILL");
        process_eyetracker = undefined;
    }
    if(process_webcam){
        process_webcam.kill("SIGKILL");
        process_webcam = undefined;
    }
    if(process_sreen){
        process_sreen.kill("SIGKILL");
        process_sreen = undefined;
    }

    if(hasEyeTracker){
        process_eyetracker = spawn('java',  [
            "-jar",
            //"./bin/Tribe_Code.jar",
            ".\\bin\\Tribe_Code.jar ",
            "-dir",
            "data\\",
            "-oname",
            msg.name,
            "-nowebcam",
            "-noscreen",
            "-noeyetracker",
            //msg.ft==="true"?"-append":""
        ]);

        socket.send("using", {
            device: "eyetracker",
            name: msg.name
        });

        process_eyetracker.on("exit", function () {
            console.log("TERMINATED");
            socket.send("notusing", {
                device: "eyetracker",
                name: msg.name
            });
            process_eyetracker = undefined;
        });
        process_eyetracker.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        process_eyetracker.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
    }

    if(hasWebCam){
        process_webcam = exec('ffmpeg -framerate 10 -f dshow -i video="Integrated Webcam":audio="Microfone (Realtek High Definition Audio)" "./data/webcam_'+msg.name+'.mp4"');

        socket.send("using", {
            device: "webcam",
            name: msg.name
        });
        process_webcam.on("exit", function () {
            console.log("TERMINATED process_webcam");
            process_webcam = undefined;
            socket.send("notusing", {
                device: "webcam",
                name: msg.name
            });
        });
        process_webcam.stdout.on('data', function (data) {
            console.log('process_webcam stdout: ' + data);
        });
        process_webcam.stderr.on('data', function (data) {
            console.log('process_webcam stderr: ' + data);
        });
    }

    if(hasScreen){
        process_sreen = exec('ffmpeg -framerate 10 -f dshow -i video="screen-capture-recorder" "./data/screen_'+msg.name+'.mp4"');
        socket.send("using", {
            device: "screen",
            name: msg.name
        });

        process_sreen.on("exit", function () {
            console.log("TERMINATED process_sreen");
            process_sreen = undefined;
            socket.send("notusing", {
                device: "screen",
                name: msg.name
            });
        });
        process_sreen.stdout.on('data', function (data) {
            console.log('process_sreen stdout: ' + data);
        });
        process_sreen.stderr.on('data', function (data) {
            console.log('process_sreen stderr: ' + data);
        });
    }


}).on("pause", function(socket, msg){
    console.log("pause");
    if(process_webcam)
        process_webcam.stdin.end('q\n');
    if(process_sreen)
        process_sreen.stdin.end('q\n');
    if(process_eyetracker)
        process_eyetracker.stdin.end('q\n');


}).on("change_capture", (socket, msg)=>{
    switch (msg.type){
        case "eyetracker":
            hasEyeTracker = msg.value;
            console.log("hasEyeTracker: "+msg.value);
            break;
        case "webcam":
            hasWebCam = msg.value;
            console.log("hasWebCam: "+msg.value);
            break;
        case "screen":
            hasScreen = msg.value;
            console.log("hasScreen: "+msg.value);
            break;
    }
});
console.log(socket.callbacks);