import { fetchWeather } from "./weatherData";
import { nthNumber } from "../apiFunctions";
export function getHourlyData(data, weatherBoolean, currDay) {
    let hourlyTempStart = data.forecast.forecastday[currDay].hour;
    let hourlyObject = {};
    let hourlyTempArray = [];
    let hourlyTimeArray = [];
    for (let i = 0; i < hourlyTempStart.length; i++) {
        let hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart[i].temp_f;
        let hourlyTime = new Date(hourlyTempStart[i].time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        // console.log(hourlyTime);
        // hourlyTemp = weatherBoolean ? hourlyTempStart[i].temp_c : hourlyTempStart.temp_f;
        hourlyTempArray.push(hourlyTemp);
        hourlyTimeArray.push(hourlyTime);
    }

    hourlyObject["temp"] = hourlyTempArray;
    hourlyObject["time"] = hourlyTimeArray;
    hourlyObject["day"] = currDay;
    let hourlyDate = new Date(data.forecast.forecastday[currDay].date).toLocaleDateString("en-US", { month: "long", day: "numeric" });
    hourlyObject["date"] = hourlyDate;
    console.log(hourlyObject);
    // console.log(hourlyTemp);
    // let hourlyTemp = weatherBoolean ? hourlyTempStart.day.maxtemp_c : hourlyTempStart.day.maxtemp_f;
    // console.log(hourlyTempStart);
    // const data = await fetchWeather()
}
