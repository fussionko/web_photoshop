function loadDraw()
{
    
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