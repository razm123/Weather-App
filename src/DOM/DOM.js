import { fetchWeather } from "../API/weatherData";
export function currentWidget(data, currentTemp, tempUnit, feelslike, currentDay) {
    const cityName = document.querySelector(".cityName");

    const currentImgHtml = document.getElementById("current-img");
    const currentDate = document.getElementById("current-day");
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
    lastUpdate.textContent = `Updated: ${data.current.last_updated}`;
}

export function dailyWidget(data, dailyTempMin, dailyTempMax, tempUnit, currentDay, currentDayInt) {
    // const cityName = document.querySelector(".cityName");
    let currentDayString;
    switch (currentDayInt) {
        case 0:
            currentDayString = "one";
            break;
        case 1:
            currentDayString = "two";
            break;
        case 2:
            currentDayString = "three";
            break;
    }
    const currentImgHtml = document.getElementById(`current-img-${currentDayString}`);
    const currentDate = document.getElementById(`current-day-${currentDayString}`);
    const currentTempHtml = document.getElementById(`current-temp-${currentDayString}`);
    const currentCondition = document.getElementById(`current-condition-${currentDayString}`);
    const precipitation = document.getElementById(`precipitation-${currentDayString}`);
    const currentImg = data.forecast.forecastday[parseInt(currentDayInt)].day.condition.icon;

    currentImgHtml.src = currentImg;
    currentDate.textContent = currentDay;
    currentTempHtml.textContent = `${dailyTempMax}\xB0/${dailyTempMin}${tempUnit}`;
    precipitation.textContent = "Precipitation: " + data.forecast.forecastday[parseInt(currentDayInt)].day.daily_chance_of_rain + "%";
    currentCondition.textContent = data.forecast.forecastday[parseInt(currentDayInt)].day.condition.text;
}

export function highlights(humidityData, lowTemp, highTemp, tempUnit, windStatus, windUnit, sunrise, sunset) {
    const humidity = document.getElementById("humidityText");
    const lowTempText = document.getElementById("lowTempText");
    const highTempText = document.getElementById("highTempText");
    const windText = document.getElementById("windText");
    const sunriseText = document.getElementById("sunriseText");
    const sunsetText = document.getElementById("sunsetText");

    humidity.textContent = `${humidityData}%`;
    lowTempText.textContent = `${lowTemp}${tempUnit}`;
    highTempText.textContent = `${highTemp}${tempUnit}`;
    windText.textContent = `${windStatus} ${windUnit}`;
    sunriseText.textContent = sunrise;
    sunsetText.textContent = sunset;
}
