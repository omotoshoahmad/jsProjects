// global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust");
const sliderContainer = document.querySelectorAll(".sliders");
const closeAdjustments = document.querySelectorAll(".close-adjustment");

// intial colors
let initialColors;

// Event Listeners
sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});
colorDivs.forEach((div,index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    })
})
currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex);
    })
});
popup.addEventListener('transitionend', () =>{
    const popupBox = popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
})
adjustButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel (index);
    })
});
closeAdjustments.forEach((button,index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index);
    })
})

// Functions
function generateHex () {
    // const letters = "0123456789ABCDEF";
    // let hash ="#";

    // for (i=0; i<6; i++){
    //     hash += letters[Math.floor(Math.random() * 16)];
    // }
    // return hash;
    
    // USING CHROMA.JS
    const hexColor = chroma.random();
    return hexColor;
};
console.log(generateHex());

function randomColors (){
    initialColors = [];
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // add color to background
        div.style.backgroundColor = randomColor;
        hexText.innerHTML = randomColor;
        initialColors.push(chroma(randomColor).hex());
        // check for contrast
        checkTextContrast(randomColor, hexText);
        
        // Initialize Colorised sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input")
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        // colorize sliders
        colorizeSliders(color, hue, brightness, saturation);
    });

    // reset Inputs
    resetInputs();

};
randomColors();
function checkTextContrast (color, text){
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = "black";
    }
    else{
        text.style.color = "white";
    }
};
function colorizeSliders(color, hue, brightness, saturation) {
    // scale saturation
    const noSat = color.set('hsl.s',0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //Scale Brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);

    // update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;

    // brightness backgroundColor
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0)},${scaleBright(0.5)} ,${scaleBright(1)})`;
    
    // hue.style.backgroundColor
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
};

function hslControls (e) {

    const index =
        e.target.getAttribute ("data-bright") ||
        e.target.getAttribute ("data-sat") ||
        e.target.getAttribute ("data-hue");

    console.log(index);

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    console.log(sliders);

    // const bgColor = colorDivs[index].querySelector("h2").innerText;
    const bgColor = initialColors[index];

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;

    // colorize the slider background to change color according to the colored divs
    colorizeSliders (color, hue, brightness, saturation);
};

// update text UI
function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    textHex.innerText = color;
    const icons = activeDiv.querySelectorAll(".controls button");
    
    // check contrast
    checkTextContrast(color, textHex);
    for (icon of icons){
        checkTextContrast(color, icon);
    }

};
function resetInputs() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider => {
        if (slider.name === "hue"){
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
            // console.log(hueValue);
        };
        if (slider.name === "brightness"){
            const brightColor = initialColors[slider.getAttribute("data-bright")];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        };
        if (slider.name === "saturation"){
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue* 100) / 100;
        };
    })
};
function copyToClipboard (hex) {
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // pop up animation
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}
function openAdjustmentPanel(index){
    sliderContainer[index].classList.toggle("active");
};
function closeAdjustmentPanel(index){
    sliderContainer[index].classList.remove("active");
}

// function copyToClipboard(hex) {
//   const text = typeof hex === 'string' ? hex : hex.innerText;

//   // Try the modern Clipboard API
//   navigator.clipboard.writeText(text)
//     .then(() => {
//       // pop-up animation
//       const popupBox = popup.children[0];
//       popup.classList.add("active");
//       popupBox.classList.add("active");
//       console.log("Copied:", text);
//     })
//     .catch(err => {
//       console.error("Clipboard copy failed:", err);
//     });
// }

// hslControls ();
// console.log(colorDivs);