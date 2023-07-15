import { fetchWeather } from "./weatherData";
import { nthNumber } from "./apiFunctions";

// Function to get hourly data from the weather forecast
export function getHourlyData(data, weatherBoolean, currDay) {
    let hourlyTempStart = data.forecast.forecastday[currDay].hour;
    let hourlyObject = {};
    let hourlyTempArray = [];
    let hourlyTimeArray = [];
    let hourlyIconArray = [];
    let hourlyConditionArray = [];
    let currentTempUnit;

    // Loop through the hourly data and extract relevant information
    for (let i = 0; i < hourlyTempStart.length; i++) {
        let hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart[i].temp_f;
        currentTempUnit = weatherBoolean ? "\xB0C" : "\xB0F";
        let hourlyTime = new Date(hourlyTempStart[i].time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        let hourlyIcon = hourlyTempStart[i].condition.icon;
        let hourlycondition = hourlyTempStart[i].condition.text;

        hourlyTempArray.push(Math.floor(hourlyTemp) + " " + currentTempUnit);
        hourlyTimeArray.push(hourlyTime);
        hourlyIconArray.push(hourlyIcon);
        hourlyConditionArray.push(hourlycondition);
    }

    // Store the extracted data in an hourlyObject
    hourlyObject["temp"] = hourlyTempArray;
    hourlyObject["time"] = hourlyTimeArray;
    hourlyObject["icon"] = hourlyIconArray;
    hourlyObject["condition"] = hourlyConditionArray;
    hourlyObject["day"] = currDay;
    let hourlyDate = data.forecast.forecastday[currDay].date;
    let dateFormatted = new Date(hourlyDate).toDateString({ month: "long", day: "numeric" });
    hourlyObject["date"] = hourlyDate;

    return hourlyObject;
}

// Function to display hourly data on the webpage
export function displayHourlyData(hourlyData, currentDay, dataIndex) {
    if (dataIndex === 0) {
        document.querySelector("#hourlyHeading").textContent = `Today, ${hourlyData.date}`;
    } else {
        document.querySelector("#hourlyHeading").textContent = `${currentDay}, ${hourlyData.date}`;
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let hourlyTimeHourArray = [];
    hourlyTimeHourArray.push(hourlyData.time);

    // Call a helper function to create divs and display the hourly data
    if (dataIndex === 0) {
        hourlyDataDivs(hourlyData, currentHour, 24);
    } else {
        hourlyDataDivs(hourlyData, 0, 24);
    }
}

// Function to format time as HH:MM
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Helper function to create divs for hourly data and display it on the webpage
function hourlyDataDivs(hourlyData, startTime, endTime) {
    const hourlyContainer = document.querySelector(".hourly-container");

    // Clear the existing hourly data
    hourlyContainer.innerHTML = "";

    // Create a flex container to hold the hourly data items
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("hourly-flex-container");

    // Loop through the hourly data and create divs to display the data
    for (let i = startTime; i < endTime; i++) {
        const hourlyTemp = hourlyData.temp[i];
        const hourlyTime = hourlyData.time[i];
        const hourlyIcon = hourlyData.icon[i];

        const hourlyDiv = document.createElement("div");
        hourlyDiv.classList.add("hourly-data-item");

        const iconContainer = document.createElement("div");
        iconContainer.classList.add("image-container");

        const icon = document.createElement("img");
        icon.src = hourlyIcon;
        icon.alt = hourlyData.condition[i];

        const timeParagraph = document.createElement("p");
        timeParagraph.textContent = hourlyTime;

        const tempParagraph = document.createElement("p");
        tempParagraph.textContent = hourlyTemp;
        tempParagraph.classList.add("hourlyTemp");

        const timeContainer = document.createElement("div");
        timeContainer.classList.add("time-container");

        iconContainer.append(icon);
        timeContainer.appendChild(timeParagraph);

        // Append a space between the time and "AM/PM" indicator
        timeContainer.appendChild(document.createTextNode(" "));

        hourlyDiv.appendChild(timeContainer);
        hourlyDiv.appendChild(iconContainer);
        hourlyDiv.appendChild(tempParagraph);

        flexContainer.appendChild(hourlyDiv);
        hourlyContainer.appendChild(flexContainer);
    }
}
