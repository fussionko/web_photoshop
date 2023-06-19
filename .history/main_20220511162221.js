const canvas_width = 500;
const canvas_height = 600;

let main_canvas;
let main_ctx;

main_canvas = document.getElementById("main-canvas");
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

     load_buttons(controls);

    canvas_x_position = Math.floor(main_canvas.getBoundingClientRect().left);
    canvas_y_position = Math.floor(main_canvas.getBoundingClientRect().top);

    loadHistory();
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(original_img_data);
    history.push(filterData(draw_image.data, "original"));
    currentHistoryIndex++;
    

    loadDraw();
    // initGraph();
    // all_new_graphs(original_img_data)

});


let max_gaussian = 15;
let max_modulus = 15;

function getPixelData()
{
    let imageData = main_ctx.getImageData(0, 0, canvas_width, canvas_height)
    return imageData.data;
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
    changing_img_data = draw_image.data;

    all_new_graphs(draw_image.data);

    for(let i = 0; i < buttons.length; i++)
        this.classList.remove("selected");
    document.getElementById().classList.add(current_filter_data["filter"]);
}

function loadImage(img_data)
{
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(img_data);
    main_ctx.putImageData(draw_image, 0, 0);
    changing_img_data = draw_image.data;
    addToHistory(draw_image.data);

    all_new_graphs(draw_image.data)
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


function load_buttons(controls)
{
    let buttons = document.getElementsByClassName("button");
    for(let i = 0; i < buttons.length; i++)
        buttons[i].addEventListener("click", function(){
            for(let j = 0; j < buttons.length; j++)
                buttons[j].classList.remove("selected");
            this.classList.add("selected");
        });

    document.getElementById("or").addEventListener("click", function(){
        clear(controls);
        loadImage(filterData(original_img_data, "or"));
    });

    // let draw = document.createElement("div");
    // draw.class = "button-function";
    // draw.innerText = "Original";
    // draw.addEventListener("click", function(){
    //     clear(controls);
    // });


    document.getElementById("gr_avg").addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_average(filterData(changing_img_data, "g_avg")));
    });

    document.getElementById("gr_w").addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_weight(filterData(changing_img_data, "gr_w")));
    });

    document.getElementById("tr").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "thresholding-control-slider", 0, 255, 1, 128);
        createInput(controls, "thresholding-min-value", 0, 255, 1, 0);
        createInput(controls, "thresholding-max-value", 0, 255, 1, 255);

        document.getElementById("thresholding-control-slider").addEventListener("input", function(){
            loadImage(thresholding(filterData(changing_img_data, "tr"), parseInt(document.getElementById("thresholding-min-value").value), 
                                                        parseInt(document.getElementById("thresholding-max-value").value), parseInt(this.value)));
        });
        
        document.getElementById("thresholding-min-value").addEventListener("change", function(){
            loadImage(thresholding(filterData(changing_img_data, "tr"), parseInt(this.value), parseInt(document.getElementById("thresholding-max-value").value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });

        document.getElementById("thresholding-max-value").addEventListener("change", function(){
            loadImage(thresholding(filterData(changing_img_data, "tr"), parseInt(document.getElementById("thresholding-min-value").value), parseInt(this.value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });
    });

    document.getElementById("c_r").addEventListener("click", function(){
        clear(controls);
        createCheckbox(controls, "color-channel-remove-red", 1);
        createCheckbox(controls, "color-channel-remove-green", 1);
        createCheckbox(controls, "color-channel-remove-blue", 1);

        let checkboxes = document.getElementsByTagName("input");
        for(let i = 0; i < checkboxes.length; i++)
            checkboxes[i].addEventListener("change", () => {
                loadImage(color_channel_remove(filterData(changing_img_data, "c_r"), document.getElementById("color-channel-remove-red").checked, 
                                                                    document.getElementById("color-channel-remove-green").checked, 
                                                                    document.getElementById("color-channel-remove-blue").checked));
            });

    });

    document.getElementById("c_c").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "color-channel-change-red", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-green", -255, 255, 1, 0);
        createSlider(controls, "color-channel-change-blue", -255, 255, 1, 0);
        let sliders = document.getElementsByTagName("input");
        for(let i = 0; i < sliders .length; i++)
        sliders [i].addEventListener("input", () => {
            loadImage(color_channel_change(filterData(changing_img_data, "c_c"), parseInt(document.getElementById("color-channel-change-red").value), 
                                                                parseInt(document.getElementById("color-channel-change-green").value), 
                                                                parseInt(document.getElementById("color-channel-change-blue").value)));
        });
    });

    document.getElementById("b").addEventListener("click", function(){
        clear(controls);
        createSlider(controls,"brightness-control-slider", -255, 255, 1, 0);
        document.getElementById("brightness-control-slider").addEventListener("input", function(){
            loadImage(brighten_image(filterData(changing_img_data, "b"), parseInt(this.value)));
        });      
    });

    document.getElementById("s").addEventListener("click", function(){
        clear(controls);
        createRadio(controls, "type", "sobel-controls-all", "all");
        createRadio(controls, "type", "sobel-controls-x", "x");
        createRadio(controls, "type", "sobel-controls-y", "y");
        createCheckbox(controls, "sobel-controls-color-ok", 0);
        createColor(controls, "sobel-controls-min-color", "#ffffff");
        createColor(controls, "sobel-controls-max-color", "#000000");
        createSlider(controls, "sobel-controls-threshold", 0, 255, 1, 128);
        document.getElementById("sobel-controls-all").addEventListener("click", function(){
            loadImage(sobel(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-x").addEventListener("click", function(){
            loadImage(sobel_x(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-y").addEventListener("click", function(){
            loadImage(sobel_y(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
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
    
    document.getElementById("sh").addEventListener("click", function(){
        clear(controls);
        loadImage(sharpening(filterData(changing_img_data, "sh")));  
    });

    document.getElementById("un").addEventListener("click", function(){
        clear(controls);   
        createSlider(controls, "unsharp-amount-controls", -15, 15, 0.1, 1);
        createSlider(controls, "unsharp-kernel-controls", 1, 8, 1, 1);
        loadImage(unsharpening(changing_img_data, 1, 1));
        document.getElementById("unsharp-amount-controls").addEventListener("input", function(){
            loadImage(unsharpening(filterData(changing_img_data, "un"), parseFloat(this.value), parseInt(document.getElementById("unsharp-kernel-controls").value)));  
        });
        document.getElementById("unsharp-kernel-controls").addEventListener("change", function(){
            loadImage(unsharpening(filterData(changing_img_data, "un"), parseFloat(document.getElementById("unsharp-amount-controls").value), parseInt(this.value)));  
        });
    });

    document.getElementById("w_avg").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "weighted_avg_linear-controls-weight", 1, 255, 1, 1);
        document.getElementById("weighted_avg_linear-controls-weight").addEventListener("input", function(){
            loadImage(weighted_avg_linear(filterData(changing_img_data, "w_avg"), parseInt(this.value)));  
        });
        loadImage(weighted_avg_linear(changing_img_data, 1));  
        
    });

    document.getElementById("g").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gaussian-deviation-controls-deviation",0, max_gaussian, 1, 0);
        document.getElementById("gaussian-deviation-controls-deviation").addEventListener("change", function(){
            loadImage(gaussian_blur(filterData(changing_img_data, "g"), parseFloat(this.value)));
        });
        
    });

    document.getElementById("m").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "modulus-controls", 0, max_modulus, 1, 0);
        document.getElementById("modulus-controls").addEventListener("change", function(){
            loadImage(modulus(filterData(changing_img_data, "m"), parseInt(this.value)));
        });
        
    });

    document.getElementById("gam").addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gamma-controls", 0.01, 20, 0.01, 1);
        document.getElementById("gamma-controls").addEventListener("input", function(){
            loadImage(gamma(filterData(changing_img_data, "gam"), parseFloat(this.value)));
        });
    });
}

function sobel_change()
{
    if(document.querySelector('input[name="type"]:checked') === null) return 0;
    let check = document.querySelector('input[name="type"]:checked').value;
    if(check == "all")
        loadImage(sobel(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "x")
        loadImage(sobel_x(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "y")
        loadImage(sobel_y(filterData(changing_img_data, "s"), document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
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
