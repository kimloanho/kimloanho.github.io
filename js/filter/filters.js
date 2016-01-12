angular.module('appFilters', []).filter('filterByName', function () {
    return function (input, currentFilter, currentOption) {
        if ((currentOption == undefined) || (currentFilter == undefined) || (currentFilter.name == undefined) ||
            (input == undefined))
            return input;
        var resultTable = [];
        var searchByPartner = (currentOption.indexOf('Partner') != -1);
     
        if (searchByPartner) {
            resultTable[0] = input[currentFilter['tableId']];
        }
        else {
            var ids = [];
            ids = currentFilter['tableIds'];
            if (ids != undefined) {
                for (var i = 0; i < ids.length; i++) {
                    resultTable[i] = input[ids[i]];
                }
            }
        }
        return resultTable;

    };
});