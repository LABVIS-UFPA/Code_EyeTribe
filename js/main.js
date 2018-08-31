


$(document).ready(function(){


    let key;
    const mysocket = new AppSocket();

    mysocket.on("open", function(){
        console.log("deu certo");
        mysocket.send("tools", "olá")
    });

    mysocket.on("connect", (res) => {
        console.log('oq o cliente recebe:', res.connection_key);
        key = res.connection_key;
    });
    mysocket.on('metadata', (res) => {
        console.log(res.result);
    });





    $(".container").css("display", "none");

    let cont = 0;
    $("#btnAddButton").click(function(){
        let testName = "Teste_"+(cont++);
        let tr = $("<tr/>");
        tr.get(0).__testName__ = testName;
        $("#divTests")
            .append(tr
                .append($("<td/>").text(testName))
                .append($("<td/>")
                    .append($("<button/>").text("Play").addClass("btnPlay").attr("data-first", "false")))
                .append($("<td/>")
                    .append($("<button/>").text("Pause").addClass("btnPause")))
                .append($("<td/>")
                    .append($("<button/>").text("Show").addClass("btnShow"))));



    });


    $("#divTests").on("click", "tr > td > button.btnPlay", function(){
        let testName = $(this).parent().parent().get(0).__testName__;
        mysocket.send("createTest", {name: testName, ft: $(this).attr("data-first")});
        $(this).attr("data-first", "true");

    }).on("click", "tr > td > button.btnPause", function(){
        mysocket.send("pause");

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

