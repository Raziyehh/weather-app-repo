//set the variables

let dateTime = new Date();
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = weekDays[dateTime.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "Jun",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let currentMonth = months[dateTime.getMonth()];
let daysOfMonth = dateTime.getDate();

let date = document.querySelector("#date");
let cityName = document.querySelector("#city-name");
let searchInput = document.querySelector("#search-input");
let weatherIcon =document.querySelector("#weather-icon");
let degree = document.querySelector("#degree");
let highTemp = document.querySelector("#high-temp");
let lowTemp = document.querySelector("#low-temp");
let realFeel = document.querySelector("#real-feel");
let descriptionParagraph = document.querySelector("#description-paragraph");
let wind = document.querySelector("#wind");
let weatherHumidity = document.querySelector("#humidity");
let weatherPressure = document.querySelector("#pressure");
let searchButton = document.querySelector("#search-button");
let locationButton = document.querySelector("#location-button");
let fahrenheitIcon = document.querySelector("#fahrenheit a");
let celsiusIcon = document.querySelector("#celsius a");

let apiKey = "c021aa687b60c09e08ee49779a30f51c";
let protocol = "https://api.openweathermap.org/data/2.5/";
let apiTempData= null;
let cityCoordination= null;
//------------------------------------------------------------------------------

//set current date and time
function setTimeDate() {
  let dateTime = new Date();
  let currentHours = dateTime.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = dateTime.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let hour = document.querySelector("#hour");
  hour.innerHTML = `${currentHours} : ${currentMinutes}`;
}

setTimeDate();
setInterval(setTimeDate, 5000);
date.innerHTML = `${day}, ${currentMonth} ${daysOfMonth}`;
//-----------------------------------------------------------------------------

//update UI
//------------update UI to celsius
function updateUI(response) {
  // update default city
  localStorage.city= response.data.name;
  //
  apiTempData= response.data.main;
  cityCoordination= response.data.coord;

  let nameOfCities = response.data.name;
  let apiWeatherIcon=response.data.weather[0].icon
  let temp = Math.round(apiTempData.temp);
  let description = response.data.weather[0].description;
  let tempMax = Math.round(apiTempData.temp_max);
  let tempMin = Math.round(apiTempData.temp_min);
  let feelsLike = Math.round(apiTempData.feels_like);
  let windSpeed = response.data.wind.speed;
  let humidity = Math.round(response.data.main.humidity);
  let pressure = Math.round(response.data.main.pressure);
  
  cityName.innerHTML = `${nameOfCities}`;
  searchInput.value = nameOfCities;
  weatherIcon.setAttribute("src",`http://openweathermap.org/img/wn/${apiWeatherIcon}@2x.png`);
  weatherIcon.setAttribute("alt",description);
  degree.innerHTML = temp;
  descriptionParagraph.innerHTML = description;
  highTemp.innerHTML =`${tempMax}°`;
  lowTemp.innerHTML = `${tempMin}°`;
  realFeel.innerHTML = `${feelsLike}°`;
  wind.innerHTML = `${windSpeed}km/h`;
  weatherHumidity.innerHTML = `${humidity}%`;
  weatherPressure.innerHTML = pressure;

  celsiusIcon.classList.remove("selected");
  fahrenheitIcon.classList.add("selected");

  getForecast(cityCoordination,"metric");
}
//------------update UI To Fahrenheit
function changeInnerHtmlToFahrenheit() {
   
  let fTemp = Math.round(apiTempData.temp*9/5+32);
  let fTempMax = Math.round(apiTempData.temp_max*9/5+32);
  let fTempMin = Math.round(apiTempData.temp_min*9/5+32);
  let fFeelsLike = Math.round(apiTempData.feels_like*9/5+32);

  degree.innerHTML = fTemp;
  highTemp.innerHTML = `${fTempMax}°`;
  lowTemp.innerHTML = `${fTempMin}°`;
  realFeel.innerHTML = `${fFeelsLike}°`;

  fahrenheitIcon.classList.remove("selected");
  celsiusIcon.classList.add("selected");
  getForecast(cityCoordination,"imperial");
}
//-------------------display the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response){
  let forecast= response.data.daily;
  let forecastElement= document.querySelector("#forecast");
  let forecastHTML=`<div class="row m-3">`;

  forecast.forEach(function(forecastDay, index){
    let month= new Date(forecastDay.dt * 1000).getMonth() +1;
    let day = new Date(forecastDay.dt * 1000).getDate();
    if(index>0 && index<6){
     forecastHTML=
     forecastHTML+ ` <div class="col days-container m-1 card">
     
       <div id="forecast-day">${formatDay(forecastDay.dt)}</div>
       <div id="forecast-date">${`${month}/${day} `}</div>
       <div id="forecast-icon">
       <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt=""/>
       </div>
       <div  id="forecast-high-temp">${Math.round(forecastDay.temp.max)}°</div>
       <div  id="forecast-low-temp">${Math.round(forecastDay.temp.min)}°</div>
 </div>`;
   }
 });
 forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//------------------------------------------------------------------------------

//fetch from API
//--------------------By city name
function getTempByName(name) {
  let units = "metric";
  let url = `${protocol}weather?q=${name}&appid=${apiKey}&units=${units}`;
  axios
    .get(url)
    .then(updateUI)
    .catch((error) => {
      searchInput.value = "";
      alert("City not found");
    });
}

//--------------------By city location
function getTempByPosition(position) {
  let units = "metric";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `${protocol}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(updateUI);
}

//--------------------get the forecast
function getForecast(coordinates,units) {
  let apiUrl=`${protocol}onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
//-------------------------------------------------------------------------------

//get city 
//------------------- by search button and search input
function searchCity() {
  let city=  document.querySelector("#search-input").value;
  city = city.trim();
  if (city === "") {
    alert("please enter a city");
    cityName.innerHTML = defaultCity;
  } else {
    getTempByName(city);
  }
}

function onKeyPress(event) {
  if (event.key === "Enter") searchCity();
}

//------------------- by lacation button

function getLocation() {
  navigator.geolocation.getCurrentPosition(getTempByPosition);
}
//-------------------------------------------------------------------------

//run on load

locationButton.addEventListener("click", getLocation);
fahrenheitIcon.addEventListener("click",  changeInnerHtmlToFahrenheit);
celsiusIcon.addEventListener("click", searchCity);
searchInput.addEventListener("keydown", onKeyPress);
searchButton.addEventListener("click", searchCity);
// default city is tehran
let defaultCity= localStorage.city;
if(!defaultCity)
  defaultCity= "Tehran"

getTempByName(defaultCity);

//change the video play speed
document.querySelector('video').playbackRate = 0.3;
//------------------------------------------------------------------------------