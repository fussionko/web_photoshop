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