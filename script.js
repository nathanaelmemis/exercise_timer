// Contant variables
// An odd number is chosen to display different numbers.
const UPDATE_INTERVAL_MS = 107

/**
 * Audio object for playing the sound.
 * The trick for sound not playing when tab is inactive bug is to loop the sound with volume set to 0.
 */
const audio = new Audio('sound.mp4');
audio.volume = 0
audio.loop = true

/**
 *  Variables for tracking time elapsed.
 *  Why pauseTime? we cannot get the true elapsed time when we replace startTime with a new Date object.
 */ 
let startTime = null
let pauseTime = new Date(0).getTime()
let currentTime = null

/**
 * Variables for tracking the remind time.
 * [hours, minutes, seconds, total time in milliseconds]
 */
let remindTime = localStorage.getItem('remindTime') ? JSON.parse(localStorage.getItem('remindTime')) : {
    hours: 0,
    minutes: 5,
    seconds: 0,
    totalTimeMs: 5 * 60 * 1000
}

// Reference to the interval so we can clear it when clock is reset.
let intervalRef = null

// Flags for tracking the state of the clock.
let isPaused = true
let isAdjustingRemindTime = false

// DOM element for displaying the clock.
const clockElement = document.getElementById('clock')

// DOM element for displaying the remind time.
const remindTimerContainer = document.getElementById('remindTimerContainer')
const remindTimeElement = document.getElementById('remindTime')

// DOM elements for adjusting the remind time.
const adjustRemindTimerContainer = document.getElementById('adjustRemindTimerContainer')
const hoursElement = document.getElementById('hours')
const minutesElement = document.getElementById('minutes')
const secondsElement = document.getElementById('seconds')

// DOM elements that change color when the remind time is reached.
const body = document.querySelector('body')
const resetButton = document.querySelector('.resetButton')
const startPauseResumeButton = document.getElementById('startPauseResumeButton')

// Set initial remind time display.
remindTimeElement.textContent = (remindTime.hours < 10 ? '0' : '') + remindTime.hours + 
                            ':' + (remindTime.minutes < 10 ? '0' : '') + remindTime.minutes + 
                            ':' + (remindTime.seconds < 10 ? '0' : '') + remindTime.seconds

function startClock() {
    // Start audio loop with volume set to 0.
    audio.play()
    // Set the start time to the current time.
    startTime = new Date().getTime()
    // Update the clock every UPDATE_INTERVAL_MS milliseconds.
    intervalRef = setInterval(updateClock, UPDATE_INTERVAL_MS);

    // Update UI elements.
    startPauseResumeButton.textContent = 'Pause'
    // If adjusting remind time, reset back to the remind time container.
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

    // Check if the remind time is reached and play sound and change UI elements.
    if (currentTime > remindTime.totalTimeMs & remindTime.totalTimeMs > 0 & audio.volume == 0) {
        audio.currentTime = 0
        audio.volume = 1

        body.style.backgroundColor = '#d24141'
        startPauseResumeButton.style.backgroundColor = '#d24141'
        resetButton.style.backgroundColor = '#d24141'
    }
}

// Toggle the pause/play clock state.
function pauseResumeClock() {
    if (isPaused) {
        startClock()
        startPauseResumeButton.textContent = 'Pause'
    } else {
        clearInterval(intervalRef)
        pauseTime = currentTime
        startPauseResumeButton.textContent = 'Continue'
        document.title = 'Exercise Timer'
    }
    isPaused = !isPaused
}

function resetClock() {
    clearInterval(intervalRef)
    pauseTime = new Date(0).getTime()

    clockElement.textContent = '00:00:00:000'
    document.title = 'Exercise Timer'
    startPauseResumeButton.textContent = 'Start'

    isPaused = true
    audio.pause()
    audio.volume = 0    
    startPauseResumeButton.style.backgroundColor = '#202020'
    resetButton.style.backgroundColor = '#202020'
    body.style.backgroundColor = '#202020'
}

function adjustRemindTime() {
    resetClock()

    remindTimerContainer.style.display = 'none'
    adjustRemindTimerContainer.style.display = 'flex'

    hoursElement.value = remindTime.hours
    minutesElement.value = remindTime.minutes
    secondsElement.value = remindTime.seconds

    isAdjustingRemindTime = true
}

function saveRemindTime() {
    // Update the remind time display.
    remindTimeElement.textContent = (hoursElement.value < 10 ? '0' : '') + hoursElement.value + 
                            ':' + (minutesElement.value < 10 ? '0' : '') + minutesElement.value + 
                            ':' + (secondsElement.value < 10 ? '0' : '') + secondsElement.value

    // Update UI elements.
    remindTimerContainer.style.display = 'block'
    adjustRemindTimerContainer.style.display = 'none'

    // Update the remind time object.
    remindTime.hours = hoursElement.value
    remindTime.minutes = minutesElement.value
    remindTime.seconds = secondsElement.value
    remindTime.totalTimeMs = (hoursElement.value * 60 * 60 * 1000) +
                            (minutesElement.value * 60 * 1000) +
                            (secondsElement.value * 1000)

    // Save the remind time to local storage.
    localStorage.setItem('remindTime', JSON.stringify(remindTime))
}

// Input validation for adjusting the remind time.
function handleAdjustTimeInput(timeElement, upperTimeLimit) {
    if (parseInt(timeElement.value) > upperTimeLimit) {
        timeElement.value = upperTimeLimit.toString();
    } else if (timeElement.value.trim() === '') {
        timeElement.value = '0';
    } else if (parseInt(timeElement.value) < 0) {
        timeElement.value = '0';
    } else {
        timeElement.value = parseInt(timeElement.value).toString();
    }
}
hoursElement.addEventListener('input', () => handleAdjustTimeInput(hoursElement, 99));
minutesElement.addEventListener('input', () => handleAdjustTimeInput(minutesElement, 59));
secondsElement.addEventListener('input', () => handleAdjustTimeInput(secondsElement, 59));

// Initialize the clock.
resetClock()