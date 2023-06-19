let ultra_computed_gaussian_blur = {};

function gaussian_blur(img_data, deviation)
{
    console.log(img_data);
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