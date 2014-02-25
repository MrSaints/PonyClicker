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

$MLP.controller('indexCtrl', ['$scope', '$debounce', '$interval', function ($scope, $debounce, $interval) {
    var $this = this;

    /*
     * Count (Clicks)
     */
    $scope.count = Number(localStorage.getItem('count')) || 0;
    $scope.incrementCount = function () {
        $scope.count += 1;
    }

    /*
     * Count (Upgrades)
     */
    $this.incrementUpCount = function () {
        var upCount = 0;
        angular.forEach($scope.upgrades, function(value, key) {
           upCount += (value.rate * value.total);
        });
        $scope.count += upCount;
    }
    $interval($this.incrementUpCount, 1000);

    /*
     * Upgrades
     */
    $scope.upgrades = JSON.parse(localStorage.getItem('upgrades')) || { 
        autoclicker: {
            cost: 20,
            multiplier: 1.1,
            rate: 0.1,
            total: 0
        }
    };

    // Autoclicker
    $scope.buyAutoclicker = function () {
        if ($scope.count < $scope.upgrades.autoclicker.cost)
            return;

        $scope.count -= $scope.upgrades.autoclicker.cost;
        $scope.upgrades.autoclicker.total += 1;
        $scope.upgrades.autoclicker.cost *= $scope.upgrades.autoclicker.multiplier;
    }

    /*
     * Saving
     */
    $this.save = function (newValue, oldValue) {
        console.log('Saving...');
        localStorage.setItem('count', newValue);
        localStorage.setItem('upgrades', JSON.stringify($scope.upgrades));
    }

    $scope.$watch('count', $debounce($this.save, 3000), true);

    window.onbeforeunload = function() {
        console.log('Forcing save...');
        $this.save($scope.count);
    };
}]);