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

let show_graph_js = false;
let show_graph = false;

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

    document.getElementById("show-graph-js").addEventListener("change", function(){
        show_graph_js = !show_graph_js;
        clear_graph()
        create_graph()
    });

    document.getElementById("show-graph-js").addEventListener("change", function(){
        show_graph = !show_graph;
        clear_graph()
        create_graph()
    });

    let select_basket = document.getElementById("basket-num")
    for(let i = 0; i <= 255; i++)
        if(255%i == 0)
        {
            let option = document.createElement("option");
            option.value = i;
            option.innerText = i;
            if(i == 255)
                option.selected = 1;
            select_basket.appendChild(option);
        }

    document.getElementById("basket-num").addEventListener("change", function(){
        let value = parseInt(this.value);                
        basket_num = value;
        all_new_graphs(getPixelData());
    });

    clear_graph()
    create_graph()

    main_chart = new Chart(
        chart_ctx,
        config
    );

}

function all_new_graphs(img_data)
{
    clear_graph()
    create_graph()
    count_Pixel(img_data);

    updateLabels()
    addData(main_chart);
    


    normalizeGraph();
    draw_graph()
}

function clear_graph()
{
    graph_ctx.fillStyle = "#FFFFFF";
    graph_ctx.fillRect(0, 0, graph_width, graph_height);
}

let basket_num = 255;
let basket_size;
const graph_template = {
    "r":{},
    "g":{},
    "b":{}
}
let graph = JSON.parse(JSON.stringify(graph_template));

function create_graph()
{
    basket_size = 255/basket_num;
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
}

function normalizeGraph()
{
    for(const c in graph)
        for(const range in graph[c])
            graph[c][range] = Math.round(graph[c][range]/normalization_value);
}

let labels = [];
for(let i = 0; i<= 255; i++)
    labels[i] = i;


function updateLabels()
{
    labels = [];
    for(const label in graph["r"])
        labels.push(parseInt(label));
}


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
            xAxis: {
              ticks: {
                beginAtZero: true,
              }
            },
            yAxis: {
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
    chart.data.labels = labels;
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
    chart.update();
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