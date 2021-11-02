

class Fetch {
async getCurrent(input) {
    const myKey = 'aed5df8b172a70dc402500f4df59160c'

    // make url request

    const response = await fetch( 
        'http://api.openweathermap.org/data/2.5/forecast?q=${input}&id=524901&appid=aed5df8b172a70dc402500f4df59160c&units=imperial'
    )

    const data = await response.json();
}




}