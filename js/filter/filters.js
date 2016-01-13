// This filter will filter the partner name or country. currentOption can be Country or (Partner's) Name. currentFilter is the selected row 
// on the filter dropdown listbox. This row contains the tableId that specifies the index of the row in the partner table if the currentOpton is 
// Name, and a list of tableIds if the currentOption is Country since there are many partners in the same country. 
// The tableId is used in the filter for better performance instead of the whole table scan
angular.module('appFilters', []).filter('filterByName', function () {
    return function (input, currentFilter, currentOption) {
        if ((currentOption == undefined) || (currentFilter == undefined) || (currentFilter.name == undefined) ||
            (input == undefined))
            return input;
        var resultTable = [];
        var searchByPartner = (currentOption.indexOf('Name') != -1);
     
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