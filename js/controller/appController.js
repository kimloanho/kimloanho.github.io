angular.module('partnersApp').controller('appController', function ($scope, $http, appService) {


    // check if this country is already in the countries list and insert it if it's not there
    $scope.checkToInsert = function (countries, countryName, tableId) {
        for (var i = 0; i < countries.length; i++) {
            // if found, only insert the tableId into the entry tableIds list
            if (countries[i]['name'].indexOf(countryName) != -1) {
                var tableIds = countries[i]['tableIds'];
                if (tableIds != undefined) {
                    tableIds[tableIds.length] = tableId;
                }
                return;
            }
        }
        // not found insert the country entry to the country list
        var country = { name: '', tableIds: [] };
        country['name'] = countryName;
        country['tableIds'][0] = tableId;
        countries[countries.length] = country;
    }

    // this function stores the partner country info (name + a list of tableIds) and the list of countries will be 
    // inserted into the filter dropdown listbox when the selected filter category is Country 
    $scope.addToCountries = function (countries, tableId, countryObject) {
        var partnerCountryStr = '';
        var countryName = '';
        for (var i = 0; i < countryObject.length; i++) {
            if ('name' in countryObject[i]) { 
                countryName = countryObject[i]['name'];
                if (i > 0) {
                    partnerCountryStr += ', ';
                }

               partnerCountryStr += countryName;
               $scope.checkToInsert(countries, countryName, tableId);
           }
        }
        return partnerCountryStr;
    };

    // create a row of data to be inserted into the partner table. The partnerInfoList is the model for the table and the filter dropdown listbox when
    // the selected filter category is Name
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
        partnerInfo.country = '';
        // insert country info
        if ((countryObject != undefined) && (countryObject.length > 0)) {
            partnerInfo.country = $scope.addToCountries(countries, tableId, countryObject);
         }
        return partnerInfo
    };

    // call appService to retrieve partner info
    appService.getPartners().then(function (results) {
        var partnerInfoList = [];
        var countries = [];
        $scope.total = results.data.paging.total;

        var options = ['', 'Country', 'Name'];
        // build partner model, country model
        $(results.data.partners).each(function (index, rowData) {
            partnerInfoList[partnerInfoList.length] = $scope.createPartnerInfo(rowData, countries, index);

        });
        $scope.partners = partnerInfoList;
        $scope.optionList = options;
        $scope.countries = countries;
        $scope.currentOption = '';

        // this handler is called when there is a change in the option dropdown listbox (Country or Name)
        $scope.optionHandler = function () {
            var opt = $scope.currentOption;
            if ((opt != undefined) && (opt.length > 0)) {
                if (opt.indexOf('Name') != -1) { // filter by Name
                    $scope.filterList = $scope.partners;
                }
                else {  // filter by country
                    $scope.filterList = $scope.countries;
                }
            }
            else { // no filter
                $scope.currentFilter = undefined;
            }
            return true;
        }

        // this handler is called when there is a change in the filter dropdown listbox.
        $scope.filterChangeHandler = function () {
            var currentFilter = $scope.currentFilter;
            if (currentFilter != undefined) {
                if ($scope.currentFilter.name == '') { // no filter
                    $scope.currentFilter = undefined;
                }
            }

            return true;
        }

    }, function (err, exception) { // display error or exception
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

