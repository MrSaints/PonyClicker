var $MLP = angular.module('ponyClicker', []);

$MLP.controller('indexCtrl', ['$scope', '$interval', function ($scope, $interval) {
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
            multiplier: 1.5,
            rate: 0.1,
            total: 0
        }
    };

    $scope.buyUpgrade = function (type) {
        if ($scope.count < $scope.upgrades[type].cost)
            return;

        $scope.count -= $scope.upgrades[type].cost;
        $scope.upgrades[type].total += 1;
        $scope.upgrades[type].cost *= $scope.upgrades[type].multiplier;
    }

    /*
     * Saving
     */
    $this.save = function (newValue, oldValue) {
        console.log('Saving...');
        localStorage.setItem('count', newValue);
        localStorage.setItem('upgrades', JSON.stringify($scope.upgrades));
    }

    window.onbeforeunload = function() {
        console.log('Forcing save...');
        $this.save($scope.count);
    };

    $interval($this.save, 5000);
}]);