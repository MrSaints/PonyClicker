$(document).foundation();

var $effects = $('.effects');
var $audio = new Audio;
var $MLP = angular.module('ponyClicker', []);

$MLP.controller('indexCtrl', ['$scope', '$interval', function ($scope, $interval) {
    var $this = this;

    /*
     * Effects
     */
    $scope.muted = localStorage.getItem('mute') === "true";
    $scope.toggleMute = function () {
        $scope.muted = !$scope.muted;
        localStorage.setItem('mute', $scope.muted);
    }
    $this.initEffects = function (x, y) {
        var $ugh = $('<p class="ugh animated fadeOutUp"/>');

        $ugh.css('left', x - 36 + Math.random() * 10 + "px");
        $ugh.css('top', y - 20 + Math.random() * 10 + "px");
        $ugh.text('Ughh!');

        $effects.append($ugh);

        if ($scope.muted) return;

        if ($audio.canPlayType('audio/mpeg;')) {
            new Audio('assets/audio/ugh.mp3').play();
        } else {
            new Audio('assets/audio/ogg.mp3').play();
        }

        // Clear garbage
        if ($this.timeout)
            clearTimeout($this.timeout);

        $this.timeout = setTimeout(function () {
            console.log('Fired!');
            $effects.empty();
        }, 1000);
    }

    /*
     * Characters
     */
    $scope.characters = [
        {
            id: 'twilight',
            name: 'Twilight Sparkle'
        },
        {
            id: 'fluttershy',
            name: 'Fluttershy'
        },
        {
            id: 'applejack',
            name: 'Applejack'
        },
        {
            id: 'pinkie',
            name: 'Pinkie Pie'
        },
        {
            id: 'rarity',
            name: 'Rarity'
        },
        {
            id: 'rainbow',
            name: 'Rainbow Dash'
        }
    ]
    $scope.character = localStorage.getItem('character') || 'twilight';
    $scope.changeCharacter = function (id) {
        $scope.character = id;
        localStorage.setItem('character', id);
    }

    /*
     * Count (Clicks)
     */
    $scope.count = Number(localStorage.getItem('count')) || 0;
    $scope.incrementCount = function (e) {
        $this.initEffects(e.offsetX, e.offsetY);
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
        $scope.upgrades[type].cost *= $scope.upgrades[type].multiplier;

        localStorage.setItem('upgrades', JSON.stringify($scope.upgrades));
    }

    /*
     * Saving
     */
    $this.save = function (newValue, oldValue) {
        console.log('Saving...');
        localStorage.setItem('count', newValue);
    }

    window.onbeforeunload = function() {
        console.log('Forcing save...');
        $this.save($scope.count);
    };

    $interval($this.save, 5000);

    /*
     * Reset
     */
    $scope.reset = function (type) {
        switch (type) {
            case 1:
                $scope.upgrades = $this.defaultUpgrades;
                break;
            case 2:
                $scope.count = 0;
                break;
            default:
                $scope.upgrades = $this.defaultUpgrades;
                $scope.count = 0;
                localStorage.clear();
        }
    }
}]);