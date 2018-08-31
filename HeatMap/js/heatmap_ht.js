// minimal heatmap instance configuration
var heatmapInstance_ht = h337.create({
    // only container is required, the rest will be defaults
    container: document.querySelector('#heatmap_ht'),

    gradient:{
        '.2':'rgba(0,255,247,.95)',
        '.4':'rgba(0,179,255,.95)',
        '.6':'rgba(0,60,255,.95)',
        '.85':'rgba(171,0,255,.95)',
        '.95':'rgba(222,0,255,.95)'
    },

    maxOpacity: .7,
    // minimum opacity. any value > 0 will produce
    // no transparent gradient transition
    minOpacity: .2
});

var heatmapInstance_et = h337.create({
    // only container is required, the rest will be defaults
    container: document.querySelector('.cnt_2'),

    maxOpacity: .7,
    // minimum opacity. any value > 0 will produce
    // no transparent gradient transition
    minOpacity: .2
});

var points_ht = [];
var points_et = [];




$(function() {
    if(window.__IMGtype__) {
        $(".heatmap").css("background-image", "url(./../data/fig_"+window.__IMGtype__+".png)")
    }

    if(window.__arquivo__) {
        console.log("./../"+window.__arquivo__);
        // loadData("./../"+window.__arquivo__, function (raw_data_ht) {
            loadData("./../"+window.__arquivo__, function (raw_data_et) {
                // console.log(raw_data_et);
                // let max_ht = populatePoints(points_ht, raw_data_ht);
                let max_et = populatePoints(points_et, raw_data_et);
                // let data_ht = {
                //     max: max_ht,
                //     data: points_ht
                // };
                // heatmapInstance_ht.setData(data_ht);

                let data_et = {
                    max: max_et,
                    data: points_et
                };
                heatmapInstance_et.setData(data_et);

                adjustHeatMaps();
            });
        // });
    }
});

function adjustHeatMaps(){

    $('div').css({
        'position':'absolute'
    });
    $('.cnt_2').css({
        'top':8,
        'left':8
    });
}

function populatePoints(points, raw_data){
    let splited_data = raw_data.split('\n');
    let cluster_points = [];
    let max = 1;
    for (let i = 0 ; i < splited_data.length ; i++ ){
        let p = splited_data[i].split("\t");
        let scaled_point = scale(+p[0], +p[1]);

        if (p[2]=== 'true'){
            cluster_points.push(scaled_point);
        }
        if (p[2]=== 'false' || i == splited_data.length - 1){
            let point;
            if (cluster_points.length > 0) {
                point = create_cluster_point(cluster_points);
                //console.log("Cluster point" + JSON.stringify(point));
                max = Math.max(point.value, max);
                cluster_points = [];
            } else {
                point = {
                    x: Math.floor(scaled_point.x),
                    y: Math.floor(scaled_point.y),
                    value: 1,
                    radius: 10
                }
            }
            points.push(point);
        }
    }
    return max;
}

function create_cluster_point(cluster_points){
    let points_x = [], points_y = [];
    let ratio = 1;
    for (let i = 0 ; i < cluster_points.length ; i++){
        points_x.push(cluster_points[i].x);
        points_y.push(cluster_points[i].y);
    }

    return {
        x:median(points_x),
        y:median(points_y),
        value:cluster_points.length*ratio,
        radius: cluster_points.length*ratio
    };
}