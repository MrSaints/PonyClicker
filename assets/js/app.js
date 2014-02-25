angular.module('ngDebounce', []).factory('$debounce', function ($timeout, $q) {
    return function (func, wait, immediate) {
        var timeout;
        var deferred = $q.defer();
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if(!immediate) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
            };
            var callNow = immediate && !timeout;
            if ( timeout ) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
                deferred.resolve(func.apply(context,args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
});

var $MLP = angular.module('ponyClicker', ['ngDebounce']);

$MLP.controller('indexCtrl', ['$scope', '$debounce', function ($scope, $debounce) {
    var $this = this;

    $scope.count = Number(localStorage.getItem('count')) || 0;
    $scope.incrementCount = function () {
        return $scope.count += 1;
    }

    var saveCount = function (newValue, oldValue) {
        console.log('Saving...');
        localStorage.setItem('count', newValue);
    }

    $scope.$watch('count', $debounce(saveCount, 500), true);

    window.onbeforeunload = function() {
        console.log('Forcing save...');
        saveCount($scope.count);
    };
}]);