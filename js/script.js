"use strict";

var apiKey = '9eed8518c4e923f4c9d88217fe9c998b',
    apiUrl = 'http://api.openweathermap.org/data/2.5/weather?appid=' + apiKey,
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
    conditionCodes = [{
  lowerBound: 200,
  upperBound: 299,
  condition: 'thunderstorm'
}, {
  lowerBound: 300,
  upperBound: 399,
  condition: 'drizzle'
}, {
  lowerBound: 400,
  upperBound: 599,
  condition: 'rain'
}, {
  lowerBound: 600,
  upperBound: 699,
  condition: 'snow'
}, {
  lowerBound: 700,
  upperBound: 799,
  condition: 'atmosphere'
}, {
  lowerBound: 800,
  upperBound: 800,
  condition: 'clear'
}, {
  lowerBound: 801,
  upperBound: 899,
  condition: 'clouds'
}, {
  lowerBound: 900,
  upperBound: 909,
  condition: 'extreme'
}, {
  lowerBound: 951,
  upperBound: 962,
  condition: 'additional'
}],
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
  '360': 'N'
};

var WeatherDetail = React.createClass({
  displayName: 'WeatherDetail',

  render: function render() {
    var icon = "weather__detail-icon wi " + this.props.icon;
    return React.createElement(
      'div',
      { className: 'weather__detail' },
      React.createElement('i', { className: icon }),
      React.createElement(
        'p',
        { className: 'weather__detail-description' },
        this.props.value
      )
    );
  }
});

var WeatherDetailsContainer = React.createClass({
  displayName: 'WeatherDetailsContainer',

  convertWindSpeed: function convertWindSpeed(windSpeed) {
    var speed;
    if (this.props.measurementSystem === "imperial") {
      speed = Math.round(windSpeed * 2.2369362920544) + ' m/h';
    } else {
      speed = windSpeed + ' m/s';
    }
    return speed;
  },
  convertPressure: function convertPressure(atmoPressure) {
    var pressure;

    if (this.props.measurementSystem === 'imperial') {
      pressure = Math.round(atmoPressure * .030) + ' in';
    } else {
      pressure = atmoPressure + ' hPa';
    }

    return pressure;
  },
  getWind: function getWind() {
    var windSpeed = this.props.data.wind.speed;
    var significance = 22.5;
    var windDeg = Math.round(this.props.data.wind.deg / significance) * significance;
    var windDir = windDirTranslations[windDeg.toString()];

    return windDir + ' ' + this.convertWindSpeed(windSpeed);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'weather__details-container' },
      React.createElement(WeatherDetail, { icon: "wi-owm-" + this.props.data.weather[0].id, value: this.props.data.weather[0].main }),
      React.createElement(WeatherDetail, { icon: "wi-wind-direction", value: this.getWind() }),
      React.createElement(WeatherDetail, { icon: 'wi-humidity', value: this.props.data.main.humidity + '%' }),
      React.createElement(WeatherDetail, { icon: 'wi-barometer', value: this.convertPressure(this.props.data.main.pressure) })
    );
  }
});

var TemperatureToggle = React.createClass({
  displayName: 'TemperatureToggle',

  getInitialState: function getInitialState() {
    return { measurementSystem: 'imperial' };
  },
  handleMeasurementSystemChange: function handleMeasurementSystemChange() {
    var newState = this.state.measurementSystem === 'imperial' ? 'metric' : 'imperial';
    this.setState({ measurementSystem: newState });
    this.props.onMeasurementSystemChange(newState);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'weather__type-toggle-container' },
      React.createElement(
        'div',
        { className: 'weather__type-toggle' },
        React.createElement('input', { type: 'checkbox', id: 'metric-toggle', name: 'metric-toggle', onChange: this.handleMeasurementSystemChange, className: 'weather__type-toggle-input' }),
        React.createElement('label', { htmlFor: 'metric-toggle', className: 'weather__type-toggle-label' })
      )
    );
  }
});

var TemperatureContainer = React.createClass({
  displayName: 'TemperatureContainer',

  calculateTemp: function calculateTemp(kelvin) {
    var temp;
    if (this.props.measurementSystem === 'imperial') {
      // return fahrenheit
      temp = 9 / 5 * (kelvin - 273) + 32;
    } else {
      // return celcius
      temp = kelvin - 273.15;
    }
    return Math.round(temp);
  },
  render: function render() {
    var temp = this.props.temp;
    var loc = this.props.location;
    var tempIndicatorClass = "weather__temp-measure-indicator wi ";
    if (this.props.measurementSystem === 'imperial') {
      tempIndicatorClass += 'wi-fahrenheit';
    } else {
      tempIndicatorClass += 'wi-celsius';
    }
    return React.createElement(
      'div',
      { className: 'weather__temp-container' },
      React.createElement(
        'p',
        { className: 'weather__temp' },
        this.calculateTemp(this.props.temp),
        React.createElement('i', { className: tempIndicatorClass })
      ),
      React.createElement(
        'p',
        { className: 'weather__location' },
        this.props.location
      ),
      React.createElement(TemperatureToggle, { measurementSystem: this.props.measurementSystem, onMeasurementSystemChange: this.props.onMeasurementSystemChange })
    );
  }
});

var WeatherForm = React.createClass({
  displayName: 'WeatherForm',

  getInitialState: function getInitialState() {
    return {
      location: this.props.location
    };
  },
  handleLocationChange: function handleLocationChange(e) {
    this.setState({ location: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();

    var location = this.state.location.trim();
    if (!location) {
      return;
    }

    this.props.onLocationSubmit(location);
  },
  render: function render() {
    return React.createElement(
      'form',
      { className: 'weather__form', onSubmit: this.handleSubmit },
      React.createElement('input', { type: 'text',
        value: this.state.location,
        placeholder: 'London, UK or 90210, US',
        onChange: this.handleLocationChange,
        className: 'weather__form-input' }),
      React.createElement(
        'button',
        { value: 'submit', className: 'weather__form-submit' },
        React.createElement('i', { className: 'wi wi-cloud-up' })
      )
    );
  }
});

var Weather = React.createClass({
  displayName: 'Weather',

  getInitialState: function getInitialState() {
    return {
      status: 'loading',
      geo: false,
      measurementSystem: 'imperial',
      data: [],
      searchLocation: ''
    };
  },
  handleMeasurementSystemChange: function handleMeasurementSystemChange(system) {
    this.setState({ measurementSystem: system });
  },
  handleFormSubmit: function handleFormSubmit(location) {
    this.setState({ status: 'loading', searchLocation: location });

    var url = this.props.api;
    var regexS = /[\d]{2,}/g; // look for numeric postalcode
    var regex = new RegExp(regexS);
    var result = regex.exec(location);

    if (result == null) {
      // city search
      url += '&q=' + location;
    } else {
      //zipcode search
      url += '&zip=' + location;
    }

    this.loadWeather(url);
  },
  resolveConditionCode: function resolveConditionCode(code) {
    for (var i = 0; i < conditionCodes.length; i++) {
      if (code >= conditionCodes[i].lowerBound && code <= conditionCodes[i].upperBound) {
        return conditionCodes[i].condition;
      }
    }
  },
  ajaxError: function ajaxError(xhr, status, err) {
    this.setState({ status: 'error', error: err.toString() });
  },
  loadWeather: function loadWeather(url) {
    var _this = this;

    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function success(data, status, xhr) {
        console.log('data', data);
        if (data.cod === '404') {
          _this.ajaxError(xhr, status, "Location not found.");
        } else {
          _this.setState({ status: 'loaded', data: data });
          var $node = $(_this.refs.weatherContainer.parentNode);
          var condition = _this.resolveConditionCode(_this.state.data.weather[0].id);

          $node.attr('class', condition).waitForImages({
            finished: function finished() {
              $node.addClass('loaded');
            },
            waitForAll: true
          });
        }
      },
      error: this.ajaxError

    });
  },
  componentDidMount: function componentDidMount() {
    var _this2 = this;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var url = _this2.props.api + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
        _this2.loadWeather(url);
      }, function () {
        _this2.setState({ status: 'error' });
        console.log('error', 'Unable to retrieve location');
      });
    } else {
      this.setState({ status: 'error' });
    }
  },
  render: function render() {
    if (this.state.status === 'loaded') {
      return React.createElement(
        'div',
        { className: 'weather', ref: 'weatherContainer' },
        React.createElement(TemperatureContainer, {
          temp: this.state.data.main.temp,
          location: this.state.data.name + ', ' + this.state.data.sys.country,
          measurementSystem: this.state.measurementSystem,
          onMeasurementSystemChange: this.handleMeasurementSystemChange }),
        React.createElement(WeatherDetailsContainer, {
          data: this.state.data,
          measurementSystem: this.state.measurementSystem })
      );
    } else if (this.state.status === 'loading') {
      return React.createElement(
        'div',
        { className: 'message loading' },
        React.createElement(
          'p',
          null,
          'Loading'
        ),
        React.createElement(
          'svg',
          { className: 'loading-icon', x: '0', y: '0', viewBox: '0 0 50 50' },
          React.createElement('path', { d: 'M46.6 29h3C47.8 40.9 37.5 50 25 50S2.2 40.9 0.3 29h3C5.2 39.2 14.2 47 25 47S44.8 39.2 46.6 29z' }),
          React.createElement('path', { d: 'M3.4 21h-3C2.2 9.1 12.5 0 25 0s22.8 9.1 24.7 21h-3C44.8 10.8 35.8 3 25 3S5.2 10.8 3.4 21z' })
        )
      );
    } else {
      return React.createElement(
        'div',
        { className: 'message error' },
        React.createElement(
          'h3',
          null,
          'Whoops!'
        ),
        React.createElement(
          'p',
          null,
          'It looks like we misplaced you, Sorry! :('
        ),
        React.createElement(
          'p',
          { className: 'message__instructions' },
          'Enter you current city or postal code, followed by the country abbreviation and we\'ll see if we can find you again!'
        ),
        React.createElement(WeatherForm, { onLocationSubmit: this.handleFormSubmit, location: this.state.searchLocation }),
        React.createElement(
          'p',
          { className: 'message__error' },
          this.state.error
        )
      );
    }
  }
});

ReactDOM.render(React.createElement(Weather, { api: apiUrl }), document.getElementById('content'));