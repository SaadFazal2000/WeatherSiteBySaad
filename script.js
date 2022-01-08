let searchInp = document.querySelector('.weather__search')

let city = document.querySelector('.weather__city');
let day = document.querySelector('.weather__day');
let humidity = document.querySelector('.weather__indicator--humidity>.value');
let pressure = document.querySelector('.weather__indicator--pressure>.value');
let wind = document.querySelector('.weather__indicator--wind>.value');
let image = document.querySelector('.weather__image');
let temperature = document.querySelector('.weather__temperature');
let forecastBlock=document.querySelector('.weather__forecast')



let weatherAPIKey = 'bd38da79b843c0697e745706379e5afd'
let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;
let forecastbaseEnd='https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherAPIKey; 

let weatherImages=[
    {
        url:'clear-sky.png',
        ids:[800]
    },
    {
        url: 'broken-clouds.png',
    ids:[803,804]
    },
    {
        url: 'few-clouds.png',
    ids:[801]
    },
    {
        url: 'mist.png',
    ids:[701, 711, 721, 731, 741, ,751, 762, 771, 781]
    },
    {
        url:'rain.png',
        ids:[500, 501, 502, 503, 504]
    },
    {
        url:'scattered-clouds.png',
        ids:[802]
    },
    {
        url:'shower-rain.png',
        ids:[520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
    },
    {
        url:'snow.png',
        ids:[511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url:'thunderstorm.png',
        ids:[200, 201, 202, 210, 211, 212, 221, 220, 231, 232]
    }
]


let getWeatherByCityName = async (city) => {

    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json()
    console.log(weather) 
    return weather;
    // console.log(weather)
}

let getForecaseByCityId=async (id) =>{

    let endpoint = forecastbaseEnd + '&id=' + id;
    let result = await fetch(endpoint); 
    let forecast =await result.json();
let forecastList=forecast.list;
let daily = [];

forecastList.forEach(day =>{

let date = new Date(day.dt_txt.replace(' ','T'))
let hours =date.getHours();
if(hours=== 12){
    daily.push(day);
}
// console.log(hours);

})
 
    // console.log(forecast )
    // console.log(daily )
    return daily ;   
}


searchInp.addEventListener('keydown', async (e) => {
    if (e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInp.value);

        let cityID= weather.id
        
        // console.log(weather)
        updateCurrentWeather(weather);
    let forecast =await  getForecaseByCityId(cityID);

    updateForecast(forecast);
    }
    // console.log(e);
})

// getWeatherByCityName('Rawalpindi');

let updateCurrentWeather = (data) => {

    // console.log(data)
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;

    let deg = data.wind.deg;

    if (deg < 45 && deg <= 135) {
        windDirection = 'East';
    } else if (deg > 135 && deg <= 225) {
        windDirection = 'South';

    
    } else if (deg > 225 && deg <= 315) {
        windDirection = 'West';
        
    }else{
        windDirection = 'North';

    }
    wind.textContent= windDirection + ', ' + data.wind.speed ; 

    temperature.textContent=data.main.temp > 0 ? 
                                            '+' + Math.round(data.main.temp) :
                                                 Math.round(data.main.temp);

 
let imgID = data.weather[0].id;
weatherImages.forEach(obj =>{
    if(obj.ids.includes(imgID)){
         
image.src=obj.url;

    }
})
}

let  updateForecast= (forecast) =>{

forecastBlock.innerHTML='';
forecast.forEach(day =>{

    let iconUrl= 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png'; 

let dayName =dayOfWeek(day.dt * 1000)

let temperature= day.main.temp > 0 ? 
'+' + Math.round(day.main.temp) :
     Math.round(day.main.temp); 

let forecatItem =`
<article class="weather__forecast__item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather__forecast__icon">
                <h3 class="weather__forecast__day">${dayName}</h3>
                <p class="weather__forecast__temperature"><span class="value">${temperature}</span> &deg;C</p>
            </article>
`;
forecastBlock.insertAdjacentHTML('beforeend', forecatItem)

})

}

let dayOfWeek = (dt = new Date().getTime()) => {
    return new Date(dt).toLocaleDateString('en-En', { 'weekday': 'long' });
}