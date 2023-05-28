// Fetch the weather data (current or forecast, based on forecast parameter)
export async function fetchWeather(city, forecast) {
    try {
        let data;
        let response = await fetch(`https://api.weatherapi.com/v1/${forecast}.json?key=b35580b5b878478fba522539232904&q=${city}&days=3`, {
            mode: "cors",
        });
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error("Please enter a valid city name");
        }
        return data;
    } catch (err) {
        console.log("there was an error " + err);
    }
}
