async function fetchWeather(city) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b35580b5b878478fba522539232904&q=${city}&days=3`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        getData(data);
    } catch (err) {
        console.log("there was an error " + err);
        const div = document.querySelector(".jsonDATA");
        div.textContent = "Location not found";
        // const img = document.querySelector("img");
        // img.src = "";
    }
}

function getData(data) {
    const div = document.querySelector(".jsonDATA");
    div.textContent = JSON.stringify(data);
    const currentImg = data.current.condition.icon;
    const img = document.querySelector("img");
    img.src = currentImg;
    console.log(data);
    currentWeather(data);
    printTempData(data, 0);
    printTempData(data, 1);
    printTempData(data, 2);

    // console.log(data.forecast.forecastday[0]);

    // const date = new Date(`${data["location"]["forecast"]["forecastday"][0]}`);
    // console.log(data)
    // console.log(dt);
}

function currentWeather(data) {
    const dayZero = printCurrentDay(data, 0);
    let last_updated = data.current.last_updated;
    let temp_c = data.current.temp_c;
    console.log(`day: ${dayZero}, last updated: ${last_updated}, temperature: ${temp_c}\xB0C`);
}

function printTempData(data, currentDayInt) {
    const dayString = printCurrentDay(data, currentDayInt);
    let min_temp_c = data.forecast.forecastday[currentDayInt].day.mintemp_c;
    let max_temp_c = data.forecast.forecastday[currentDayInt].day.maxtemp_c;
    let condition = data.forecast.forecastday[currentDayInt].day.condition.text;
    console.log(`day: ${dayString}, high temp: ${min_temp_c}\xB0C, low temp: ${max_temp_c}\xB0C, condition: ${condition}`);
}

function printCurrentDay(data, currentDayInt) {
    let currentDay = data.forecast.forecastday[currentDayInt].date;
    const zone = new Date().getTimezoneOffset() / 60;
    const dt = new Date(`${currentDay} GMT-${zone}`);
    const dayInt = dt.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"];
    // console.log(dayNames[dayInt]);
    const getDay = dayNames[dt.getDay()];
    const getMonth = monthNames[dt.getMonth()];
    const getMonthDay = dt.getDate();
    const getYear = dt.getFullYear();
    let getMonthDaySplit = String(getMonthDay).split("");
    // console.log(getMonthDaySplit.length);
    // let currentDate = dayCondition(getMonthDaySplit, getDay, getMonth, getMonthDay, getYear);
    let currentDate = `${getDay}, ${getMonth} ${getMonthDay}${nthNumber(getMonthDay)}, ${getYear}`;
    return currentDate;
}

// function getDayPrefix(getMonthDaySplit, getDay, getMonth, getMonthDay, getYear) {
//     let currentDate;
//     if (getMonthDaySplit.length === 1) {
//         if (getMonthDaySplit[0] === 1 || getMonthDaySplit[0] === "1") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}st, ${getYear}`;
//         } else if (getMonthDaySplit[0] === 2 || getMonthDaySplit[0] === "2") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}nd, ${getYear}`;
//         } else if (getMonthDaySplit[0] === 3 || getMonthDaySplit[0] === "3") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}rd, ${getYear}`;
//         } else {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}th, ${getYear}`;
//         }
//     } else {
//         if (getMonthDaySplit[1] === 1 || getMonthDaySplit[1] === "1") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}st, ${getYear}`;
//         } else if (getMonthDaySplit[1] === 2 || getMonthDaySplit[1] === "2") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}nd, ${getYear}`;
//         } else if (getMonthDaySplit[1] === 3 || getMonthDaySplit[1] === "3") {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}rd, ${getYear}`;
//         } else {
//             currentDate = `${getDay}, ${getMonth} ${getMonthDay}th, ${getYear}`;
//         }
//     }
//     return currentDate;
// }

const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export function runAPI() {
    const cityInput = document.getElementById("city");
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        fetchWeather(cityInput.value);
        document.querySelector("form").reset();
    });

    window.addEventListener("DOMContentLoaded", () => {
        fetchWeather("new york city");
    });
}
