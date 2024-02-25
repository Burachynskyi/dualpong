//змінні документу
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let canvasText = document.getElementById('canvas-text')

//кольори канвасу
let nightColor = 'rgb(22, 69, 81)'
let dayColor = 'rgb(213, 229, 222)'

//ширина квадратиків і кружків
let rectSide = 25
let circleSide = 25

//кількість квадратиків на одну сторону канвасу, загальна кількість, половина від загальної кількості
let sideCount = canvas.clientWidth / rectSide
let allRect = sideCount * sideCount
let dayRect = allRect / 2

//змінна таймеру і частота оновлення кадрів
let innerTimer = null
let FPS = 60

//крок руху кружків по суміжним осям
const STEP = 10

//масив квадратиків
let rectArray = new Array()


//об'єкти кружків, позиція і напрямок руху (вгору/не вгору, вліво/не вліво) генеруються випадково
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

//масив кружків (для зручності)
let circleArray = [dayCircle, nightCircle]

//=============================================================================

launch()

//=============================================================================

//функція запуску алгоритму
function launch(){
    //ініціалізація масиву квадратиків
    setRectArray()

    //перше оновлення екрану (прорисовка)
    draw()

    //встановлення напису лічильника квадратиків
    setText(dayRect, allRect)

    //запуск таймера, який запускатиме функцію руху 60 разів за секунду
    innerTimer = setInterval(Move, 1000 / FPS)
}

//функція руху
function Move(){
    //цикл, що перелічує обидва кружки
    for(let i = 0; i < 2; i++){
        /*Комплекс умов, які оброблюють колізію кружків. Якщо кружок доторкується до меж канвасу, то напрямок руху змінюється на протилежний,
        якщо кружок доторкується до квадрата свого кольору, то відбувається те саме, але колір дотичного квадрату змінюється.
        Кружок може рухатися лише в 4-х напрямках, які визначаються двома булевими зміннами, які визначають дві суміжні осі руху. Наприклад:
        вверх і вліво - це значить рух у верхній лівий кут, і таким чином зміна однієї суміжної осі імітує дзеркальне відбивання під кутом 90 градусів, а двох - повну зміну напряму на 180 градусів*/
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

        //комплекс умов, які, залежно від визначених напрямів, змінюють положення кружків
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

    //прорисовка кадру
    draw()
}

//функція оновлення текстового лічильника кількості квадратів на канвасі
function setText(dayRect, allRect){
    canvasText.textContent = `day ${dayRect} | night ${allRect - dayRect}`
}

//функція прорисовки 
function draw(){
    //прорисовка квадратів, відповідно до їхньої позиції та кольору
    rectArray.forEach((element) => {
        ctx.fillStyle = element.color
        ctx.fillRect(element.left, element.top, rectSide, rectSide)
    })

    //фпрорисовки кружків, відповідно до визначених параметрів
    for(let i = 0; i < 2; i++){
        ctx.beginPath();
        ctx.arc(circleArray[i].left, circleArray[i].top, circleArray[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = circleArray[i].color
        ctx.fill()
        ctx.strokeStyle = circleArray[i].color
        ctx.stroke();
        ctx.closePath()
    }

    //перевірка на завершення гри, і у разі закінчення - зупинка таймеру й оновлення текстового напису під канвасом
    if(dayRect == 0 || dayRect == allRect){
        clearTimeout(innerTimer)
        innerTimer = null

        canvasText.textContent = `${(dayRect <= 0 ? 'Night' : 'Day')} won`
    }else{
        //звичайне оновлення текстового напису під канвасом
        setText(dayRect, allRect)
    }
}

//ініціалізація масиву квадратиків на канвасі, кожен квадрат - це об'єкт, що зберігає позицію квадрата і його колір
function setRectArray(){
    for(let i = 0; i < sideCount; i++){
        for(let y = 0; y < sideCount; y++){
            let obj = {
                color: dayColor,
                left: y * rectSide,
                top: i * rectSide
            }

            //умова, що визначає, які з квадратиків розташовані праворуч - і змінює їхній колір на відповідний
            if(y >= sideCount / 2){
                obj.color = nightColor
            }

            rectArray.push(obj)
        }
    }
}

//функція, що дозволяє звертатися до лінійного масиву, як до двовимірного
function getRect(i, y){
    return rectArray[i * sideCount + y]
}

//функція, що повертає значення протилежного кольору, а також фіксує кількість квадратиків одного з кольорів
//себто якщо колір змінюється на протилежний, то в контексті функції Move() це одначає зміну пропорції квадратиків двох кольорів
function gerReverseColor(color){
    if(color == dayColor){
        dayRect -= 1
        return nightColor
    }else{
        dayRect += 1
        return dayColor
    }
}
