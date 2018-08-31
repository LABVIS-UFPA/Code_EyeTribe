var canvas_width = 840, canvas_height = 468;
var image_width = 1366, image_height = 768;

function scale(w, h){
    return {x: w*canvas_width/image_width, y : h*canvas_height/image_height }
}

function avg(values){
    var sum = 0;
    for( var i = 0; i < values.length; i++ ){
        sum += values[i];
    }
    return sum/values.length;
}

function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function loadData(path,callback){
    $.get(path, function( data ) {
        callback(data);
    });
}

function setupConfig(new_w, new_h){
    image_width = new_w;
    image_height = new_h;
}