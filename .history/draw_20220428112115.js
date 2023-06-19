function loadDraw()
{
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
}

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