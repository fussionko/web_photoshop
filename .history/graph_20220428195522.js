
const graph_width = 266;
const graph_height = 250;

let main_graph;
let graph_ctx;

let normalization_value = 35;
let graph_offset = 5;


function initGraph()
{

    main_graph = document.getElementById("main-graph");
    graph_ctx = main_graph.getContext('2d');
    main_graph.width = graph_width;
    main_graph.height = graph_height;

    document.getElementById("basket-num").addEventListener("change", function(){
        basket_num = parseInt(this.value);
    });

    // graph_ctx.beginPath();
    // graph_ctx.strokeStyle = "#FF0000";
    // graph_ctx.moveTo(0, 0);
    // graph_ctx.bezierCurveTo(50, 50, 50, 100, 100, 100);
    
    // graph_ctx.stroke();
    // graph_ctx.closePath();
    create_graph()
}

let basket_num = 10;
let basket_size = Math.round(255/basket_num);
const graph_template = {
    "r":{},
    "g":{},
    "b":{}
}
let graph = JSON.parse(JSON.stringify(graph_template));

function create_graph()
{
    // graph = JSON.parse(JSON.stringify(graph_template));
    // for(let i = 1; i <= basket_num; i++)
    // {
    //     graph["r"][basket_size*i] = 0;
    //     graph["g"][basket_size*i] = 0;
    //     graph["b"][basket_size*i] = 0;
    // }
    graph = JSON.parse(JSON.stringify(graph_template));
    for(let i = 0; i <= 255; i++)
    {
        graph["r"][i] = 0;
        graph["g"][i] = 0;
        graph["b"][i] = 0;
    }
}

async function count_Pixel(img_data)
{
    let ranges = Object.keys(graph["r"]);
    console.log(ranges);
    // for(let i = 0; i < img_data.length; i+=4)
    // {
    //     for(const key in ranges)
    //         if(img_data[i] < parseInt(ranges[key])) 
    //         {
    //             graph["r"][ranges[key]]++;
    //             break;
    //         }
    //     for(const key in ranges)
    //         if(img_data[i+1] < parseInt(ranges[key])) 
    //         {
    //             graph["g"][ranges[key]]++;
    //             break;
    //         }
    //     for(const key in ranges)
    //         if(img_data[i+2] < parseInt(ranges[key])) 
    //         {
    //             graph["b"][ranges[key]]++;
    //             break;
    //         }
    // }
   // console.log(graph);
    for(let i = 0; i < img_data.length; i+=4)
    {

        graph["r"][ranges[img_data[i]]]++;
        graph["g"][ranges[img_data[i+1]]]++;
        graph["b"][ranges[img_data[i+2]]]++;
        //drawLine(graph_offset+img_data[i], graph_height, graph_offset+img_data[i], graph_height-graph["r"][ranges[img_data[i]]], "#FF0000")
    }


    normalizeGraph();
    console.log(graph);
    window.requestAnimationFrame(draw_graph_animation);
    //draw_graph();
}

function normalizeGraph()
{
    console.log(normalization_value);
    for(const c in graph)
        for(const range in graph[c])
            graph[c][range] = Math.round(graph[c][range]/normalization_value);
}

let i = 0;
function draw_graph_animation()
{
    graph_ctx.lineWidth = 1;
    // for(let range in graph["r"])
    // {
    //     range = parseInt(range)*2;
    //     if(i <= graph["r"][range]) 
    //     {
    //         // graph_ctx.beginPath();
    //         // graph_ctx.moveTo(graph_offset+range, graph_height);
    //         // graph_ctx.strokeStyle = "#FF0000";
    //         // graph_ctx.lineTo(graph_offset+range, graph_height-i);
    //         // graph_ctx.stroke();
    //         // graph_ctx.closePath();
    //        // console.log(range, graph_offset+range+1, graph_offset+range+2, graph_offset+range+3);
    //         graph_ctx.beginPath();
    //         graph_ctx.strokeStyle = "#FF0000";
    //         range *= 2;
    //         if(i == 0)
    //             graph_ctx.moveTo(graph_offset+range, graph_height);
    //         else graph_ctx.moveTo(graph_offset+range+1, graph_height-i+1);
    //         graph_ctx.bezierCurveTo(graph_offset+range, graph_height, graph_offset+range, graph_height-i, graph_offset+range+1, graph_height-i);
            
    //         graph_ctx.stroke();
    //         graph_ctx.closePath();
    //     }



    // }
    // if(i == 256)
    // {
    //     i=0;
    //     return;
    // }
    // i++;
    // window.requestAnimationFrame(draw_graph_animation);
    let prev = 0;
    graph_ctx.strokeStyle = "#FF0000";

    // let keys = Object.keys(storeObject);
    // let nextIndex = keys.indexOf(theCurrentItem) +1;
    // let nextItem = keys[nextIndex];

    let change = 0;
    let ch = false;
    for(let range in graph["r"])
    {
        range = parseInt(range);
        graph_ctx.beginPath();
        graph_ctx.moveTo(graph_offset+range-1, graph_height-prev);
        graph_ctx.quadraticCurveTo(graph_offset+range-1, graph_height-prev, graph_offset+range, graph_height-graph["r"][range]);
        graph_ctx.stroke();
        graph_ctx.closePath();
        prev = graph["r"][range];
    }

    // for(let i = 0; i <= 255; i++)
    // {
    //     graph_ctx.beginPath();
    //     graph_ctx.moveTo(graph_offset+i, graph_height-prev);
    //     graph_ctx.quadraticCurveTo(graph_offset+i, graph_height-prev, graph_offset+i, graph_height-graph["r"][i]);
    //     graph_ctx.stroke();
    //     graph_ctx.closePath();
    //     prev = range;

    //     console.log(graph_offset+i, graph_height-prev, graph_offset+i, graph_height-graph["r"][i]);
    // }
    
    
    
    
    

}


function drawCurve()
{

}


async function drawLine(x1, y1, x2, y2, color)
{
    graph_ctx.beginPath();
    
    graph_ctx.strokeStyle = color;
    graph_ctx.moveTo(x1, y1);
    graph_ctx.lineTo(x2, y2);
    graph_ctx.stroke();

    graph_ctx.closePath();
}

function draw_graph()
{
    graph_ctx.lineWidth = 1;
    console.log(graph);
    for(let range in graph["r"])
    {
        range = parseInt(range);

        graph_ctx.beginPath();
        graph_ctx.moveTo(graph_offset+range, graph_height);
        graph_ctx.strokeStyle = "#FF0000";

        graph_ctx.lineTo(graph_offset+range, graph_height-graph["r"][range]);
        graph_ctx.stroke();
        graph_ctx.closePath();

        graph_ctx.beginPath();
        graph_ctx.moveTo(graph_offset+range, graph_height);
        graph_ctx.strokeStyle = "#00FF00";
        graph_ctx.lineTo(graph_offset+range, graph_height-graph["g"][range]);
        graph_ctx.stroke();
        graph_ctx.closePath();

        graph_ctx.beginPath();
        graph_ctx.moveTo(graph_offset+range, graph_height);
        graph_ctx.strokeStyle = "#0000FF";
        graph_ctx.lineTo(graph_offset+range, graph_height-graph["b"][range]);
        graph_ctx.stroke();
        graph_ctx.closePath();
    }

    
}