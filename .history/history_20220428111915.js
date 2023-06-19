function loadHistory()
{
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
}