(function() {
  var config, demo, netBattler;

  netBattler = function($location, $scope, $interval, $mdDialog, uuid) {
    var activateMeter, canUseMeter, canclick, chargeIncrement, chargeWeapon, currentAttack, currentGridX, currentGridY, fill_rotation, fix_rotation, fixedWeapon_rotation, gameIncrement, gameLoop, gridX, gridY, moveCurrentAttack, num, removeRoutine, rotation, rotationlock, side, startWeaponLoop, updateWepRotain, updatemeter, vm, weaponInterval, weapon_rotation, wepLock, wepRotation, _i;
    vm = $scope;
    vm.grids = [];
    side = 'ally';
    canclick = true;
    currentGridY = 1;
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
      topPos = 18 + 6 * currentGridY;
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
    vm.routines = [
      {
        name: 'sword',
        image: "image1",
        smallImage: "image2",
        description: "it cuts things",
        uuid: uuid["new"](),
        empty: false
      }, {
        name: 'gun',
        image: "image1",
        smallImage: "image2",
        description: "it shoots things",
        uuid: uuid["new"](),
        empty: false
      }, {
        name: 'bomb',
        image: "image1",
        smallImage: "image2",
        description: "it makes things go boom!",
        uuid: uuid["new"](),
        empty: false
      }
    ];
    vm.setCurrentRoutine = function(routine) {
      return vm.currentRoutine = routine;
    };

    /* Weapon */
    vm.mainweapon = {
      name: 'gun',
      image: "image1",
      smallImage: "image2",
      description: "it shoots things",
      uuid: uuid["new"](),
      empty: false
    };
    wepRotation = Math.floor(0 * 180);
    weapon_rotation = wepRotation;
    fixedWeapon_rotation = wepRotation * 2;
    chargeIncrement = Math.floor(.3 * 180);
    weaponInterval = {};
    wepLock = 0;
    vm.startWeapon = function() {
      wepLock = 0;
      return weaponInterval = $interval(chargeWeapon, 1000);
    };
    currentAttack = {};
    startWeaponLoop = function(wep, charge) {};
    moveCurrentAttack = function() {};
    vm.fireWeapon = function() {
      var lastItem;
      $interval.cancel(weaponInterval);
      wepLock = 1;
      updateWepRotain(wepRotation);
      lastItem = vm.loadedRoutines.length(-1);
      if (vm.loadedRoutines[lastItem].empty) {
        startWeaponLoop(vm.mainweapon, wepRotation);
      } else {
        startWeaponLoop(vm.loadedRoutines[lastItem], wepRotation);
        vm.loadedRoutines.splice(0, lastItem);
        vm.loadedRoutines.splice(0, 0, {
          empty: true
        });
      }
      return wepRotation = 0;
    };
    updateWepRotain = function(rot) {
      weapon_rotation = rot;
      return fixedWeapon_rotation = rot * 2;
    };
    chargeWeapon = function() {
      if (wepRotation < 180) {
        wepRotation += chargeIncrement;
        if (wepRotation > 180) {
          wepRotation = 180;
        }
        if (wepLock) {
          wepRotation = 0;
        }
        return updateWepRotain(wepRotation);
      }
    };
    vm.getCurrentWeaponImage = function() {
      var routineLength;
      routineLength = vm.loadedRoutines.length - 1;
      if (vm.loadedRoutines[routineLength].empty) {
        return vm.mainweapon.smallImage;
      } else {
        return vm.loadedRoutines[routineLength].smallImage;
      }
    };
    vm.getWeaponFillStyle = function() {
      return {
        "-webkit-transform": 'rotate(' + weapon_rotation + 'deg)',
        "-ms-transform": 'rotate(' + weapon_rotation + 'deg)',
        transform: 'rotate(' + weapon_rotation + 'deg)'
      };
    };
    vm.getWeaponCircleFillStyle = function() {
      return {
        "-webkit-transform": 'rotate(' + fixedWeapon_rotation + 'deg)',
        "-ms-transform": 'rotate(' + fixedWeapon_rotation + 'deg)',
        transform: 'rotate(' + fixedWeapon_rotation + 'deg)'
      };
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
      vm.meterText = 'Loading';
      rotationlock = 0;
      rotation = -gameIncrement;
      return $mdDialog.hide();
    };
    return vm.openItemSelector = function() {
      var alert;
      if (rotationlock === 1) {
        vm.loadedRoutines = [
          {
            empty: true
          }, {
            empty: true
          }, {
            empty: true
          }
        ];
        alert = {
          title: 'Attention',
          templateUrl: 'views/cardSelection.html',
          scope: vm,
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
