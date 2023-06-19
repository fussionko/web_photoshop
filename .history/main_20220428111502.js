const canvas_width = 500;
const canvas_height = 600;

let main_canvas;
let main_ctx;

main_canvas = document.getElementById("main_canvas");
main_ctx = main_canvas.getContext('2d');
    
main_canvas.width = canvas_width;
main_canvas.height = canvas_height;

let image = new Image();
image.src = "image1.jpg";
image.crossOrigin = "Anonymous";


let original_img_data;
let changing_img_data;

let canvas_x_position = 0;
let canvas_y_position = 0;

window.addEventListener("load", () => {
    main_ctx.drawImage(image, 0, 0, canvas_width, canvas_height);
    
    original_img_data = getPixelData();
    changing_img_data = original_img_data;

    let parent = document.getElementById("container-buttons");
    let controls = document.getElementById("container-controls");

    load_buttons(parent, controls);

    canvas_x_position = Math.floor(main_canvas.getBoundingClientRect().left);
    canvas_y_position = Math.floor(main_canvas.getBoundingClientRect().top);
    document.getElementById("history-back").addEventListener("click", function(){
        if(moveBackwardHistory() == -1) return;
        loadImageHistory();
    })
    
    document.getElementById("history-fow").addEventListener("click", function(){
        if(moveFowardHistory() == -1) return;
        loadImageHistory();
    })

    document.getElementById("history-reset").addEventListener("click", function(){
        let draw_image = new ImageData(canvas_width, canvas_height);
        draw_image.data.set(original_img_data);
        history = [draw_image.data];
        currentHistoryIndex = 1;
        current_filter_data["filter"] = "original";
        current_filter_data["index"] = 1;
        current_filter_data["data"] = draw_image.data;
        loadImageHistory();
    })
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(original_img_data);
    history.push(filterData(draw_image.data, "original"));
    currentHistoryIndex++;
    

    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', function(e){
        setPosition(e);
        draw(e);
    });
    document.addEventListener('mouseenter', setPosition);
    document.addEventListener('mouseup', function(e){
        if(e.clientX > canvas_x_position + canvas_width || e.clientX < canvas_x_position) return;
        if(e.clientY > canvas_y_position + canvas_height || e.clientY < canvas_y_position) return;
        loadImage(getPixelData());
    });

    document.getElementById("color").addEventListener("change", function(){
        draw_color = this.value;
        console.log(draw_color);
    });

    document.getElementById("brush-size").addEventListener("change", function(){
        brush_size = parseInt(this.value);
        console.log(brush_size);
    });

    document.getElementById("cap-type").addEventListener("change", function(){
        cap_type = this.value;
        console.log(cap_type);
    });


});

let pos = {x:0, y:0}

function setPosition(e) 
{
    pos.x = e.clientX - canvas_x_position;
    pos.y = e.clientY - canvas_y_position;
}

let draw_color = "#000000";
let brush_size = 4;
let cap_type = "round";
function draw(e)
{
    if (e.buttons !== 1) return;

    main_ctx.beginPath(); // begin

    main_ctx.lineWidth = brush_size;
    main_ctx.lineCap = cap_type;
    main_ctx.strokeStyle = draw_color;

    main_ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    main_ctx.lineTo(pos.x, pos.y); // to

    main_ctx.stroke(); // draw it!

    
}

function delete_draw(e)
{
    if (e.buttons !== 1) return;

    main_ctx.beginPath(); // begin

    main_ctx.lineWidth = brush_size;
    main_ctx.lineCap = 'round';
    main_ctx.strokeStyle = draw_color;

    main_ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    main_ctx.lineTo(pos.x, pos.y); // to

    main_ctx.stroke(); // draw it!
}


let history = [];
let currentHistoryIndex = 0;
function addToHistory(img_data)
{
    if(checkSame(img_data, history[history.length-1]) == 1) return;
    if(currentHistoryIndex != history.length)
        removeHistoryToIndex();

    history.push(img_data);
    currentHistoryIndex++;
}

function removeHistoryToIndex()
{
    history.splice(currentHistoryIndex, history.length-currentHistoryIndex)
}

function moveFowardHistory()
{
    if(currentHistoryIndex+1 > history.length) return -1;
    currentHistoryIndex++;
    return 1;
}

function moveBackwardHistory()
{
    if(currentHistoryIndex-1 <= 0) return -1;
    currentHistoryIndex--;
    return 1;
}

function getCurrentHistory()
{
    return history[currentHistoryIndex];
}

let max_gaussian = 15;
let max_modulus = 15;

function getPixelData()
{
    let imageData = main_ctx.getImageData(0, 0, canvas_width, canvas_height)
    return imageData.data;
}

const graph_width = 500;
const graph_height = 600;

let main_graph;
let graph_ctx;

main_graph = document.getElementById("main_graph");
graph_ctx = graph_canvas.getContext('2d');
    
main_canvas.width = canvas_width;
main_canvas.height = canvas_height;


let basket_num = 10;
let basket_size = Math.round(255/basket_num);
const graph_template = {
    "r":{},
    "g":{},
    "b":{}
}
let graph = JSON.parse(JSON.stringify(graph_template));
create_graph();
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
        for(keys)
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

function checkSame(img_data1, img_data2)
{
    for(let i = 0; i < img_data1.length; i++)
        if(img_data1[i] != img_data2[i])
            return 0;
    return 1;
}


function loadImageHistory()
{
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(history[currentHistoryIndex-1]);
    main_ctx.putImageData(draw_image, 0, 0);
    //count_Pixel(draw_image["data"]);
    changing_img_data = draw_image.data;
}

function loadImage(img_data)
{
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(img_data);
    main_ctx.putImageData(draw_image, 0, 0);
    //count_Pixel(draw_image["data"]);
    changing_img_data = draw_image.data;
    addToHistory(draw_image.data);
}

let current_filter_data = {
    "filter" : null,
    "index" : null,
    "data" : null
};

function filterData(img_data, filter_name)
{
    if(current_filter_data["filter"] != filter_name)
    {
        current_filter_data["filter"] = filter_name;
        current_filter_data["data"] = img_data;
        current_filter_data["index"] = currentHistoryIndex-1;
        return img_data;
    }
    return history[current_filter_data["index"]];
}


function load_buttons(parent, controls)
{
    let original = document.createElement("div");
    original.class = "button-function";
    original.innerText = "Original";
    original.addEventListener("click", function(){
        clear(controls);
        loadImage(filterData(original_img_data, "original"));
    });

    let draw = document.createElement("div");
    draw.class = "button-function";
    draw.innerText = "Original";
    draw.addEventListener("click", function(){
        clear(controls);
    });

    parent.appendChild(original);

    let grayscale_avg = document.createElement("div");
    grayscale_avg.class = "button-function";
    grayscale_avg.innerText = "Grayscale - average";
    grayscale_avg.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_average(filterData(changing_img_data, "grayscale_avg")));
    });
    parent.appendChild(grayscale_avg);

    let grayscale_w = document.createElement("div");
    grayscale_w.class = "button-function";
    grayscale_w.innerText = "Grayscale - weight";
    grayscale_w.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_weight(filterData(changing_img_data, "grayscale_weight")));
    });
    parent.appendChild(grayscale_w);


    let threshold = document.createElement("div");
    threshold.class = "button-function";
    threshold.innerText = "Thresholding";
    threshold.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "thresholding-control-slider", 0, 255, 1, 128);
        createInput(controls, "thresholding-min-value", 0, 255, 1, 0);
        createInput(controls, "thresholding-max-value", 0, 255, 1, 255);

        document.getElementById("thresholding-control-slider").addEventListener("input", function(){
            loadImage(thresholding(filterData(changing_img_data, "threshold"), parseInt(document.getElementById("thresholding-min-value").value), 
                                                        parseInt(document.getElementById("thresholding-max-value").value), parseInt(this.value)));
        });
        
        document.getElementById("thresholding-min-value").addEventListener("change", function(){
            loadImage(thresholding(filterData(changing_img_data, "threshold"), parseInt(this.value), parseInt(document.getElementById("thresholding-max-value").value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });

        document.getElementById("thresholding-max-value").addEventListener("change", function(){
            loadImage(thresholding(filterData(changing_img_data, "threshold"), parseInt(document.getElementById("thresholding-min-value").value), parseInt(this.value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });
    });
    parent.appendChild(threshold);

    let channel_remove = document.createElement("div");
    channel_remove.class = "button-function";
    channel_remove.innerText = "Remove color channel";
    channel_remove.addEventListener("click", function(){
        clear(controls);
        createCheckbox(controls, "color-channel-remove-red", 1);
        createCheckbox(controls, "color-channel-remove-green", 1);
        createCheckbox(controls, "color-channel-remove-blue", 1);

        let checkboxes = document.getElementsByTagName("input");
        for(let i = 0; i < checkboxes.length; i++)
            checkboxes[i].addEventListener("change", () => {
                loadImage(color_channel_remove(filterData(changing_img_data, "channel_remove"), document.getElementById("color-channel-remove-red").checked, 
                                                                    document.getElementById("color-channel-remove-green").checked, 
                                                                    document.getElementById("color-channel-remove-blue").checked));
            });

    });
    parent.appendChild(channel_remove);

    let channel_change = document.createElement("div");
    channel_change.class = "button-function";
    channel_change.innerText = "Change color channel";
    channel_change.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "color-channel-change-red", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-green", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-blue", -255, 255, 1, 0);
        let sliders = document.getElementsByTagName("input");
        for(let i = 0; i < sliders .length; i++)
        sliders [i].addEventListener("input", () => {
            loadImage(color_channel_change(filterData(changing_img_data, "channel_change"), parseInt(document.getElementById("color-channel-change-red").value), 
                                                                parseInt(document.getElementById("color-channel-change-green").value), 
                                                                parseInt(document.getElementById("color-channel-change-blue").value)));
        });
    });
    parent.appendChild(channel_change);

    let brightness = document.createElement("div");
    brightness.class = "button-function";
    brightness.id = "brightness";
    brightness.innerText = "Change brightness";
    brightness.addEventListener("click", function(){
        clear(controls);
        createSlider(controls,"brightness-control-slider", -255, 255, 1, 0);
        document.getElementById("brightness-control-slider").addEventListener("input", function(){
            loadImage(brighten_image(filterData(changing_img_data, "brightness"), parseInt(this.value)));
        });      
    });
    parent.appendChild(brightness);

    let sob = document.createElement("div");
    sob.class = "button-function";
    sob.innerText = "Sobel";
    sob.addEventListener("click", function(){
        clear(controls);
        createRadio(controls, "type", "sobel-controls-all", "all");
        createRadio(controls, "type", "sobel-controls-x", "x");
        createRadio(controls, "type", "sobel-controls-y", "y");
        // createInput(controls, "sobel-controls-min", 0, 255, 1, 0);
        // createInput(controls, "sobel-controls-max", 0, 255, 1, 255);
        createCheckbox(controls, "sobel-controls-color-ok", 0);
        createColor(controls, "sobel-controls-min-color", "#ffffff");
        createColor(controls, "sobel-controls-max-color", "#000000");
        createSlider(controls, "sobel-controls-threshold", 0, 255, 1, 128);
        //document.querySelector('input[name="genderS"]:checked').value;
        document.getElementById("sobel-controls-all").addEventListener("click", function(){
            loadImage(sobel(filterData(changing_img_data, "sobel"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-x").addEventListener("click", function(){
            loadImage(sobel_x(filterData(changing_img_data, "sobel_x"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-y").addEventListener("click", function(){
            loadImage(sobel_y(filterData(changing_img_data, "sobel_y"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value)));  
        });

        document.getElementById("sobel-controls-min-color").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-max-color").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-threshold").addEventListener("input", function(){
            if(sobel_change() == 0) return;
        });

        document.getElementById("sobel-controls-color-ok").addEventListener("change", function(){
            if(sobel_change() == 0) return;
        });
         
    });
    parent.appendChild(sob);
    
    let sharp = document.createElement("div");
    sharp.class = "button-function";
    sharp.innerText = "Sharpening";
    sharp.addEventListener("click", function(){
        clear(controls);
        loadImage(sharpening(filterData(changing_img_data, "sharpening")));  
    });
    parent.appendChild(sharp);

    let unsharp = document.createElement("div");
    unsharp.class = "button-function";
    unsharp.innerText = "Unsharpening";
    unsharp.addEventListener("click", function(){
        clear(controls);   
        createSlider(controls, "unsharp-amount-controls", -15, 15, 0.1, 1);
        createSlider(controls, "unsharp-kernel-controls", 1, 8, 1, 1);
        loadImage(unsharpening(changing_img_data, 1, 1));
        document.getElementById("unsharp-amount-controls").addEventListener("input", function(){
            loadImage(unsharpening(filterData(changing_img_data, "unsharpening"), parseFloat(this.value), parseInt(document.getElementById("unsharp-kernel-controls").value)));  
        });
        document.getElementById("unsharp-kernel-controls").addEventListener("change", function(){
            loadImage(unsharpening(filterData(changing_img_data, "unsharpening"), parseFloat(document.getElementById("unsharp-amount-controls").value), parseInt(this.value)));  
        });
    });
    parent.appendChild(unsharp);

    let weight_avg_lin = document.createElement("div");
    weight_avg_lin.class = "button-function";
    weight_avg_lin.id = "weighted_avg_linear";
    weight_avg_lin.innerText = "Weighted average linear";
    weight_avg_lin.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "weighted_avg_linear-controls-weight", 1, 255, 1, 1);
        document.getElementById("weighted_avg_linear-controls-weight").addEventListener("input", function(){
            loadImage(weighted_avg_linear(filterData(changing_img_data, "weighted_avg"), parseInt(this.value)));  
        });
        loadImage(weighted_avg_linear(changing_img_data, 1));  
        
    });
    parent.appendChild(weight_avg_lin);

    let gaussian_dev = document.createElement("div");
    gaussian_dev.class = "button-function";
    gaussian_dev.innerText = "Gaussian deviation";
    gaussian_dev.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gaussian-deviation-controls-deviation",0, max_gaussian, 1, 0);
        document.getElementById("gaussian-deviation-controls-deviation").addEventListener("change", function(){
            loadImage(gaussian_blur(filterData(changing_img_data, "gaussian"), parseFloat(this.value)));
        });
        
    });
    parent.appendChild(gaussian_dev);

    let mod = document.createElement("div");
    mod.class = "button-function";
    mod.innerText = "Modulus glajenje";
    mod.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "modulus-controls", 0, max_modulus, 1, 0);
        document.getElementById("modulus-controls").addEventListener("change", function(){
            loadImage(modulus(filterData(changing_img_data, "mod"), parseInt(this.value)));
        });
        
    });
    parent.appendChild(mod);

    let gam = document.createElement("div");
    gam.class = "button-function";
    gam.innerText = "Gamma korekcija";
    gam.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gamma-controls", 0.01, 20, 0.01, 1);
        document.getElementById("gamma-controls").addEventListener("input", function(){
            loadImage(gamma(filterData(changing_img_data, "gam"), parseFloat(this.value)));
        });
    });
    parent.appendChild(gam);
    
}

function sobel_change()
{
    if(document.querySelector('input[name="type"]:checked') === null) return 0;
    let check = document.querySelector('input[name="type"]:checked').value;
    if(check == "all")
        loadImage(sobel(filterData(changing_img_data, "sobel"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "x")
        loadImage(sobel_x(filterData(changing_img_data, "sobel_x"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "y")
        loadImage(sobel_y(filterData(changing_img_data, "sobel_y"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    return 1;
}

function clear(parent)
{
    while (parent.firstChild)
        parent.removeChild(parent.firstChild);
}

function createSlider(parent, id, min, max, step, value)
{
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.id = id;
    slider.name = id;
    parent.appendChild(slider);
}

function createInput(parent, id, min, max, step, value)
{
    let input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    input.id = id;
    input.name = id;
    parent.appendChild(input);
}

function createCheckbox(parent, id, value)
{
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.id = id;
    checkbox.name = id;
    checkbox.checked = value;
    parent.appendChild(checkbox);
}

function createRadio(parent, name, id, value)
{
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.value = value;
    radio.id = id;
    radio.name = name;
    parent.appendChild(radio);
}

function createColor(parent, id, value)
{
    let radio = document.createElement("input");
    radio.type = "color";
    radio.value = value;
    radio.id = id;
    radio.name = id;
    parent.appendChild(radio);
}
