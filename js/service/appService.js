// the service to get data (Kiva partner info) from the Kiva web service
angular.module('partnersApp').factory('appService', ['$http', function ($http) {

        var serviceBase = "http://api.kivaws.org/v1/partners.json";
        var appsServiceFactory = {};

        var _getPartners = function () {
            return $http.get(serviceBase).then(function (results) {
                return results;
            });
        };
        appsServiceFactory.getPartners = _getPartners;
        return appsServiceFactory;
}]);


    