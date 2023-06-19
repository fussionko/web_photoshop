
const graph_width = 500;
const graph_height = 600;

let main_graph;
let graph_ctx;


    


function initGraph()
{
    main_graph = document.getElementById("main_graph");
    graph_ctx = main_graph.getContext('2d');
    main_graph.width = graph_width;
main_graph.height = graph_height;
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
    for(let i = 0; i < basket_num; i++)
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
    for(let i = 0; i < img_data.length; i+=4)
    {
        for(const key in ranges)
            if(img_data[i] < ranges[key]) 
            {
                graph["r"][ranges[key]]++;
                break;
            }
        for(const key in ranges)
            if(img_data[i+1] < ranges[key]) 
            {
                graph["g"][ranges[key]]++;
                break;
            }
        for(const key in ranges)
            if(img_data[i+2] < ranges[key]) 
            {
                graph["b"][ranges[key]]++;
                break;
            }
    }
}