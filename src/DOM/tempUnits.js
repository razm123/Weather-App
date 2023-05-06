import { getData } from "../apiFunctions";
import { fetchWeather } from "../API/weatherData";
export function toggleUnits() {
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean")) || false;
    localStorage.setItem("weatherBoolean", weatherBoolean);

    const weatherInput = document.getElementById("weatherUnits");
    weatherInput.addEventListener("click", async () => {
        const cityName = document.querySelector(".cityName");
        const data = await fetchWeather(cityName.textContent, "forecast");

        if (weatherInput.checked) {
            weatherBoolean = true;
            localStorage.setItem("weatherBoolean", weatherBoolean);
            getData(data, weatherBoolean);
        } else {
            weatherBoolean = false;
            localStorage.setItem("weatherBoolean", weatherBoolean);
            getData(data, weatherBoolean);
        }
    });
    console.log(weatherBoolean);
    return weatherBoolean;
}

export function renderDOM() {
    const suggBox = document.querySelector(".autocom-box");
    suggBox.classList.add("hidden");
    let weatherBoolean = JSON.parse(localStorage.getItem("weatherBoolean"));
    let weatherUnits = document.getElementById("weatherUnits");
    weatherUnits.checked = weatherBoolean;
    return weatherBoolean;
}
