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
let degree = document.querySelector("#degree");
let highTemp = document.querySelector("#high-temp");
let lowTemp = document.querySelector("#low-temp");
let realFeel = document.querySelector("#real-feel");
let searchButton = document.querySelector("#search-button");
let locationButton = document.querySelector("#location-button");
let fahrenheitIcon = document.querySelector("#fahrenheit a");
let celsiusIcon = document.querySelector("#celsius a");
let city;

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
  let nameOfCities = response.data.name;
  let temp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let tempMax = Math.round(response.data.main.temp_max);
  let tempMin = Math.round(response.data.main.temp_min);
  let feelsLike = Math.round(response.data.main.feels_like);
  let windSpeed = response.data.wind.speed;
  let humidity = Math.round(response.data.main.humidity);
  let pressure = Math.round(response.data.main.pressure);

  let descriptionParagraph = document.querySelector("#description-paragraph");
  let wind = document.querySelector("#wind");
  let weatherHumidity = document.querySelector("#humidity");
  let weatherPressure = document.querySelector("#pressure");

  cityName.innerHTML = `${nameOfCities}`;
  searchInput.value = nameOfCities;
  degree.innerHTML = temp;
  descriptionParagraph.innerHTML = description;
  highTemp.innerHTML =tempMax;
  lowTemp.innerHTML = tempMin;
  realFeel.innerHTML = feelsLike;
  wind.innerHTML = `${windSpeed}km/h`;
  weatherHumidity.innerHTML = humidity;
  weatherPressure.innerHTML = pressure;

  celsiusIcon.classList.add("selected");
  fahrenheitIcon.classList.remove("selected");
}
//------------update UI To Fahrenheit
function changeInnerHtmlToFahrenheit(response) {
   
  let temp = Math.round(response.data.main.temp);
  let tempMax = Math.round(response.data.main.temp_max);
  let tempMin = Math.round(response.data.main.temp_min);
  let feelsLike = Math.round(response.data.main.feels_like);

  degree.innerHTML = temp;
  highTemp.innerHTML = tempMax;
  lowTemp.innerHTML = tempMin;
  realFeel.innerHTML = feelsLike;

  fahrenheitIcon.classList.add("selected");
  celsiusIcon.classList.remove("selected");
}
//------------------------------------------------------------------------------

//fetch from API
//--------------------By city name
function getTempByName(name) {
  let apiKey = "c021aa687b60c09e08ee49779a30f51c";
  let units = "metric";
  let protocol = "https://api.openweathermap.org/data/2.5/weather";
  let url = `${protocol}?q=${name}&appid=${apiKey}&units=${units}`;
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
  let apiKey = "c021aa687b60c09e08ee49779a30f51c";
  let units = "metric";
  let protocol = "https://api.openweathermap.org/data/2.5/weather";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude);
  let url = `${protocol}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(updateUI);
}

//--------------------By Fahrenheit unit
function changeUnitToFahrenheit(city) {
  city=  document.querySelector("#search-input").value;
  let apiKey = "c021aa687b60c09e08ee49779a30f51c";
  let units = "imperial";
  let protocol = "https://api.openweathermap.org/data/2.5/weather";
  let url = `${protocol}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(changeInnerHtmlToFahrenheit);
}
//-------------------------------------------------------------------------------

//get city 
//------------------- by search button and search input
function searchCity() {
  let city = document.querySelector("#search-input").value;
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
fahrenheitIcon.addEventListener("click",  changeUnitToFahrenheit);
celsiusIcon.addEventListener("click", searchCity);
searchInput.addEventListener("keydown", onKeyPress);
searchButton.addEventListener("click", searchCity);
// default city is tehran
let defaultCity= localStorage.city;
if(!defaultCity)
  defaultCity= "Tehran"

getTempByName(defaultCity);

//------------------------------------------------------------------------------


  
 
  