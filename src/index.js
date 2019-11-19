window.URL = window.URL || window.webkitURL;

const ctx = document.getElementById("imgList").getContext("2d");
const errorField = document.getElementById("file-select-error");

let inputImageList = document.querySelectorAll("input[type=file]");
imageList = Array.prototype.slice.call(inputImageList);

let switchRadioList = document.querySelectorAll("input[type=radio]");
switchRadioList = Array.prototype.slice.call(switchRadioList);z

let form = document.getElementById("image-concat-form");

let renderMode = 'horizontal';
const windowLengthDivider = 6;
ctx.canvas.height = window.innerWidth / windowLengthDivider;
ctx.canvas.width = window.innerWidth;

let imageListInfo = [];



let listenImageList = function imageListAddListener() {
    imageList.forEach(function(img) {
        img.addEventListener('change', () => {
            img.addEventListener('load', pushImg(imageList), false);
        });
    });
}

listenImageList();


switchRadioList.some(function(renderModeChoise) {
    renderModeChoise.addEventListener('change', () => {
        renderModeSwitch(renderModeChoise);
    });
});



function pushImg(imageList) {
    imageList.forEach(function(img) {
        file = img.files;
        if (!file.length) {
            errorField.innerHTML = "<strong>Upload at least 2 files</strong>";
        } else {
            errorField.innerHTML = "";
            img = document.createElement("img");
            img.src = window.URL.createObjectURL(file[0]);
            imageListInfo.length = 0;

            img.addEventListener('load', collectImage.bind(null, img), false);
            img.addEventListener('load', handleImgSrc.bind(null, img), false);
        }
    });
};


function handleImgSrc() {
    window.URL.revokeObjectURL(this.src);
}


function renderModeSwitch(renderModeChoise) {
    let renderMode = renderModeChoise.value;

    switch (renderMode) {
        case 'horizontal':
            ctx.canvas.height = window.innerWidth / windowLengthDivider;
            ctx.canvas.width = window.innerWidth;
            break;
        case 'vertical':
            ctx.canvas.height = window.innerWidth;
            ctx.canvas.width = window.innerWidth / windowLengthDivider;
            break;
        default:
            alert('Произошла ошибка при смене режима отрисовки');
    }
}

function collectImage(img) {
    imageItem = new Object();

    imageItem.width = img.naturalWidth;
    imageItem.height = img.naturalHeight;
    imageItem.src = img.src;

    imageListInfo.push(imageItem);
    renderImageScaled(renderMode, imageListInfo);
}


function renderImageScaled(renderMode, imageListInfo) {
    let canvas = ctx.canvas;
    let xPosition = 0;
    let yPosition = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    imageListInfo.forEach(function(image) {
        let imgWidth = image.width;
        let imgHeight = image.height;

        img = new Image();
        img.src = image.src;

        let hRatio = canvas.width / imgWidth;
        let vRatio = canvas.height / imgHeight;
        let ratio = Math.min ( hRatio, vRatio );

        ctx.drawImage(img, 0, 0, imgWidth, imgHeight, xPosition, yPosition, imgWidth*ratio, imgHeight*ratio);

        switch (renderMode) {
            case 'horizontal':
                xPosition = xPosition + img.width*ratio;
                yPosition = 0;
                break;
            case 'vertical':
                yPosition = yPosition + img.height*ratio;
                xPosition = 0;
                break;
            default:
                alert('Произошла ошибка при смене режима отрисовки');
        }
    });
}
