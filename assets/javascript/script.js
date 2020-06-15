function load() {
  const cityInput = document.getElementById("cityInput");
  const searchButton = document.getElementById("searchButton");
  const currentCity = document.getElementById("currentCity");
  const currentImg = document.getElementById("currentImg");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("windSpeed");
  const curUVIndex = document.getElementById("uvIndex");
  const history = document.getElementById("history");
  const clearHistory = document.getElementById("clearHistory");
  const APIKey = "fe5888b9abf593166250fa8c0803b531";

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  function getWeather(cityName) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;
    axios.get(queryURL).then(function (response) {
      console.log(response);
      const currentDate = new Date(response.data.dt * 1000);
      console.log(currentDate);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      currentCity.innerHTML =
        response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentImg.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
      );
      currentImg.setAttribute("alt", response.data.weather[0].description);
      temperature.innerHTML =
        "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
      windSpeed.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        let uvIndex = document.createElement("span");
        uvIndex.setAttribute("class", "badge badge-danger");
        uvIndex.innerHTML = response.data[0].value;
        curUVIndex.innerHTML = "UV Index: ";
        curUVIndex.append(uvIndex);
      });

      let cityID = response.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        console.log(response);
        const forecast = document.querySelectorAll(".forecast");
        for (i = 0; i < forecast.length; i++) {
          forecast[i].innerHTML = "";
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(
            response.data.list[forecastIndex].dt * 1000
          );
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() + 1;
          const forecastYear = forecastDate.getFullYear();
          const forecastDate = document.createElement("p");
          forecastDate.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDate.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecast[i].append(forecastDate);
          const forecastWeather = document.createElement("img");
          forecastWeather.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              response.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastWeather.setAttribute(
            "alt",
            response.data.list[forecastIndex].weather[0].description
          );
          forecast[i].append(forecastWeather);
          const forecastTemp = document.createElement("p");
          forecastTemp.innerHTML =
            "Temp: " +
            k2f(response.data.list[forecastIndex].main.temp) +
            " &#176F";
          forecast[i].append(forecastTemp);
          const forecastHumidity = document.createElement("p");
          forecastHumidity.innerHTML =
            "Humidity: " +
            response.data.list[forecastIndex].main.humidity +
            "%";
          forecast[i].append(forecastHumidity);
        }
      });
    });
  }

  searchButton.addEventListener("click", function () {
    const searchTerm = cityInput.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  });

  clearHistory.addEventListener("click", function () {
    searchHistory = [];
    renderSearchHistory();
  });

  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
    history.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      });
      history.append(historyItem);
    }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
  }
}
load();
