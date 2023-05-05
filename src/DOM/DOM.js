import { fetchWeather } from "../API/weatherData";
export function currentWidget(data, currentTemp, tempUnit, feelslike, currentDay) {
    const cityName = document.querySelector(".cityName");

    const currentImgHtml = document.getElementById("current-img");
    const currentDate = document.getElementById("current-date");
    const currentTempHtml = document.getElementById("current-temp");
    const currentCondition = document.getElementById("current-condition");
    const currentFeelsLike = document.getElementById("current-feelslike");
    const lastUpdate = document.getElementById("last-updated");
    const currentImg = data.current.condition.icon;
    if (data.location.region != "") {
        cityName.textContent = data.location.name + ", " + data.location.region;
    } else {
        cityName.textContent = data.location.name + ", " + data.location.country;
    }

    currentImgHtml.src = currentImg;
    currentDate.textContent = currentDay;
    currentTempHtml.textContent = currentTemp + tempUnit;
    currentCondition.textContent = data.current.condition.text;
    currentFeelsLike.textContent = `Feels like: ${feelslike}${tempUnit}`;
    lastUpdate.textContent = data.current.last_updated;
}

export function highlights(humidityData) {
    const humidity = document.getElementById("humidityText");
    humidity.textContent = `${humidityData}%`;
}
