
const graph_width = 265;
const graph_height = 240;

let main_graph;
let graph_ctx;


    


function initGraph()
{
    main_graph = document.getElementById("main-graph");
    graph_ctx = main_graph.getContext('2d');
    main_graph.width = graph_width;
    main_graph.height = graph_height;

    document.getElementById("basket-num").addEventListener("change", function(){
        basket_num = parseInt(this.value);
    });

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
    graph = JSON.parse(JSON.stringify(graph_template));
    for(let i = 1; i <= basket_num; i++)
    {
        graph["r"][basket_size*i] = 0;
        graph["g"][basket_size*i] = 0;
        graph["b"][basket_size*i] = 0;
    }
}

function count_graph()
{
    let num = 0;
    for(const color in graph)
    {
        let keys = Object.keys(graph[color]);
       
    }
    return num;
}
function count_Pixel(img_data)
{
    let ranges = Object.keys(graph["r"]);
    console.log(ranges);
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
    let count = 0;
    for(const c in graph)
        for(const amount in graph[c])
            count += graph[c][amount];

    console.log(graph, count);
}