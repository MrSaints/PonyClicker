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
    $this.defaultUpgrades = { 
        "Autoclicker": {
            cost: 20,
            multiplier: 1.3,
            rate: 0.1,
            total: 0
        },
        "Apple Crumble": {
            cost: 300,
            multiplier: 1.1,
            rate: 0.3,
            total: 0
        }
    };
    $this.storedUpgrades = JSON.parse(localStorage.getItem('upgrades'));
    $scope.upgrades = $this.storedUpgrades || $this.defaultUpgrades;

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

    /*
     * Validate local storage (resets everything for now)
     */
    $this.validateData = function () {
        var update = false;
        angular.forEach($this.defaultUpgrades, function(value, key) {
            if (update) {
                return;
            } else if (typeof $this.storedUpgrades[key] === "undefined" 
                        || $this.storedUpgrades[key] === null) {
                $scope.upgrades = $this.defaultUpgrades;
                update = true;
            }
        });
    }
    $this.validateData();
}]);