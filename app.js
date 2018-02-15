var myApp = angular.module("myApp", ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/home', {
            templateUrl: '/index.html',
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

myApp.controller('myController', ['$scope', '$http', '$timeout', ($scope, $http, $timeout) => {

    $scope.getWeather = () => {
        var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${$scope.location}&key=AIzaSyCb7BZyZVgQFcqoSr_meenRTskag_ZveiU&language=en`
        $http.get(geocodeUrl)
            .then((response) => {
                if (response.data.status === 'ZERO_RESULTS') {
                    $scope.error = `Unable to find the location "${$scope.location}"`;
                    hideIcons();
                }
                $scope.location = response.data.results[0].formatted_address;
                var lat = response.data.results[0].geometry.location.lat;
                var lng = response.data.results[0].geometry.location.lng;

                const proxyurl = "https://cors-anywhere.herokuapp.com/";
                const url = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`;
                $http.get(proxyurl + url)
                    .then((response) => {
                        var temperatureF = response.data.currently.temperature;
                        var type = response.data.currently.precipType;
                        var fToC = (temperatureF) => {
                            var fTemp = temperatureF;
                            var fToCel = ((fTemp - 32) * 5 / 9);
                            var temperature = fToCel.toFixed(2);
                            return temperature;
                        }
                        var temperature = fToC(temperatureF);
                        var summary = response.data.currently.summary;
                        var humidity = Math.floor((response.data.currently.humidity) * 100);
                        $scope.F = temperatureF
                        $scope.weather = `${$scope.location} : It is currently ${temperature}`;
                        $scope.description = `${summary}, with humidity of ${humidity}`;
                        $scope.weather == true;

                        if (type == "snow") {
                            $scope.snow = true;
                        }
                        if (type == "rain") {
                            $scope.rain = true;
                        }
                        if (type == "sunny" || summary == "Clear") {
                            $scope.sun = true;
                        }
                        if (type == "cloudy" || summary == "Partly Cloudy") {
                            $scope.cloudy = true;
                        }
                        if (summary == "Foggy" || summary == "Overcast" || summary == "Mostly Cloudy") {
                            $scope.clouds = true;
                        }

                        animateWeatherInfo();
                        animateIcon();
                    })
                    .catch(() => console.log("Can’t access " + url + " response."))
                hideIcons();
                $scope.error = "";
            })
    };
}]);

var animateWeatherInfo = () => {
    anime.timeline()
        .add({
            targets: '.ml5 .line',
            opacity: [0, 1],
            scaleX: [0, 1],
            easing: "easeInOutExpo",
            duration: 0
        }).add({
            targets: '.ml5 .line',
            duration: 2000,
            easing: "easeOutExpo",
            translateY: function(e, i, l) {
                var offset = -3 + 0.625 * 2 * i;
                return offset + "em";
            }
        }).add({
            targets: '.ml5 .letters-right',
            opacity: [0, 1],
            translateX: ["-3em", 0],
            easing: "easeOutExpo",
            duration: 2000,
            offset: '-=600'
        })
};

var animateIcon = () => {
    anime.timeline()
        .add({
            targets: '.ml6 .line',
            duration: 2000,
            easing: "easeOutExpo",
            translateY: function(e, i, l) {
                var offset = -3 + 0.625 * i;
                return offset + "em";
            }
        }).add({
            targets: '.ml6 .letters-right',
            opacity: [0, 1],
            translateX: ["-7em", 0],
            easing: "easeOutExpo",
            duration: 2000,
            offset: '-=600'
        })
};

var hideIcons = () => {
    $scope.snow = "";
    $scope.rain = "";
    $scope.sun = "";
    $scope.cloudy = "";
    $scope.clouds = "";
    $scope.weather = false;
};
