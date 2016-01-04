"use strict";
var data = {
  "coord": {
    "lon": -78.96,
    "lat": 33.72
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04n"
    }
  ],
  "base": "cmc stations",
  "main": {
    "temp": 50.86,
    "pressure": 1022,
    "humidity": 62,
    "temp_min": 48,
    "temp_max": 55.99
  },
  "wind": {
    "speed": 6.7,
    "deg": 360
  },
  "clouds": {
    "all": 90
  },
  "dt": 1451713157,
  "sys": {
    "type": 1,
    "id": 2429,
    "message": 0.0108,
    "country": "US",
    "sunrise": 1451737246,
    "sunset": 1451773142
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
    return (
      <div className="weather__detail">
        <i className="weather__detail-icon wi wi-day-cloudy"></i>
        <p className="weather__detail-description">Sunny</p>
      </div>
    );
  }
});

var TemperatureContainer = React.createClass({
  render: function() {
    return(
      <div className="weather__temp-container">
        <p className="weather__temp">77<i className="weather__temp-measure-indicator wi wi-fahrenheit"></i></p>
        <p className="weather__location">Myrtle Beach, SC</p>
      </div>
    );
  }
});

var WeatherDetailsContainer = React.createClass({
  render: function() {
    return(
      <div className="weather__details-container">
        <WeatherDetail />
        <WeatherDetail />
        <WeatherDetail />
        <WeatherDetail />
      </div>
    );
  }
});

var Weather = React.createClass({
  getInitialState: function() {
    return {geo: false, data: []};
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
          <TemperatureContainer />
          <WeatherDetailsContainer />
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
