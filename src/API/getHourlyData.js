import { fetchWeather } from "./weatherData";
import { nthNumber } from "../apiFunctions";
// export function getHourlyData(data, weatherBoolean, currDay) {
//     let hourlyTempStart = data.forecast.forecastday[currDay].hour;
//     let hourlyObject = {};
//     let hourlyTempArray = [];
//     let hourlyTimeArray = [];
//     for (let i = 0; i < hourlyTempStart.length; i++) {
//         let hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart[i].temp_f;
//         let hourlyTime = new Date(hourlyTempStart[i].time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
//         // console.log(hourlyTime);
//         // hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart.temp_f;
//         hourlyTempArray.push(hourlyTemp);
//         hourlyTimeArray.push(hourlyTime);
//     }

//     hourlyObject["temp"] = hourlyTempArray;
//     hourlyObject["time"] = hourlyTimeArray;
//     hourlyObject["day"] = currDay;
//     let hourlyDate = new Date(data.forecast.forecastday[currDay].date).toLocaleDateString("en-US", { month: "long", day: "numeric" });
//     hourlyObject["date"] = hourlyDate;
//     console.log(hourlyObject);
//     // console.log(hourlyTemp);
//     // let hourlyTemp = weatherBoolean ? hourlyTempStart.day.maxtemp_c : hourlyTempStart.day.maxtemp_f;
//     // console.log(hourlyTempStart);
//     // const data = await fetchWeather()
// }

export function getHourlyData(data, weatherBoolean, currDay) {
    let hourlyTempStart = data.forecast.forecastday[currDay].hour;
    let hourlyObject = {};
    let hourlyTempArray = [];
    let hourlyTimeArray = [];
    let hourlyIconArray = [];
    let currentTempUnit;
    for (let i = 0; i < hourlyTempStart.length; i++) {
        let hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart[i].temp_f;
        currentTempUnit = weatherBoolean ? "\xB0C" : "\xB0F";
        let hourlyTime = new Date(hourlyTempStart[i].time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        let hourlyIcon = hourlyTempStart[i].condition.icon;
        hourlyTempArray.push(Math.floor(hourlyTemp) + " " + currentTempUnit);
        hourlyTimeArray.push(hourlyTime);
        hourlyIconArray.push(hourlyIcon);
    }

    hourlyObject["temp"] = hourlyTempArray;
    hourlyObject["time"] = hourlyTimeArray;
    hourlyObject["icon"] = hourlyIconArray;
    hourlyObject["day"] = currDay;
    let hourlyDate = data.forecast.forecastday[currDay].date;
    let dateFormatted = new Date(hourlyDate).toDateString({ month: "long", day: "numeric" });
    hourlyObject["date"] = hourlyDate;
    console.log(hourlyObject);
    return hourlyObject;
}

export function displayHourlyData(hourlyData, currentDay) {
    const hourlyContainer = document.querySelector(".hourly-container");

    // Clear the existing hourly data
    hourlyContainer.innerHTML = "";

    // Create a flex container to hold the hourly data items
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("hourly-flex-container");
    document.querySelector("#hourlyHeading").textContent = `${currentDay}, ${hourlyData.date}`;

    // Loop through the hourlyData and create divs to display the data
    for (let i = 0; i < hourlyData.temp.length; i++) {
        const hourlyTemp = hourlyData.temp[i];
        const hourlyTime = hourlyData.time[i];
        const hourlyIcon = hourlyData.icon[i];
        const hourlyDiv = document.createElement("div");
        hourlyDiv.classList.add("hourly-data-item");

        const iconContainer = document.createElement("img");
        iconContainer.src = hourlyIcon;
        const timeParagraph = document.createElement("p");
        timeParagraph.textContent = hourlyTime;

        const tempParagraph = document.createElement("p");
        tempParagraph.textContent = hourlyTemp;

        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");

        timeContainer.appendChild(timeParagraph);

        // Append a space between the time and "AM/PM" indicator
        timeContainer.appendChild(document.createTextNode(" "));

        hourlyDiv.appendChild(iconContainer);
        hourlyDiv.appendChild(timeContainer);
        hourlyDiv.appendChild(tempParagraph);

        flexContainer.appendChild(hourlyDiv);
    }

    hourlyContainer.appendChild(flexContainer);
}
