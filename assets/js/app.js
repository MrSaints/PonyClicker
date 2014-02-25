$(document).foundation();

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
            upCount += ($this.defaultUpgrades[key].rate * value.total);
        });
        $scope.count += upCount;
    }
    $interval($this.incrementUpCount, 1000);

    /*
     * Upgrades
     */
    $this.defaultUpgrades = [
        {
            type: "Autoclicker",
            cost: 20,
            total: 0,
            multiplier: 1.5,
            rate: 0.1
        },
        {
            type: "Apple Crumble",
            cost: 100,
            total: 0,
            multiplier: 1.3,
            rate: 0.5
        },
        {
            type: 'Club House',
            cost: 300,
            total: 0,
            multiplier: 1.1,
            rate: 1
        }
    ];
    $this.storedUpgrades = JSON.parse(localStorage.getItem('upgrades'));
    $scope.upgrades = $this.storedUpgrades || $this.defaultUpgrades;

    $scope.buyUpgrade = function (type) {
        if ($scope.count < $scope.upgrades[type].cost)
            return;

        $scope.count -= $scope.upgrades[type].cost;
        $scope.upgrades[type].total += 1;
        $scope.upgrades[type].cost *= $scope.defaultUpgrades[type].multiplier;
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