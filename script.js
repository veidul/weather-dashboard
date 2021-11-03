$(document).ready(function () {
    var search = "";
    var date = $('#currentDay')
    var api = 'http://api.openweathermap.org/data/2.5/weather?q=';
    var forecastAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var apiKey = '&appid=aed5df8b172a70dc402500f4df59160c'
    var units = '&units=imperial';
    var searchInput = document.querySelector('#search-input')
    var cityEl = $('#city')
    var windEl = $('#wind')
    var tempEl = $('#temp')
    var humidityEl = $('#humidity')
    var uviEl = $('#uvi')
    var iconAPI;
    var forecastIcon;
    var tempForecastEl = [$("#tempForecast0"), $("#tempForecast1"), $("#tempForecast2"), $("#tempForecast3"), $("#tempForecast4")]
    var dateForecastEl = [$("#dayForecast0"), $("#dayForecast1"), $("#dayForecast2"), $("#dayForecast3"), $("#dayForecast4")]
    var iconForecastEl = [$("#iconForecast0"), $("#iconForecast1"), $("#iconForecast2"), $("#iconForecast3"), $("#iconForecast4")]
    var humidityForecastEl = [$("#humidityForecast0"), $("#humidityForecast1"), $("#humidityForecast2"), $("#humidityForecast3"), $("#humidityForecast4")]
    var windForecastEl = [$("#windForecast0"), $("#windForecast1"), $("#windForecast2"), $("#windForecast3"), $("#windForecast4")]
    var history;

    date.text(moment().format("L"))

    function loadHistory() {
        var ul = $("#history-list")
        history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
        for (let i = 0; i < history.length; i++) {
            ul.append(`<li><button class="btn btn-info btn-block btn-outline-dark" id="${history[i]}" onClick="reply_click(this.id)">${history[i]}<btn></li>`)

        }
    }
    loadHistory();

    $('#submit').on("click", function (event) {
        event.preventDefault();
        search = searchInput.value.trim()
        console.log(search);
        $("#history-list").append(`<li><button class="btn btn-info btn-block btn-outline-dark" id=${search} onClick="reply_click(this.id)">${search}<btn></li>`);
        getWeather(search);
        getForecast(search);
        history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
        history.push(search)
        localStorage.setItem("searchHistory", JSON.stringify(history))
    })
    
    function getForecast(search) {
        var urlForecast = forecastAPI + search + apiKey + units;
        fetch(urlForecast)
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(data);
                        function displayForecast(data, number, dayNumber) {
                            forecastIcon = "http://openweathermap.org/img/wn/" + data.list[dayNumber].weather[0].icon + ".png"
                            windForecastEl[number].text("Wind: " + data.list[dayNumber].wind.speed + " MPH")
                            tempForecastEl[number].text("Temp: " + data.list[dayNumber].main.temp + " °F")
                            dateForecastEl[number].text(moment(data.list[dayNumber].dt_txt).format('M/DD/YY'))
                            humidityForecastEl[number].text("Humidity: " + data.list[dayNumber].main.humidity + " %")
                            iconForecastEl[number].html(`<img src='${forecastIcon}'>`);

                        }
                        displayForecast(data, 0, 1);
                        displayForecast(data, 1, 9);
                        displayForecast(data, 2, 17);
                        displayForecast(data, 3, 25);
                        displayForecast(data, 4, 33);
                    })
                }
            }
            )
    }
    function getWeather(search) {
        var url = api + search + apiKey + units;
        fetch(url)
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(data)
                        var uviCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=hourly,daily" + apiKey;
                        fetch(uviCall)
                            .then(function (res) {
                                if (res.ok) {
                                    console.log(res);
                                    res.json().then(function (uviData) {
                                        console.log(uviData);
                                        displayWeather(data, uviData);

                                    })
                                }
                            })
                    })
                }

            })
    }

    function displayWeather(data, uviData) {
        var uvi = uviData.current.uvi
        cityEl.text(data.name)
        windEl.text("Wind: "+data.wind.speed+" MPH")
        tempEl.text("Temperature: "+data.main.temp+" °F")
        humidityEl.text("Humidity: "+data.main.humidity+ " %")
        uviEl.text("UVI: "+uvi)
        iconAPI = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png"
        $("#icon").html(`<img src='${iconAPI}'>`);
        if (uvi < 2) {
            uviEl.addClass("favorable")
        } else if (uvi < 7) {
            uviEl.addClass("moderate")
        } else { uviEl.addClass("severe") };

    }
})
function displayForecast(data, number, dayNumber) {
    let forecastIcon = "http://openweathermap.org/img/wn/" + data.list[dayNumber].weather[0].icon + ".png"
    let newforecastImage = $("<img>").attr("src", forecastIcon)
    windForecastEl[number].text(data.list[dayNumber].wind.speed + " MPH")
    tempForecastEl[number].text(data.list[dayNumber].main.temp + " °F")
    dateForecastEl[number].text(moment(data.list[dayNumber].dt_txt).format(L))
    humidityForecastEl[number].text(data.list[dayNumber].main.humidity + " %")
    iconForecastEl[number].append(newforecastImage)

}

