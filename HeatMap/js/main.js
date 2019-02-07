
let img_keys = {eyetracker: "eye.png", screen: "monitor.png", webcam: "webcam.png"};

$(document).ready(function(){


    let key;
    let mysocket = new AppSocket();


    mysocket.on("open", function(){
        console.log("deu certo");
        mysocket.send("tools", "olá");
        $("#txtStatus").text("Online");
        $("#imgStatus").attr("src", "./img/bullet_green.png");

    }).on("error", function(){
        console.log("deu erro");
        $("#txtStatus").text("Erro");
        $("#imgStatus").attr("src", "./img/bullet_error.png");

    }).on("close", function(){
        console.log("FECHOU!");
        $("#txtStatus").text("Offline");
        $("#imgStatus").attr("src", "./img/bullet_red.png");

    }).on("connect", (res) => {
        console.log('oq o cliente recebe:', res.connection_key);
        key = res.connection_key;
    });
    mysocket.on('metadata', (res) => {
        console.log(res.result);
    });
    mysocket.on("using", (res)=>{
        let $tr = $("#tr_"+res.name);
        $tr.find("button.btnPause").removeAttr("disabled");
        $tr.append($("<td/>").addClass(res.device).append($("<img/>").attr("src", "./img/"+img_keys[res.device])));
    });
    mysocket.on("notusing", (res)=>{
        let $tr = $("#tr_"+res.name);
        $tr.find("td."+res.device).remove();
    });





    $(".container").css("display", "none");

    let cont = 0;
    $("#btnAddButton").click(function(){
        let testName = "Teste_"+(cont++);
        let tr = $("<tr/>").attr("id", "tr_"+testName);
        tr.get(0).__testName__ = testName;
        $("#divTests")
            .append(tr
                .append($("<td/>").text(testName))
                .append($("<td/>")
                    .append($("<button/>").text("Play").addClass("btnPlay").attr("data-first", "false")))
                .append($("<td/>")
                    .append($("<button/>").text("Pause").addClass("btnPause").attr("disabled", "true")))
                .append($("<td/>")
                    .append($("<button/>").text("Show").addClass("btnShow"))));



    });

    $(".checkCapture").change(function(e){
        mysocket.send("change_capture", {
            type: $(this).attr("name"),
            value: $(this).is(":checked")
        });
    });


    $("#divTests").on("click", "tr > td > button.btnPlay", function(){
        $("#divTests").find("button").attr("disabled", "true");
        let testName = $(this).parent().parent().get(0).__testName__;
        mysocket.send("createTest", {name: testName, ft: $(this).attr("data-first")});
        $(this).attr("data-first", "true");

    }).on("click", "tr > td > button.btnPause", function(){
        mysocket.send("pause");
        let table = $("#divTests");
        table.find("button.btnPause").attr("disabled","true");
        table.find("button.btnPlay").removeAttr("disabled");
        table.find("button.btnShow").removeAttr("disabled");
    }).on("click", "tr > td > button.btnShow", function(){
        let testName = $(this).parent().parent().get(0).__testName__;
        let IMGtype = $('input.radioIMGType:checked').val();
        let newWindow = window.open("./pages/heatmap.html", "HEATMAP", "width=1000,height=600");
        console.log(newWindow);
        newWindow.__arquivo__ = testName+".txt";
        newWindow.__IMGtype__ = IMGtype;
        console.log("IMGtype", IMGtype);
    });
});

