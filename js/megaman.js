(function() {
  var config, demo, netBattler;

  netBattler = function($location, $scope, $interval, $mdDialog, uuid) {
    var activateMeter, canUseMeter, canclick, currentGridX, currentGridY, fill_rotation, fix_rotation, gameIncrement, gameLoop, gridX, gridY, num, removeRoutine, rotation, rotationlock, side, updatemeter, uuid1, uuid2, vm, _i;
    vm = $scope;
    vm.grids = [];
    side = 'ally';
    canclick = true;
    currentGridY = 2;
    currentGridX = 0;
    gridX = 0;
    gridY = 0;
    for (num = _i = 1; _i <= 18; num = ++_i) {
      if (num % 6 < 4 && num % 6 !== 0) {
        canclick = true;
        side = 'ally';
      } else {
        canclick = false;
        side = 'enemy';
      }
      gridY = (function() {
        switch (false) {
          case !(num < 6):
            return 0;
          case !(num < 12):
            return 1;
          default:
            return 2;
        }
      })();
      gridX = (num % 3) - 1;
      if (gridX === -1) {
        gridX = 2;
      }
      vm.grids.push({
        X: gridX,
        Y: gridY,
        side: side,
        canclick: canclick
      });
    }
    vm.gridBottomRange = function() {
      return new Array(6);
    };
    vm.moveCharacter = function(grid) {
      if (grid.Y === currentGridY - 1 || grid.Y === currentGridY + 1 || grid.Y === currentGridY) {
        if (grid.X === currentGridX - 1 || grid.X === currentGridX + 1 || grid.X === currentGridX) {
          if (grid.X === currentGridX || grid.Y === currentGridY) {
            currentGridY = grid.Y;
            return currentGridX = grid.X;
          }
        }
      }
    };
    vm.getCurrentPosistion = function() {
      var leftPos, topPos;
      topPos = 14 + 6 * currentGridY;
      leftPos = 5 + 15 * currentGridX;
      return {
        top: topPos + '%',
        left: leftPos + '%'
      };
    };
    rotation = Math.floor(0 * 180);
    fill_rotation = rotation;
    fix_rotation = rotation * 2;
    vm.getFillStyle = function() {
      return {
        "-webkit-transform": 'rotate(' + fill_rotation + 'deg)',
        "-ms-transform": 'rotate(' + fill_rotation + 'deg)',
        transform: 'rotate(' + fill_rotation + 'deg)'
      };
    };
    vm.getCircleFillStyle = function() {
      return {
        "-webkit-transform": 'rotate(' + fix_rotation + 'deg)',
        "-ms-transform": 'rotate(' + fix_rotation + 'deg)',
        transform: 'rotate(' + fix_rotation + 'deg)'
      };
    };
    vm.setupItemStyle = function(item) {};
    gameIncrement = Math.floor(.08 * 180);
    vm.selectItem = function() {};
    rotationlock = 0;
    vm.addItem = function() {};
    vm.meterText = 'Charging';
    canUseMeter = false;
    activateMeter = function() {
      vm.meterText = 'Ready';
      return canUseMeter = true;
    };
    updatemeter = function() {
      if (rotation < 180 && rotationlock === 0) {
        rotation += gameIncrement;
        if (rotation > 180) {
          rotation = 180;
        }
        fill_rotation = rotation;
        fix_rotation = rotation * 2;
        if (rotation === 180) {
          rotationlock = 1;
          return activateMeter();
        }
      }
    };
    gameLoop = $interval(updatemeter, 1000);
    vm.loadedRoutines = [
      {
        empty: true
      }, {
        empty: true
      }, {
        empty: true
      }
    ];
    uuid1 = uuid["new"]();
    uuid2 = uuid["new"]();
    vm.routines = [
      {
        name: 'sword',
        image: "image1",
        description: "it cuts things",
        uuid: uuid1
      }, {
        name: 'gun',
        image: "image1",
        description: "it shoots things",
        uuid: uuid2
      }
    ];
    vm.setCurrentRoutine = function(routine) {
      return vm.currentRoutine = routine;
    };

    /* Game items */
    removeRoutine = function(routine) {
      var aroutine, found, index, _j, _len, _ref;
      index = 0;
      found = -1;
      _ref = vm.routines;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        aroutine = _ref[_j];
        if (routine.uuid === aroutine.uuid) {
          found = index;
        }
        index++;
      }
      return vm.routines.splice(found, 1);
    };
    vm.dropped = function($index) {
      vm.loadedRoutines[$index] = vm.currentRoutine;
      removeRoutine(vm.currentRoutine);
      return vm.currentRoutine = '';
    };
    vm.executeRoutines = function() {
      vm.meterText = 'Charging';
      rotationlock = 0;
      rotation = -gameIncrement;
      return $mdDialog.hide();
    };
    return vm.openItemSelector = function() {
      var alert;
      if (rotationlock === 1) {
        vm.loadedRoutines = [];
        alert = {
          title: 'Attention',
          templateUrl: 'views/cardSelection.html',
          scope: $scope,
          preserveScope: true,
          ok: 'submit'
        };
        return $mdDialog.show(alert);
      }
    };
  };

  netBattler.$inject = ['$location', '$scope', '$interval', '$mdDialog', 'uuid'];

  demo = function($location, $scope) {
    var vm;
    vm = $scope;
    return vm.loadGame = function() {
      return $location.path('/battle');
    };
  };

  demo.$inject = ['$location', '$scope'];

  config = function($routeProvider) {
    return $routeProvider.when('/battle', {
      title: 'battle',
      templateUrl: 'views/battle.html',
      controller: 'netBattler as vm'
    }).otherwise({
      title: 'demo',
      templateUrl: 'views/demo.html',
      controller: 'demo as vm'
    });
  };

  angular.module('netMananger', ['ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize', 'ngMaterial', 'lvl.directives.dragdrop']).config(config).controller('netBattler', netBattler).controller('demo', demo);

}).call(this);
