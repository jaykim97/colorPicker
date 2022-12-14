window.addEventListener("load", function () {
    reset()
    document.getElementById("add").addEventListener("click", function () {
        addColorPicker();
    });
    document.getElementById("reset").addEventListener("click", reset);
    document.getElementById("remove").addEventListener("click", removeColorPicker);
    document.getElementById("rainbow").addEventListener("click", rainbowGrad);
    document.getElementById("random").addEventListener("click", random);
    document.getElementById("referencePush").addEventListener("click", function () {
        applyTextReference()
    });
    document.getElementById("number").addEventListener("change", changeNumber)
});

//create color button
function addColorPicker(colorValue = "#ffffff") {
    // Create a file input
    var color = document.createElement("input");
    color.setAttribute("type", "color");
    color.setAttribute("name", "color"); // You may want to change this
    color.setAttribute("value", colorValue)
    // color.addEventListener("input", setGradient)
    var container = document.getElementById("container")
    container.appendChild(color);
    color.addEventListener("input", setGradient)
    //Append the div to the container div
    var container = document.getElementById("container")
    container.appendChild(color);
    setGradient();
    colorPickersToText();
}

//remove color picker button 
function removeColorPicker() {
    //select last color picker
    var colors = document.getElementById("container");
    colors.removeChild(colors.lastChild);
    setGradient();
    colorPickersToText();
}

function removeAllColorPickers() {
    var colors = document.getElementById("container");
    colors.innerHTML = '';
}

function setGradient() {
    var container = document.getElementById("container")
    var slider = document.getElementById("slider");
    var colors = [].slice.call(container.children)
    var style_pre = "linear-gradient(to right, "
    slider.style.background = listOfObjectTocolor(colors);
    colorPickersToText();
    changeNumber();
}

function listOfObjectTocolor(colorArr) {
    var style_pre = "linear-gradient(to right, "
    colorArr.forEach(element => style_pre = style_pre.concat(element.value, ", "))
    if (colorArr.length == 1) {
        style_pre = style_pre.concat("#ffffff", ", ")
    }
    style_pre = style_pre.slice(0, -2).concat(")");
    return style_pre
}

function listOfHexToColor(colorArr) {
    var style_pre = "linear-gradient(to right, "
    colorArr.forEach(element => style_pre = style_pre.concat(element, ", "))
    if (colorArr.length == 1) {
        style_pre = style_pre.concat("#ffffff", ", ")
    }
    style_pre = style_pre.slice(0, -2).concat(")");
    return style_pre
}

function listOfHexToColorPicker(colorArr) {
    colorArr.forEach(element => addColorPicker(element))
}

function rainbowGrad() {
    var rainbowColors = ["#FF0000", "#FF9900", "#D0DE21", "#4FDC4A", "#3FDAD8", "#2FC9E2", "#1C7FEE", "#5F15F2", "#B80CF8"]
    var slider = document.getElementById("slider");
    slider.style.background = listOfHexToColor(rainbowColors);
    removeAllColorPickers()
    listOfHexToColorPicker(rainbowColors)
    setTextReference(rainbowColors.join(", "))
}

function reset() {
    removeAllColorPickers()
    addColorPicker("#FF0000")
    addColorPicker()
    setGradient()
    setTextReference("#FF0000, #FFFFFF")
    document.getElementById("number").value = 9
    changeNumber()
}

function random() {
    removeAllColorPickers()
    colorStr = createRandomColors()
    colorArr = colorStr.split(", ")
    console.log(colorArr)
    colorArr.forEach(ele => addColorPicker(ele))
    setGradient()
    setTextReference(colorStr)
    document.getElementById("number").value = 9
    changeNumber()

}

function createRandomColors() {
    var clrStr = ""
    for (let i = 0; i < rnum(2, 9); i++) {
        var rgba = [rnum(), rnum(), rnum()]
        clrStr = clrStr.concat(toHex(rgba), ", ")
    }
    return clrStr.slice(0, -2).toUpperCase();
}

function rnum(min = 0, max = 255) {
    return Math.floor((Math.random() * max) + min);
}

function setTextReference(colorArrText) {
    var reference = document.getElementById("reference")
    reference.value = colorArrText.toUpperCase();
}

function applyTextReference() {
    var reference = document.getElementById("reference")
    var colorText = reference.value.split(", ")
    removeAllColorPickers()
    listOfHexToColorPicker(colorText)
    var slider = document.getElementById("slider");
    slider.style.background = listOfHexToColor(colorText)
}

function colorPickersToText() {
    var reference = document.getElementById("reference")
    var container = document.getElementById("container")
    var colors = [].slice.call(container.children)
    var style_pre = ""
    colors.forEach(element => style_pre = style_pre.concat(element.value, ", "))
    reference.value = style_pre.slice(0, -2).toUpperCase();
}

function changeNumber() {
    var num = document.getElementById("number").value
    var increment = Math.round(100 / num)
    var slider = document.getElementById("slider");
    var color = slider.style.getPropertyValue("background").slice(43, -20).split('),');
    var colorArr = []
    color.forEach(ele => colorArr.push([0, ele.replace(/[^\d. ,-]/g, '').split(",")]))
    var colorSpread = 100 / (colorArr.length - 1)
    for (var i = 0; i < colorArr.length - 1; i++) {
        colorArr[i][0] = i * colorSpread
    }
    colorArr[colorArr.length - 1][0] = 100
    var gradResult = []
    for (var ind = 0; ind < num; ind++) {
        gradResult.push(gradientSearch(colorArr, colorSpread, ind * increment))
    }
    createResultsDark(gradResult)
    createResultsLight(gradResult)
}


function gradientSearch(colorArr, colorSpread, position) {
    var i = 0
    var left_x = 0
    var right_x = colorSpread
    for (right_x; right_x <= position; right_x += colorSpread) {
        i += 1
        left_x = right_x
    }

    var left_color = colorArr[i][1]
    var right_color = colorArr[i + 1][1]
    var diff = right_x - left_x
    var left_weight = Math.abs(right_x - position) / diff
    var right_weight = Math.abs(position - left_x) / diff
    var rgb = [Math.round(left_color[0] * left_weight + right_color[0] * right_weight),
    Math.round(left_color[1] * left_weight + right_color[1] * right_weight),
    Math.round(left_color[2] * left_weight + right_color[2] * right_weight)]
    return rgb;
}

function createResultsDark(gradResult) {
    var results = document.getElementById("dark_reference")
    results.innerHTML = '';
    gradResult.forEach(ele => createResult(ele, results))
}

function createResultsLight(gradResult) {
    var results = document.getElementById("light_reference")
    results.innerHTML = '';
    gradResult.forEach(ele => createResult(ele, results))
}

function createResult(color, results) {
    var res = document.createElement("div");
    var style_txt = "background-color: " + toHex(color) + ";"
    res.setAttribute("class", "result")
    res.setAttribute("style", style_txt)
    res.innerHTML = toHex(color).toUpperCase()
    res.addEventListener("click", function () {
        CopyToClipboard(res)
    })
    results.appendChild(res)
}

function CopyToClipboard(element) {
    navigator.clipboard.writeText(element.innerHTML);
    ref = element.innerHTML
    element.innerHTML = "COPIED"
    setTimeout(() => {
        element.innerHTML = ref;
    }, "500")

}

function toHex(color) {
    return "#" + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1);
}