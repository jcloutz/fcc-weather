"use strict";
var data = {
  "coord": {
    "lon": -78.96,
    "lat": 33.72
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "sky is clear",
      "icon": "01d"
    }
  ],
  "base": "cmc stations",
  "main": {
    "temp": 281.58,
    "pressure": 1018,
    "humidity": 42,
    "temp_min": 280.15,
    "temp_max": 284.26
  },
  "wind": {
    "speed": 8.7,
    "deg": 360
  },
  "clouds": {
    "all": 1
  },
  "dt": 1451930939,
  "sys": {
    "type": 1,
    "id": 2429,
    "message": 0.0136,
    "country": "US",
    "sunrise": 1451910067,
    "sunset": 1451946061
  },
  "id": 4578904,
  "name": "Forestbrook",
  "cod": 200
};
var apiKey = '9eed8518c4e923f4c9d88217fe9c998b',
    apiUrl = 'http://api.openweathermap.org/data/2.5/weather?appid='+ apiKey,
    conditions = {
      "thunderstorm": "http://unsplash.it/1680/1050/?image=171",
      "drizzle": "http://unsplash.it/1680/1050/?image=553",
      "rain": "http://unsplash.it/1680/1050/?image=178",
      "snow": "http://unsplash.it/1680/1050/?image=730",
      "atmosphere": "http://unsplash.it/1680/1050/?image=227",
      "clear": "http://unsplash.it/1680/1050/?image=792",
      "clouds": "http://unsplash.it/1680/1050/?image=894",
      "extreme": "http://unsplash.it/1680/1050/?image=536",
      "additional": "http://unsplash.it/1680/1050/?image=459"
    },
    windDirTranslations = {
      '0': 'N',
      '22.5': 'NNE',
      '45': 'NE',
      '67.5': 'ENE',
      '90': 'E',
      '112.5': 'ESE',
      '135': 'SE',
      '157.5': 'SSE',
      '180': 'S',
      '202.5': 'SSW',
      '225': 'SW',
      '247.5': 'WSW',
      '270': 'W',
      '292.5': 'WNW',
      '315': 'NW',
      '337.5': 'NNW',
      '360': 'N',
    };

$(document).ready(function() {
  var $toggles = $('.weather-toggle');
  var $html = $('html');
  var $imageChecker = $('.image-checker');

  $toggles.click(function() {
    var val = $(this).val();
    $html.attr('class', '');

    if (val !== 'none') {
      $html.attr('class', val).waitForImages({
        each: function() {
          //$html.attr('class', val);
        },
        finished: function() {
          $html.addClass('loaded');
        },
        waitForAll: true,
      })
    } else {
      $html.attr('class', 'unloaded');
    }
  });
});

var WeatherDetail = React.createClass({
  render: function() {
    var icon = "weather__detail-icon wi " + this.props.icon;
    return (
      <div className="weather__detail">
        <i className={icon}></i>
        <p className="weather__detail-description">{this.props.value}</p>
      </div>
    );
  }
});

var WeatherDetailsContainer = React.createClass({
  convertWindSpeed: function(windSpeed) {
    var speed;
    if (this.props.measurementSystem === "imperial") {
      speed = Math.round(windSpeed * 2.2369362920544) + ' m/h';
    } else {
      speed = windSpeed + ' m/s'
    }
    return speed;
  },
  convertPressure: function(atmoPressure) {
    var pressure;

    if(this.props.measurementSystem === 'imperial') {
      pressure = Math.round(atmoPressure * .030) + ' in';
    } else {
      pressure = atmoPressure + ' hPa';
    }

    return pressure;
  },
  getWind: function() {
    var windSpeed = this.props.data.wind.speed;
    var significance = 22.5;
    var windDeg = Math.round(this.props.data.wind.deg / significance) * significance;
    var windDir = windDirTranslations[windDeg.toString()];

    return windDir + ' ' + this.convertWindSpeed(windSpeed);

  },
  render: function() {
    return(
      <div className="weather__details-container">
        <WeatherDetail icon={"wi-owm-" + this.props.data.weather[0].id} value={this.props.data.weather[0].main}/>
        <WeatherDetail icon={"wi-wind-direction"} value={this.getWind()}/>
        <WeatherDetail icon={'wi-humidity'} value={this.props.data.main.humidity + '%'}/>
        <WeatherDetail icon={'wi-barometer'} value={this.convertPressure(this.props.data.main.pressure)}/>
      </div>
    );
  }
});

var TemperatureContainer = React.createClass({
  calculateTemp: function(kelvin) {
    var temp;
    if(this.props.measurementSystem === 'imperial') {
      // return fahrenheit
      temp = 9 / 5 * (kelvin - 273) + 32;
    } else {
      // return celcius
      temp = kelvin - 273.15;
    }
    return Math.round(temp);
  },
  render: function() {
    var temp = this.props.temp;
    var loc = this.props.location;
    var tempIndicatorClass = "weather__temp-measure-indicator wi ";
    if (this.props.measurementSystem === 'imperial') {
      tempIndicatorClass += 'wi-fahrenheit';
    } else {
      tempIndicatorClass += 'wi-celsius';
    }
    return(
      <div className="weather__temp-container">
        <p className="weather__temp">{this.calculateTemp(this.props.temp)}<i className={tempIndicatorClass}></i></p>
        <p className="weather__location">{this.props.location}</p>
      </div>
    );
  }
});

var Weather = React.createClass({
  getInitialState: function() {
    return {
      geo: false,
      measurementSystem: 'imperial',
      data: []
    };
  },
  loadWeather: function(lat, long) {
    this.setState({geo: true, data: data});
    // $.ajax({
    //   url: url,
    //   dataType: 'json',
    //   cache: false,
    //   success: (data) => {
    //     console.log(data);
    //     this.setState({geo: true, data: data});
    //     console.log(this.state);
    //   },
    //   error: (xhr, status, err) => {
    //     console.error(this.props.api, status, err.toString());
    //   }
    //
    // });
  },
  componentDidMount: function() {
    console.log('mounted');
    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition((position) => {
        this.loadWeather(position.coords.latitude, position.coords.longitude);
      });
    } else {
      this.setState({geo: false});
    }
  },
  render: function() {
    if(this.state.geo !== false) {
      return (
        <div className="weather">
          <TemperatureContainer temp={this.state.data.main.temp} location={this.state.data.name} measurementSystem={this.state.measurementSystem} />
          <WeatherDetailsContainer data={this.state.data} measurementSystem={this.state.measurementSystem}/>
        </div>
      );
    } else {
      return (
        <div className="Error">
          <h1>Loading</h1>
        </div>
      );
    }
  }
});

ReactDOM.render(
  <Weather api={apiUrl} />,
  document.getElementById('content')
);
