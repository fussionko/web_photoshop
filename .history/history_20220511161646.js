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

        for(let i = 0; i < buttons.length; i++)
            this.classList.remove("selected");

        loadImageHistory();
    })
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