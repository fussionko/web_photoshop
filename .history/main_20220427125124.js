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

window.addEventListener("load", () => {
    main_ctx.drawImage(image, 0, 0, canvas_width, canvas_height);
    
    original_img_data = getPixelData();

    let parent = document.getElementById("container-buttons");
    let controls = document.getElementById("container-controls");

    load_buttons(parent, controls);

});

let history = [];
let currentHistoryIndex = 0;
function addToHistory(img_data)
{
    history.push(img_data);
}

function removeHistoryToIndex()
{
    history.splice(currentHistoryIndex+1, history.length-currentHistoryIndex-1)
}

function moveFowardHistory()
{
    if(currentHistoryIndex+1 >= history.length) return -1;
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

document.getElementById("history-back").addEventListener("click", function(){
    if(moveBackwardHistory() == -1) return;
    loadImage(getCurrentHistory());
})

document.getElementById("history-fow").addEventListener("click", function(){
    if(moveFowardHistory() == -1) return;
    loadImage(getCurrentHistory());
})


let max_gaussian = 15;
let max_modulus = 15;

function getPixelData()
{
    let imageData = main_ctx.getImageData(0, 0, canvas_width, canvas_height)
    return imageData.data;
}

function grayscale_average(img_data)
{
    let new_img_data = []; 
    for(let i = 0; i < img_data.length; i+=4)
    {
        let avg = Math.round((img_data[i]+img_data[i+1]+img_data[i+2])/3);
        new_img_data[i] = avg;
        new_img_data[i+1] = avg;
        new_img_data[i+2] = avg;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function grayscale_weight(img_data)
{
    let new_img_data = [];
    let r_weight = 0.299, g_weight = 0.587, b_weight = 0.114; 
    for(let i = 0; i < img_data.length; i+=4)
    {
        let sum = img_data[i]*r_weight + img_data[i+1]*g_weight + img_data[i+2]*b_weight;
        new_img_data[i] = sum;
        new_img_data[i+1] = sum;
        new_img_data[i+2] = sum;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function thresholding(img_data, pixel_value_min, pixel_value_max, threshold)
{
    let new_img_data = [];
    for(let i = 0; i < img_data.length; i+=4)
    {
        new_img_data[i] = img_data[i] > threshold ? pixel_value_max : pixel_value_min;
        new_img_data[i+1] = img_data[i+1] > threshold ? pixel_value_max : pixel_value_min;
        new_img_data[i+2] = img_data[i+2] > threshold ? pixel_value_max : pixel_value_min;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function color_channel_remove(img_data, r, g, b)
{
    let new_img_data = []; 
    for(let i = 0; i < img_data.length; i += 4)
    {
        new_img_data[i] = r === false ? 0 : img_data[i];
        new_img_data[i+1] = g === false ? 0 : img_data[i+1];
        new_img_data[i+2] = b === false ? 0 : img_data[i+2];
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function color_channel_change(img_data, r, g, b)
{
    let new_img_data = []; 
    for(let i = 0; i < img_data.length; i += 4)
    {
        new_img_data[i] = r !== 0 ? img_data[i]+r : img_data[i];
        new_img_data[i+1] = g !== 0 ? img_data[i+1]+g : img_data[i+1];
        new_img_data[i+2] = b !== 0 ? img_data[i+2]+b : img_data[i+2];
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function brighten_image(img_data, brightnes_increase)
{
    let new_img_data = [];
    if(brightnes_increase === 0) return img_data; 
    for(let i = 0; i < img_data.length; i+=4)
    {
        new_img_data[i] = img_data[i]+brightnes_increase;
        new_img_data[i+1] = img_data[i+1]+brightnes_increase;
        new_img_data[i+2] = img_data[i+2]+brightnes_increase;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

let computed_sobel;
let computed_sobel_x;
let computed_sobel_y;

let computed_sobel_sum_x;
let computed_sobel_sum_y; // mozno

function sobel_y(img_data, min_color, max_color, color_ok, threshold)
{
    let new_img_data = [];
    img_data = grayscale_weight(img_data);
    if(color_ok === true)
    {
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-4-canvas_width*4] + img_data[i+4-canvas_width*4]*-1 + 
                            img_data[i-4]*2 + img_data[i+4]*-2 + 
                            img_data[i-4+canvas_width*4] + img_data[i+4+canvas_width*4]*-1;
            let color = matrix_sum < threshold ? max_color : min_color;
            new_img_data[i] = hexToRgb(color).r;
            new_img_data[i+1] = hexToRgb(color).g;
            new_img_data[i+2] = hexToRgb(color).b;
            new_img_data[i+3] = img_data[i+3];
        }
    }
    else
    {
        if(computed_sobel_y !== undefined) return computed_sobel_y;
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-4-canvas_width*4] + img_data[i-canvas_width*4]*2 + img_data[i+4-canvas_width*4] +
                            img_data[i-4+canvas_width*4]*-1 + img_data[i+canvas_width*4]*-2 + img_data[i+4+canvas_width*4]*-1;
            new_img_data[i] = matrix_sum;
            new_img_data[i+1] = matrix_sum;
            new_img_data[i+2] = matrix_sum;
            new_img_data[i+3] = img_data[i+3];
        }
        computed_sobel_y = new_img_data;
    }

    return new_img_data;
}

function sobel_x(img_data, min_color, max_color, color_ok, threshold)
{
    let new_img_data = [];
    img_data = grayscale_weight(img_data);
    if(color_ok === true)
    {
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-4-canvas_width*4] + img_data[i-canvas_width*4]*2 + img_data[i+4-canvas_width*4] +
                            img_data[i-4+canvas_width*4]*-1 + img_data[i+canvas_width*4]*-2 + img_data[i+4+canvas_width*4]*-1;
            let color = matrix_sum < threshold ? max_color : min_color;
            new_img_data[i] = hexToRgb(color).r;
            new_img_data[i+1] = hexToRgb(color).g;
            new_img_data[i+2] = hexToRgb(color).b;
            new_img_data[i+3] = img_data[i+3];
        }
    }
    else
    {
        if(computed_sobel_x !== undefined) return computed_sobel_x;
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-4-canvas_width*4] + img_data[i-canvas_width*4]*2 + img_data[i+4-canvas_width*4] +
                            img_data[i-4+canvas_width*4]*-1 + img_data[i+canvas_width*4]*-2 + img_data[i+4+canvas_width*4]*-1;
            new_img_data[i] = matrix_sum;
            new_img_data[i+1] = matrix_sum;
            new_img_data[i+2] = matrix_sum;
            new_img_data[i+3] = img_data[i+3];
        }
        computed_sobel_x = new_img_data;
    }

    return new_img_data;
}

// let checl_AWDAWDAWD = [
//     [img_data[i-4-canvas_width*4], img_data[i-canvas_width*4], img_data[i+4-canvas_width*4]],
//     [img_data[i-4], img_data[i], img_data[i+4]],
//     [img_data[i-4+canvas_width*4], img_data[i+canvas_width*4], img_data[i+4+canvas_width*4]]
// ];

function sobel(img_data, min_color, max_color, color_ok, threshold)
{
    let new_img_data = [];
    img_data = grayscale_weight(img_data);
    if(color_ok === true)
    {
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-canvas_width*4] + img_data[i-4] + img_data[i]*-4 + img_data[i+4] + img_data[i+canvas_width*4];
            let color = matrix_sum < threshold ? max_color : min_color;
            new_img_data[i] = hexToRgb(color).r;
            new_img_data[i+1] = hexToRgb(color).g;
            new_img_data[i+2] = hexToRgb(color).b;
            new_img_data[i+3] = img_data[i+3];
        }
    }
    else
    {
        if(computed_sobel !== undefined) return computed_sobel;
        for(let i = 0; i < img_data.length; i+=4)
        {
            let matrix_sum = img_data[i-4-canvas_width*4] + img_data[i-canvas_width*4]*2 + img_data[i+4-canvas_width*4] +
                            img_data[i-4+canvas_width*4]*-1 + img_data[i+canvas_width*4]*-2 + img_data[i+4+canvas_width*4]*-1;
            new_img_data[i] = matrix_sum;
            new_img_data[i+1] = matrix_sum;
            new_img_data[i+2] = matrix_sum;
            new_img_data[i+3] = img_data[i+3];
        }
        computed_sobel = new_img_data;
    }

    return new_img_data;
}

let ultra_computed_modulus = {};

function modulus(img_data, range)
{
    if(ultra_computed_modulus[range] !== undefined) return ultra_computed_modulus[range];

    let new_img_data = [];
    for(let i = 0; i < img_data.length; i+=4)
    {
        let array_r_adjecant = [], array_g_adjecant = [], array_b_adjecant = [];
        get_adjecant_pixels_array(i, range, img_data, array_r_adjecant, array_g_adjecant, array_b_adjecant);
        array_r_adjecant.sort();
        array_g_adjecant.sort();
        array_b_adjecant.sort();
        new_img_data[i] = array_r_adjecant[Math.floor(array_r_adjecant.length/2)];
        new_img_data[i+1] = array_g_adjecant[Math.floor(array_g_adjecant.length/2)];
        new_img_data[i+2] = array_b_adjecant[Math.floor(array_b_adjecant.length/2)];
        new_img_data[i+3] = img_data[i+3];
    }
    ultra_computed_modulus[range] = new_img_data;

    return new_img_data;
}

//let ultra_computed_gamma = {};
function gamma(img_data, gamma)
{
    //if(ultra_computed_gamma[gamma] !== undefined) return ultra_computed_gamma[gamma];

    let new_img_data = [];
    for(let i = 0; i < img_data.length; i+=4)
    {
        new_img_data[i] = 255*Math.pow((img_data[i]/255), gamma);
        new_img_data[i+1] = 255*Math.pow((img_data[i+1]/255), gamma);
        new_img_data[i+2] = 255*Math.pow((img_data[i+2]/255), gamma);
        new_img_data[i+3] = img_data[i+3];
    }
   // ultra_computed_gamma[gamma] = new_img_data;

    return new_img_data;
}

function sharpening(img_data)
{
    let new_img_data = [];
    for(let i = 0; i < img_data.length; i+=4)
    {
        let r_sum = img_data[i-4-canvas_width*4]*-1 + img_data[i-canvas_width*4]*-1 + img_data[i+4-canvas_width*4]*-1 +
                    img_data[i-4]*-1 + img_data[i]*9 + img_data[i+4]*-1 + 
                    img_data[i-4+canvas_width*4]*-1 + img_data[i+canvas_width*4]*-1 + img_data[i+4+canvas_width*4]*-1;
        let g_sum = img_data[i+1-4-canvas_width*4]*-1 + img_data[i+1-canvas_width*4]*-1 + img_data[i+1+4-canvas_width*4]*-1 +
                    img_data[i+1-4]*-1 + img_data[i+1]*9 + img_data[i+1+4]*-1 + 
                    img_data[i+1-4+canvas_width*4]*-1 + img_data[i+1+canvas_width*4]*-1 + img_data[i+1+4+canvas_width*4]*-1;
        let b_sum = img_data[i+2-4-canvas_width*4]*-1 + img_data[i+2-canvas_width*4]*-1 + img_data[i+2+4-canvas_width*4]*-1 +
                    img_data[i+2-4]*-1 + img_data[i+2]*9 + img_data[i+2+4]*-1 + 
                    img_data[i+2-4+canvas_width*4]*-1 + img_data[i+2+canvas_width*4]*-1 + img_data[i+2+4+canvas_width*4]*-1;
        new_img_data[i] = r_sum;
        new_img_data[i+1] = g_sum;
        new_img_data[i+2] = b_sum;
        new_img_data[i+3] = img_data[i+3];
    }
    return new_img_data;
}

function unsharpening(img_data, amount, kernel_size)
{
    let new_img_data = [];
    let blurred = gaussian_blur(img_data, kernel_size);
    for(let i = 0; i < img_data.length; i+=4)
    {
        new_img_data[i] = img_data[i] + (img_data[i]-blurred[i])*amount;
        new_img_data[i+1] = img_data[i+1] + (img_data[i+1]-blurred[i+1])*amount;
        new_img_data[i+2] = img_data[i+2] + (img_data[i+2]-blurred[i+2])*amount;
        new_img_data[i+3] = img_data[i+3];
    }
   
    return new_img_data;
}

function box_filter(data_m)
{
    let sum = 0;
    for(let i = 0; i < data_m.length; i++)
        for(let j = 0; j < data_m.length; j++)
            sum += data_m[i][j];
    return sum*(1/9);
}

const weighted_avg_linear_matrix = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

const weighted_avg_linear_matrix2 = [
    [1, 4, 1],
    [4, 20, 4],
    [1, 4, 123]
];

function weighted_avg_linear(img_data, weight)
{
    let new_img_data = [];
    let weighted_avg_linear_matrix_test = [
        [1, 2, 1],
        [2, 4*weight, 2],
        [1, 2, 1]
    ];
    weight *= 2;
    for(let i = 0; i < img_data.length; i+=4)
    {
        let values_matrix_r = [
            [img_data[i-4-canvas_width*4], img_data[i-canvas_width*4], img_data[i+4-canvas_width*4]],
            [img_data[i-4], img_data[i], img_data[i+4]],
            [img_data[i-4+canvas_width*4], img_data[i+canvas_width*4], img_data[i+4+canvas_width*4]]
        ];

        let values_matrix_g = [
            [img_data[i+1-4-canvas_width*4], img_data[i+1-canvas_width*4], img_data[i+1+4-canvas_width*4]],
            [img_data[i+1-4], img_data[i+1], img_data[i+1+4]],
            [img_data[i+1-4+canvas_width*4], img_data[i+1+canvas_width*4], img_data[i+1+4+canvas_width*4]]
        ];

        let values_matrix_b = [
            [img_data[i+2-4-canvas_width*4], img_data[i+2-canvas_width*4], img_data[i+2+4-canvas_width*4]],
            [img_data[i+2-4], img_data[i+2], img_data[i+2+4]],
            [img_data[i+2-4+canvas_width*4], img_data[i+2+canvas_width*4], img_data[i+2+4+canvas_width*4]]
        ];

        let mat_r = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_r)*(1/weight);
        let mat_g = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_g)*(1/weight);
        let mat_b = calculateMatrixSum(weighted_avg_linear_matrix_test, values_matrix_b)*(1/weight);

        new_img_data[i] = mat_r;
        new_img_data[i+1] = mat_g;
        new_img_data[i+2] = mat_b;
        new_img_data[i+3] = img_data[i+3];
    }

    return new_img_data;
}

// function decrease_quality(img_data)
// {
//     let new_img_data = [];
//     for(let i = 0; i < img_data.length; i+=4)
//     {
//         new_img_data[i] = (canvas_width*4)%i ? 
//         ;
//         new_img_data[i+3] = img_data[i];
//     }
//     return new_img_data;
// }


// let basket_num = 10;
// let basket_size = Math.round(255/basket_num);
// const graph_template = {
//     "r":{},
//     "g":{},
//     "b":{}
// }
// let graph = JSON.parse(JSON.stringify(graph_template));
// create_graph();
// function create_graph()
// {
//     graph = JSON.parse(JSON.stringify(graph_template));
//     for(let i = 0; i < basket_num; i++)
//     {
//         graph["r"][basket_size*i] = 0;
//         graph["g"][basket_size*i] = 0;
//         graph["b"][basket_size*i] = 0;
//     }
// }

// function count_graph()
// {
//     let num = 0;
//     for(const color in graph)
//     {
//         let keys = Object.keys(graph[color]);
//         for(keys)
//     }
//     return num;
// }
// function count_Pixel(img_data)
// {
//     console.log("IZVEDENO", img_data);
//     let ranges = Object.keys(graph["r"]);
//     for(let i = 0; i < img_data.length; i+=4)
//     {
//         for(const key in ranges)
//             if(img_data[i] < ranges[key]) 
//             {
//                 graph["r"][ranges[key]]++;
//                 break;
//             }
//         for(const key in ranges)
//             if(img_data[i+1] < ranges[key]) 
//             {
//                 graph["g"][ranges[key]]++;
//                 break;
//             }
//         for(const key in ranges)
//             if(img_data[i+2] < ranges[key]) 
//             {
//                 graph["b"][ranges[key]]++;
//                 break;
//             }
//     }
//     console.log(count_graph());
// }

let ultra_computed_gaussian_blur = {};

function gaussian_blur(img_data, deviation)
{
    if(deviation === 0) return img_data;
    if(ultra_computed_gaussian_blur[deviation] !== undefined) return ultra_computed_gaussian_blur[deviation];

    let new_img_data = [];
    const range = 2*deviation;
    let matrix_gaussian = [], sum = get_gaussian_matrix(range, deviation, matrix_gaussian);
    for(let i = 0; i < img_data.length; i+=4)
    {
        let matrix_r_adjecant = [], matrix_g_adjecant = [], matrix_b_adjecant = []; 
        get_adjecant_pixels(i, range, img_data, matrix_r_adjecant, matrix_g_adjecant, matrix_b_adjecant);
        new_img_data[i] = calculateMatrixSum(matrix_gaussian, matrix_r_adjecant)/sum;
        new_img_data[i+1] = calculateMatrixSum(matrix_gaussian, matrix_g_adjecant)/sum;
        new_img_data[i+2] = calculateMatrixSum(matrix_gaussian, matrix_b_adjecant)/sum;
        new_img_data[i+3] = img_data[i+3];
    }
    ultra_computed_gaussian_blur[deviation] = new_img_data;

    return new_img_data;
}

function get_adjecant_pixels(index, range, img_data, matrix_r_adjecant, matrix_g_adjecant, matrix_b_adjecant)
{
    let next = canvas_width*4;
    for(let y = -range; y <= range; y++)
    {
        let yrange = y+range;
        matrix_r_adjecant[yrange] = [];
        matrix_g_adjecant[yrange] = [];
        matrix_b_adjecant[yrange] = [];  
        for(let x = -range; x <= range; x++)
        {
            let xrange = x+range;
            let r = 128, g = 128, b = 128;
            if(index%(canvas_width*4)+x*4 >= 0)
            {
                const main_i = index+next*y+4*x;
                if(main_i >= 0)
                {
                    r = img_data[main_i];
                    g = img_data[main_i+1];
                    b = img_data[main_i+2];
                }
            }
            matrix_r_adjecant[yrange][xrange] = r;
            matrix_g_adjecant[yrange][xrange] = g;
            matrix_b_adjecant[yrange][xrange] = b;
        }
    } 
}

function get_adjecant_pixels_array(index, range, img_data, array_r_adjecant, array_g_adjecant, array_b_adjecant)
{
    const next = canvas_width*4;
    for(let y = -range; y <= range; y++)
    {
        for(let x = -range; x <= range; x++)
        {
            let r = 0, g = 0, b = 0;
            if(index%(canvas_width*4)+x*4 >= 0)
            {
                const main_i = index+next*y+4*x;
                if(main_i >= 0)
                {
                    r = img_data[main_i];
                    g = img_data[main_i+1];
                    b = img_data[main_i+2];
                }
            }
            array_r_adjecant.push(r);
            array_g_adjecant.push(g);
            array_b_adjecant.push(b);
        }
    } 
}

function get_gaussian_matrix(range, deviation, matrix_gaussian)
{
    let sum = 0;
    for(let y = -range; y <= range; y++)
    {
        matrix_gaussian[y+range] = [];
        for(let x = -range; x <= range; x++)
        {
            matrix_gaussian[y+range][x+range] = gaussian_2d_equation(x, y, deviation);
            sum += matrix_gaussian[y+range][x+range];
        }
    }
    return sum;
}

function gaussian_2d_equation(x, y, deviation)
{
    let exp = -(x*x+y*y)/(2*deviation*deviation);
    let main = 1/(2*Math.PI*deviation*deviation);
    return main*Math.pow(Math.E, exp);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function calculateMatrixSum(matrix, values)
{
    let sum = 0;
    for(let i = 0; i < matrix[0].length; i++)
        for(let j = 0; j < matrix.length; j++)
            if(values[i][j] !== undefined)
                sum += values[i][j]*matrix[i][j];        
    return sum;
}

function loadImage(img_data)
{
    let draw_image = new ImageData(canvas_width, canvas_height);
    draw_image.data.set(img_data);
    main_ctx.putImageData(draw_image, 0, 0);
    //count_Pixel(draw_image["data"]);
    original_img_data = draw_image.data;
    addToHistory(img_data)
}

function load_buttons(parent, controls)
{
    let original = document.createElement("div");
    original.class = "button-function";
    original.innerText = "Original";
    original.addEventListener("click", function(){
        clear(controls);
        loadImage(original_img_data);
    });
    parent.appendChild(original);

    let grayscale_avg = document.createElement("div");
    grayscale_avg.class = "button-function";
    grayscale_avg.innerText = "Grayscale - average";
    grayscale_avg.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_average(original_img_data));
    });
    parent.appendChild(grayscale_avg);

    let grayscale_w = document.createElement("div");
    grayscale_w.class = "button-function";
    grayscale_w.innerText = "Grayscale - weight";
    grayscale_w.addEventListener("click", function(){
        clear(controls);
        loadImage(grayscale_weight(original_img_data));
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
            loadImage(thresholding(original_img_data, parseInt(document.getElementById("thresholding-min-value").value), 
                                                        parseInt(document.getElementById("thresholding-max-value").value), parseInt(this.value)));
        });
        
        document.getElementById("thresholding-min-value").addEventListener("change", function(){
            loadImage(thresholding(original_img_data, parseInt(this.value), parseInt(document.getElementById("thresholding-max-value").value),
                                                        parseInt(document.getElementById("thresholding-control-slider").value)));
        });

        document.getElementById("thresholding-max-value").addEventListener("change", function(){
            loadImage(thresholding(original_img_data, parseInt(document.getElementById("thresholding-min-value").value), parseInt(this.value),
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
                loadImage(color_channel_remove(original_img_data, document.getElementById("color-channel-remove-red").checked, 
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
            loadImage(color_channel_change(original_img_data, parseInt(document.getElementById("color-channel-change-red").value), 
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
            loadImage(brighten_image(original_img_data, parseInt(this.value)));
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
            loadImage(sobel(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-x").addEventListener("click", function(){
            loadImage(sobel_x(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                            document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
        });
        document.getElementById("sobel-controls-y").addEventListener("click", function(){
            loadImage(sobel_y(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
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
        loadImage(sharpening(original_img_data));  
    });
    parent.appendChild(sharp);

    let unsharp = document.createElement("div");
    unsharp.class = "button-function";
    unsharp.innerText = "Unsharpening";
    unsharp.addEventListener("click", function(){
        clear(controls);   
        createSlider(controls, "unsharp-amount-controls", -15, 15, 0.1, 1);
        createSlider(controls, "unsharp-kernel-controls", 1, 8, 1, 1);
        loadImage(unsharpening(original_img_data, 1, 1));
        document.getElementById("unsharp-amount-controls").addEventListener("input", function(){
            loadImage(unsharpening(original_img_data, parseFloat(this.value), parseInt(document.getElementById("unsharp-kernel-controls").value)));  
        });
        document.getElementById("unsharp-kernel-controls").addEventListener("change", function(){
            loadImage(unsharpening(original_img_data, parseFloat(document.getElementById("unsharp-amount-controls").value), parseInt(this.value)));  
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
            loadImage(weighted_avg_linear(original_img_data, parseInt(this.value)));  
        });
        loadImage(weighted_avg_linear(original_img_data, 1));  
        
    });
    parent.appendChild(weight_avg_lin);

    let gaussian_dev = document.createElement("div");
    gaussian_dev.class = "button-function";
    gaussian_dev.innerText = "Gaussian deviation";
    gaussian_dev.addEventListener("click", function(){
        clear(controls);
        createSlider(controls, "gaussian-deviation-controls-deviation",0, max_gaussian, 1, 0);
        document.getElementById("gaussian-deviation-controls-deviation").addEventListener("change", function(){
            console.log(parseFloat(this.value));
            loadImage(gaussian_blur(original_img_data, parseFloat(this.value)));
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
            loadImage(modulus(original_img_data, parseInt(this.value)));
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
            loadImage(gamma(original_img_data, parseFloat(this.value)));
        });
    });
    parent.appendChild(gam);
    
}

function sobel_change()
{
    if(document.querySelector('input[name="type"]:checked') === null) return 0;
    let check = document.querySelector('input[name="type"]:checked').value;
    if(check == "all")
        loadImage(sobel(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "x")
        loadImage(sobel_x(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
                        document.getElementById("sobel-controls-color-ok").checked, parseInt(document.getElementById("sobel-controls-threshold").value))); 
    else if(check == "y")
        loadImage(sobel_y(original_img_data, document.getElementById("sobel-controls-min-color").value, document.getElementById("sobel-controls-max-color").value, 
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
