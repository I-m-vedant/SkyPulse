let currentMain, currentCity, currentIcon, currentCond
    let apiKey="a49e797c8e1771b10ba6eb7fb9783792"
    let fdiv=document.getElementsByClassName("Weather")
    let sdiv=document.getElementsByClassName("forecast")
    let rdiv=document.getElementsByClassName("recent")
    let btn = document.getElementById("searchBtn")
    let input = document.getElementById("cityInput")
    let btn1=document.getElementById("locbtn")

function renderRecent()
{
    let recent=JSON.parse(localStorage.getItem("recent")) || []
    rdiv[0].innerHTML=recent.map(c=>`<span class="chip" data-city="${c}">${c}</span>`).join(" ")

}
    rdiv[0].addEventListener("click", (e) => {
    if (e.target.classList.contains("chip")) {   
        input.value = e.target.dataset.city       
        btn.click()                                 
    }
})

function inH(city, main, icon, cond) {
    return `<div class="weather-header">
        <h2>Weather in ${city}</h2>
    </div>
    <div class="weather-card ${cond.toLowerCase()}">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
        <table align="center">
            <tr><th>City</th><td>${city}</td></tr>
            <tr><th>Temperature</th><td>${main.temp}°C</td></tr>
            <tr><th>Feels like</th><td>${main.feels_like}°C</td></tr>
            <tr><th>Min Temp</th><td>${main.temp_min}°C</td></tr>
            <tr><th>Max Temp</th><td>${main.temp_max}°C</td></tr>
            <tr><th>Humidity</th><td>${main.humidity}%</td></tr>
            <tr><th>Pressure</th><td>${main.pressure} hPa</td></tr>
        </table>
    </div>`
}
btn1.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
        let lat=position.coords.latitude;
        let lon=position.coords.longitude;
        console.log(lat,lon)
        let url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        let resp=fetch(url)
        .then(resp=>resp.json())
        .then(data=>{
            console.log(data)
            const{name , main ,weather} =data
            fdiv[0].innerHTML=inH(name,main,weather[0].icon,weather[0].main)
           
        })
    })
})
btn.addEventListener("click", () => {
    let city = input.value
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    let resp=fetch(url)
    .then(resp=>resp.json())
    .then(data=>{
        console.log(data)
        if(data.cod!=200)
        fdiv[0].innerHTML="<h2>City not Found. Please try again</h2>"
    else{
        const{name , main ,weather} =data
        let recent = JSON.parse(localStorage.getItem("recent")) || []
        recent = recent.filter(c => c !== city)
        recent.unshift(city)
        recent = recent.slice(0, 5)
        localStorage.setItem("recent", JSON.stringify(recent))
        console.log(recent)
        renderRecent()
        console.log(weather[0].main,weather[0].icon)
        fdiv[0].innerHTML=inH(name,main,weather[0].icon,weather[0].main)
       
    }
    })
    let resp1=fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(resp1=>resp1.json())
    .then(data=>{
        if(data.cod!=200)
        sdiv[0].innerHTML=""
    else{
        console.log(data)
        let daily=data.list.filter(item=>item.dt_txt.includes("12:00:00"))
        let cardsHtml=""
        daily.forEach(item => {
    const { main, weather, dt_txt } = item
    let icon = weather[0].icon
    let day = new Date(dt_txt).toLocaleDateString("en-US", { weekday: "short" })
    cardsHtml += `
    <div class="forecast-card">
        <h3>${day}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
        <p>${main.temp}°C</p>
    </div>`
})

        sdiv[0].innerHTML=cardsHtml
        console.log(daily)
    }
    })
})
renderRecent()