
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
    clear_graph()
    create_graph()
}

function clear_graph()
{

    graph_ctx.fillStyle = "#FFFFFF";
    graph_ctx.fillRect(0, 0, graph_width, graph_height);
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

function count_Pixel(img_data)
{

    let ranges = Object.keys(graph["r"]);

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
    draw_graph()
   // window.requestAnimationFrame(draw_graph_animation);
    //draw_graph();
}

function normalizeGraph()
{

    for(const c in graph)
        for(const range in graph[c])
            graph[c][range] = Math.round(graph[c][range]/normalization_value);
}

let i = 0;
function draw_graph_animation()
{
   
}


function drawCurve(range, height, prev, color)
{
    graph_ctx.strokeStyle = color;
    graph_ctx.beginPath();
    graph_ctx.moveTo(graph_offset+range-1, graph_height-prev);
    graph_ctx.quadraticCurveTo(graph_offset+range-1, graph_height-prev, graph_offset+range, height);
    graph_ctx.stroke();
    graph_ctx.closePath();
}

const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

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