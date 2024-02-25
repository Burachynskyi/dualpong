let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let canvasText = document.getElementById('canvas-text')

let nightColor = 'rgb(22, 69, 81)'
let dayColor = 'rgb(213, 229, 222)'

let rectSide = 25
let circleSide = 25

let sideCount = canvas.clientWidth / rectSide
let allRect = sideCount * sideCount
let dayRect = allRect / 2

let innerTimer = null
let FPS = 60

const STEP = 10

let rectArray = new Array()


let nightCircle = {
    left: Math.random() * (sideCount - circleSide) + circleSide / 2,
    top: Math.random() * (canvas.clientHeight - circleSide) + circleSide / 2,
    radius: circleSide / 2,
    color: nightColor,
    leftStream: (Math.random() < 0.5 ? true : false),
    topStream: (Math.random() < 0.5 ? true : false)
}

let dayCircle = {
    left: Math.random() * (canvas.clientWidth / 2 - circleSide) + circleSide / 2 + canvas.clientWidth / 2,
    top: Math.random() * (canvas.clientHeight - circleSide) + circleSide / 2,
    radius: circleSide / 2,
    color: dayColor,
    leftStream: (Math.random() < 0.5 ? true : false),
    topStream: (Math.random() < 0.5 ? true : false)
}

let circleArray = [dayCircle, nightCircle]

//=============================================================================

launch()

//=============================================================================

function launch(){
    setRectArray()
    draw()

    setText(dayRect, allRect)
    innerTimer = setInterval(Move, 1000 / FPS)
}

function Move(){
    for(let i = 0; i < 2; i++){
        if(circleArray[i].topStream){
            let rect = getRect(parseInt((circleArray[i].top - circleArray[i].radius) / rectSide), parseInt(circleArray[i].left / rectSide))
            if(circleArray[i].top - circleArray[i].radius <= 0){
                circleArray[i].topStream = false
            }else if(rect.color == circleArray[i].color){
                circleArray[i].topStream = false
                rect.color = gerReverseColor(rect.color)
            }
        }else{
            let rect = getRect(parseInt((circleArray[i].top + circleArray[i].radius) / rectSide), parseInt(circleArray[i].left / rectSide))
            if(circleArray[i].top + circleArray[i].radius >= canvas.clientHeight){
                circleArray[i].topStream = true
            }else if(rect.color == circleArray[i].color){
                circleArray[i].topStream = true
                rect.color = gerReverseColor(rect.color)
            }
        }

        if(circleArray[i].leftStream){
            let rect = getRect(parseInt(circleArray[i].top / rectSide), parseInt((circleArray[i].left - circleArray[i].radius) / rectSide))
            if(circleArray[i].left - circleArray[i].radius <= 0){
                circleArray[i].leftStream = false
            }else if(rect.color == circleArray[i].color){  
                circleArray[i].leftStream = false
                rect.color = gerReverseColor(rect.color)
            }
        }else{
            let rect = getRect(parseInt(circleArray[i].top / rectSide), parseInt((circleArray[i].left + circleArray[i].radius) / rectSide))
            if(circleArray[i].left + circleArray[i].radius >= canvas.clientWidth){
                circleArray[i].leftStream = true
            }else if(rect.color == circleArray[i].color){
                circleArray[i].leftStream = true
                rect.color = gerReverseColor(rect.color)
            }
        }

        if(circleArray[i].topStream){
            circleArray[i].top = circleArray[i].top - STEP
        }else{
            circleArray[i].top = circleArray[i].top + STEP
        }

        if(circleArray[i].leftStream){
            circleArray[i].left = circleArray[i].left - STEP
        }else{
            circleArray[i].left = circleArray[i].left + STEP
        }
    }

    draw()
}

function setText(dayRect, allRect){
    canvasText.textContent = `day ${dayRect} | night ${allRect - dayRect}`
}

function draw(){
    rectArray.forEach((element) => {
        ctx.fillStyle = element.color
        ctx.fillRect(element.left, element.top, rectSide, rectSide)
    })

    for(let i = 0; i < 2; i++){
        ctx.beginPath();
        ctx.arc(circleArray[i].left, circleArray[i].top, circleArray[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = circleArray[i].color
        ctx.fill()
        ctx.strokeStyle = circleArray[i].color
        ctx.stroke();
        ctx.closePath()
    }

    if(dayRect == 0 || dayRect == allRect){
        clearTimeout(innerTimer)
        innerTimer = null

        canvasText.textContent = `${(dayRect <= 0 ? 'Night' : 'Day')} won`
    }else{
        setText(dayRect, allRect)
    }
}


function setRectArray(){
    for(let i = 0; i < sideCount; i++){
        for(let y = 0; y < sideCount; y++){
            let obj = {
                color: dayColor,
                left: y * rectSide,
                top: i * rectSide
            }

            if(y >= sideCount / 2){
                obj.color = nightColor
            }

            rectArray.push(obj)
        }
    }
}

function getRect(i, y){
    return rectArray[i * sideCount + y]
}

function gerReverseColor(color){
    if(color == dayColor){
        dayRect -= 1
        return nightColor
    }else{
        dayRect += 1
        return dayColor
    }
}
