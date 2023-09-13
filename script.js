let startTime = null
let pauseTime = new Date(0).getTime()
let currentTime = null
let timer = null
let pauseState = false
let remindTime = [0, 5, 0, 5 * 60 * 1000]
let remindCounter = 1
let isPlayingSound = false
let isAdjustingRemindTime = false

let clockElement = document.getElementById('clock')
let startPauseResumeButton = document.getElementById('startPauseResumeButton')
let remindTimerContainer = document.getElementById('remindTimerContainer')
let adjustRemindTimerContainer = document.getElementById('adjustRemindTimerContainer')
let hoursElement = document.getElementById('hours')
let minutesElement = document.getElementById('minutes')
let secondsElement = document.getElementById('seconds')

function startClock() {
    startTime = new Date().getTime()
    timer = setInterval(updateClock, 100);

    startPauseResumeButton.textContent = 'Pause'

    if (isAdjustingRemindTime) {
        remindTimerContainer.style.display = 'block'
        adjustRemindTimerContainer.style.display = 'none'
    }
}

function updateClock() {
    // Create a new Date object to get the current time
    currentTime = new Date().getTime() - startTime + pauseTime;

    // Get the current hours, minutes, and seconds
    let miliseconds = Math.floor(currentTime % 1000).toString().padStart(3, '0');
    let seconds = Math.floor(currentTime / 1000 % 60).toString().padStart(2, '0');
    let minutes = Math.floor(currentTime / 1000 / 60 % 60).toString().padStart(2, '0');
    let hours = Math.floor(currentTime / 1000 / 60 / 60 % 60).toString().padStart(2, '0');
    
    // Display the current time
    clockElement.textContent = hours + ':' + minutes + ':' + seconds + ':' + miliseconds;
    document.title = clockElement.textContent

    if (currentTime > remindTime[3] & !isPlayingSound & remindTime[3] > 0) {
        isPlayingSound = true

        const audio = new Audio('sound.mp4');
        
        audio.play();

        remindTime[3] = ((hoursElement.value * 60 * 60 * 1000) +
                        (minutesElement.value * 60 * 1000) +
                        (secondsElement.value * 1000)) * ++remindCounter

        audio.addEventListener('ended', function() {
            audio.pause();
            isPlayingSound = false
        });
    }
}

function pauseResumeClock() {
    if (pauseState) {
        startClock()
        startPauseResumeButton.textContent = 'Pause'
    } else {
        clearInterval(timer)
        pauseTime = currentTime
        startPauseResumeButton.textContent = 'Continue'
        document.title = 'Exercise Timer'
    }
    pauseState = !pauseState
}

function resetClock() {
    pauseState = true
    clearInterval(timer)
    pauseTime = new Date(0).getTime()
    clockElement.textContent = '00:00:00:000'
    remindTime[3] = 5 * 60 * 1000
    remindCounter = 1
    isPlayingSound = false
    document.title = 'Exercise Timer'
    startPauseResumeButton.textContent = 'Start'
}

function adjustRemindTime() {
    resetClock()

    remindTimerContainer.style.display = 'none'
    adjustRemindTimerContainer.style.display = 'block'

    hoursElement.value = remindTime[0]
    minutesElement.value = remindTime[1]
    secondsElement.value = remindTime[2]

    isAdjustingRemindTime = true
}

function saveRemindTime() {
    let remindTimeElement = document.getElementById('remindTime')

    remindTimeElement.textContent = (hoursElement.value < 10 ? '0' : '') + hours.value + 
                            ':' + (minutesElement.value < 10 ? '0' : '') + minutes.value + 
                            ':' + (secondsElement.value < 10 ? '0' : '') + seconds.value

    remindTimerContainer.style.display = 'block'
    adjustRemindTimerContainer.style.display = 'none'

    remindTime[0] = hoursElement.value
    remindTime[1] = minutesElement.value
    remindTime[2] = secondsElement.value
    remindTime[3] = (hoursElement.value * 60 * 60 * 1000) +
                    (minutesElement.value * 60 * 1000) +
                    (secondsElement.value * 1000)
}

hoursElement.addEventListener('input', () => {
    if (parseInt(hoursElement.value) > 99) {
        hoursElement.value = '99';
    } else if (parseInt(hoursElement.value) < 0) {
        hoursElement.value = '0';
    }
});

minutesElement.addEventListener('input', () => {
    if (parseInt(minutesElement.value) > 59) {
        minutesElement.value = '59';
    } else if (parseInt(minutesElement.value) < 0) {
        minutesElement.value = '0';
    }
});

secondsElement.addEventListener('input', () => {
    if (parseInt(secondsElement.value) > 59) {
        secondsElement.value = '59';
    } else if (parseInt(secondsElement.value) < 0) {
        secondsElement.value = '0';
    }
});

resetClock()