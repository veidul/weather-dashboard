$(document).ready(function () {
    var weather;
    var search = "";
    var date = $('#currentDay')
    // var url = 'http://api.openweathermap.org/data/2.5/forecast?q=Irvine&id=524901&appid=aed5df8b172a70dc402500f4df59160c&units=imperial'
    // var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=524901&appid=aed5df8b172a70dc402500f4df59160c&units=imperial";
    // var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=524901&appid=aed5df8b172a70dc402500f4df59160c&units=imperial";
    var queryURL = "";
    var api = 'http://api.openweathermap.org/data/2.5/weather?q=';
    var forecastAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var apiKey = '&appid=aed5df8b172a70dc402500f4df59160c'
    var units = '&units=imperial';
    var searchHistory = [];
    var searchInput = document.querySelector('#search-input')
    var cityEl = $('#city')
    var windEl = $('#wind')
    var tempEl = $('#temp')
    var humidityEl = $('#humidity')
    var uviEl = $('#uvi')
    var iconEl = $('#icon')
    var iconAPI;
    var newImage;
    var forecastIcon;
    var newForecastImage;
    var tempForecastEl = [$("#tempForecast0"), $("#tempForecast1"), $("#tempForecast2"), $("#tempForecast3"), $("#tempForecast4")]
    var dateForecastEl = [$("#dayForecast0"), $("#dayForecast1"), $("#dayForecast2"), $("#dayForecast3"), $("#dayForecast4")]
    var iconForecastEl = [$("#iconForecast0"), $("#iconForecast1"), $("#iconForecast2"), $("#iconForecast3"), $("#iconForecast4")]
    var humidityForecastEl = [$("#humidityForecast0"), $("#humidityForecast1"), $("#humidityForecast2"), $("#humidityForecast3"), $("#humidityForecast4")]
    var windForecastEl = [$("#windForecast0"), $("#windForecast1"), $("#windForecast2"), $("#windForecast3"), $("#windForecast4")]

    var resultTextEl = document.querySelector('#result-text');
    var resultContentEl = document.querySelector('#result-content');
    var forecastTextEl = document.querySelector('#forecast-text');
    var forecastContentEl = document.querySelector('#forecast-content');




    date.text(moment().format("L"))

    // var weatherAsk = async () => {

    //     fetch(queryURL)
    //     .then(function (response) {
    //         if (response.ok) {
    //             console.log(response);
    //             response.json().then(function (data) {
    //                 console.log(data);
    //                 displayWeather(data);
    //             })
    //         }
    //     })

    // }

    //use this first to get the data for uv index


    // data.coord.lat
    // data.coord.lon



    // var displayWeather = function (weather, searchInput) {
    //     if (weather.length === 0) {
    //         resultTextEl.textContent = 'No weather found.';
    //         return;
    //     }
    // }
    // getWeather;
    $('#submit').on("click", function (event) {
        event.preventDefault();
        search = searchInput.value.trim()
        console.log(search);
        getWeather();
        getForecast();
        // fetchCoords(search);
        // searchInput.value = '';
        // loadJSON(queryURL, gotData);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    })
    // json.parse(localStorage.getItem("searchHistory"))
    // create buttons for array items and then append under search bar
    // create unordered list of buttons inside load history function
    // onclick will run the array # which is city name added to api call


    function getApi() {
        var button = select("#submit")
        button.mousePressed(weatherAsk);
    }

    getApi;
    function getForecast() {
        var urlForecast = forecastAPI + search + apiKey + units;
        fetch(urlForecast)
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    response.json().then(function (data) {
                        console.log(data);
                        function displayForecast(data, number, dayNumber) {
                            forecastIcon = "http://openweathermap.org/img/wn/" + data.list[dayNumber].weather[0].icon + ".png"
                            windForecastEl[number].text(data.list[dayNumber].wind.speed + " MPH")
                            tempForecastEl[number].text(data.list[dayNumber].main.temp + " °F")
                            dateForecastEl[number].text(moment(data.list[dayNumber].dt_txt).format('M/DD/YY'))
                            humidityForecastEl[number].text(data.list[dayNumber].main.humidity + " %")
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
    function getWeather() {
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
        windEl.text(data.wind.speed)
        tempEl.text(data.main.temp)
        humidityEl.text(data.main.humidity)
        uviEl.text(uvi)
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

// add weatherforecast
// target each seperate day and append the info accordingly
