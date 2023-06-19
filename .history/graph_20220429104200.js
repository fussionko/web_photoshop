const graph_width = 265;
const graph_height = 250;

const chart_width = 600;
const chart_height = 500;

let main_graph;
let graph_ctx;

let chart_ctx;

let normalization_value = 35;
let graph_offset = 5;

let main_chart;

function initGraph()
{
    main_graph = document.getElementById("main-graph");
    graph_ctx = main_graph.getContext('2d');
    main_graph.width = graph_width;
    main_graph.height = graph_height;

    main_chart = document.getElementById("main-chart") 
    chart_ctx = main_chart.getContext('2d');
    main_chart.width = chart_width;
    main_chart.height = chart_height;

    document.getElementById("basket-num").addEventListener("change", function(){
        let value = parseInt(this.value);
        for(let i = 0; i < allowed_basket_values.length; i++)
            if(allowed_basket_values[i] == value)
            { 
                basket_num = value;
                create_graph()
                return;
            }
       
    });

    clear_graph()
    create_graph()

    main_chart = new Chart(
        chart_ctx,
        config
    );

}

function clear_graph()
{
    graph_ctx.fillStyle = "#FFFFFF";
    graph_ctx.fillRect(0, 0, graph_width, graph_height);
}

let allowed_basket_values = [];
for(let i = 0; i <= 255; i++)
    if(255%i == 0)
        allowed_basket_values.push(i);
console.log(allowed_basket_values);

let basket_num = 255;
let basket_size = 255/basket_num;
const graph_template = {
    "r":{},
    "g":{},
    "b":{}
}
let graph = JSON.parse(JSON.stringify(graph_template));

function create_graph()
{
    graph = JSON.parse(JSON.stringify(graph_template));
    for(let i = 1; i <= basket_num; i++)
    {
        graph["r"][basket_size*i] = 0;
        graph["g"][basket_size*i] = 0;
        graph["b"][basket_size*i] = 0;
    }   
}

function count_Pixel(img_data)
{

    let ranges = Object.keys(graph["r"]);

    for(let i = 0; i < img_data.length; i+=4)
    {
        for(const key in ranges)
            if(img_data[i] < parseInt(ranges[key])) 
            {
                graph["r"][ranges[key]]++;
                break;
            }
        for(const key in ranges)
            if(img_data[i+1] < parseInt(ranges[key])) 
            {
                graph["g"][ranges[key]]++;
                break;
            }
        for(const key in ranges)
            if(img_data[i+2] < parseInt(ranges[key])) 
            {
                graph["b"][ranges[key]]++;
                break;
            }
    }

    console.log(graph);
    addData(main_chart);
    normalizeGraph();
    draw_graph();   
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



let labels = [];
for(let i = 0; i<= 255; i++)
    labels[i] = i;

const data = {
    labels: labels,
    datasets: [
        {
            label: 'Red',
            data: [],
            borderColor: "#ff0000",
            backgroundColor: "#ff0000",
        },
        {
            label: 'Green',
            data: [],
            borderColor: "#00ff00",
            backgroundColor: "#00ff00",
        },
        {
            label: 'Blue',
            data: [],
            borderColor: "#0000ff",
            backgroundColor: "#0000ff",
        }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: false,
        plugins: {
            legend: 
            {
                position: 'top',
            },
            title: 
            {
                display: true,
                text: 'Histogram'
            }
        },
        scales: {
            x: {
              ticks: {
                beginAtZero: true,
              }
            },
            y: {
              ticks: {
                beginAtZero: true,

              }
            }
          },
          elements: {
            point:{
                radius: 0
            }
        },
        animations: {
            tension: {
              duration: 1000,
              easing: 'linear',
              from: 1,
              to: 0,
            }
          },
    },
};


function addData(chart) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
        if(dataset.label == "Red")
            for(const range in graph["r"])
                dataset.data.push(graph["r"][range]);
        else if(dataset.label == "Green")
            for(const range in graph["g"])
                dataset.data.push(graph["g"][range]);
        else if(dataset.label == "Blue")
            for(const range in graph["b"])
                    dataset.data.push(graph["b"][range]);
    });
    console.log(chart.data);
    chart.update();
}

// const actions = [
//     {
//         name: 'Add Data',
//         handler(chart) 
//         {
//             const data = chart.data;
//             if (data.datasets.length > 0) 
//             {
//                 data.labels = Utils.months({count: data.labels.length + 1});

//                 for (let index = 0; index < data.datasets.length; ++index) 
//                     data.datasets[index].data.push(Utils.rand(-100, 100));
//                 chart.update();
//             }
//         }
//     },

//     {
//       name: 'Remove Data',
//       handler(chart) {
//         chart.data.labels.splice(-1, 1); // remove the label first
  
//         chart.data.datasets.forEach(dataset => {
//           dataset.data.pop();
//         });
  
//         chart.update();
//       }
//     }
//   ];


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