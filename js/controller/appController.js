angular.module('partnersApp').controller('appController', function ($scope, $http, appService) {

    $scope.addToCountries = function (countries, value, tableId) {
        for (var i = 0; i < countries.length; i++) {
            if (countries[i]['name'] == value) {
                var tableIds = countries[i]['tableIds'];
                if (tableIds != undefined) {
                    tableIds[tableIds.length] = tableId;
                }
                return;
            }
        }
        var country = { name: '', tableIds: [] };
        country['name'] = value;
        country['tableIds'][0] = tableId;
        countries[countries.length] = country;

    };

    $scope.createPartnerInfo = function (rowData, countries, tableId) {
        var partnerInfo = {};
        partnerInfo['tableId'] = tableId;
        partnerInfo.id = rowData['id'];
        partnerInfo.name = rowData['name'];
        partnerInfo.status = rowData['status'];
        partnerInfo.rating = rowData['rating'];
        partnerInfo.start_date = rowData['start_date'];
        partnerInfo.delinquency_rate = rowData['delinquency_rate'];
        partnerInfo.default_rate = rowData['default_rate'];
        partnerInfo.total_amount_raised = rowData['total_amount_raised'];
        partnerInfo.loans_posted = rowData['loans_posted'];
        partnerInfo.portfolio_yield = rowData['portfolio_yield'];
        partnerInfo.profitability = rowData['profitability'];
        var countryObject = rowData['countries'];
        if ((countryObject) && (countryObject != undefined) && ('name' in countryObject[0])) {
            partnerInfo.country = countryObject[0].name;
            $scope.addToCountries(countries, partnerInfo.country, tableId);
        }
        return partnerInfo
    };

    appService.getPartners().then(function (results) {
        var partnerInfoList = [];
        var countries = [];
        $scope.total = results.data.paging.total;

        var options = ['', 'Country', 'Partner'];
        $(results.data.partners).each(function (index, rowData) {
            partnerInfoList[partnerInfoList.length] = $scope.createPartnerInfo(rowData, countries, index);

        });
        $scope.partners = partnerInfoList;
        $scope.optionList = options;
        $scope.countries = countries;
        $scope.currentOption = '';

        $scope.optionHandler = function () {
            var opt = $scope.currentOption;
            if ((opt != undefined) && (opt.length > 0)) {
                if (opt.indexOf('Partner') != -1) {
                    $scope.filterList = $scope.partners;
                }
                else {
                    $scope.filterList = $scope.countries;
                }
            }
            else {
                $scope.currentFilter = undefined;
            }
            return true;
        }


        $scope.filterChangeHandler = function () {
            var currentFilter = $scope.currentFilter;
            if (currentFilter != undefined) {
                if ($scope.currentFilter.name == '') {
                    $scope.currentFilter = undefined;
                }
            }

            return true;
        }

    }, function (err, exception) {
        var msg = '';
        if (err.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (err.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (err.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + err.responseText;
        }
        document.write('<strong>' + msg + '</strong>');
    });

});

