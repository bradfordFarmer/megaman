#  cfcoptions : { "out": "../js/"   }




netBattler = ($location,$scope,$interval, $mdDialog , uuid)->
    vm=$scope
    vm.grids= []
    side ='ally'
    canclick =true
    currentGridY= 1;
    currentGridX= 0;
    gridX=0
    gridY=0
    for num in  [1..18]
        if num % 6 <4 && num % 6 isnt 0
            canclick =true
            side ='ally'
        else 
            canclick=false
            side ='enemy'
        gridY= switch 
            when num < 6 then 0
            when num < 12 then 1
            else 2
        gridX= (num%3)-1
        if gridX is -1
            gridX =2
        vm.grids.push {X: gridX,Y: gridY, side:side,canclick:canclick}
    
    vm.gridBottomRange = ()->
        return new Array(6);
    
    vm.moveCharacter = (grid)->
        if grid.Y is currentGridY-1 || grid.Y is currentGridY+1 || grid.Y is currentGridY
            if grid.X is currentGridX-1 || grid.X is currentGridX+1 || grid.X is currentGridX
                if grid.X is currentGridX || grid.Y is currentGridY
                    currentGridY= grid.Y
                    currentGridX = grid.X
    vm.getCurrentPosistion =  ()->
        topPos = 18+6*currentGridY
        leftPos =  5+15*currentGridX
        return { top:topPos+'%', left : leftPos+'%'}
    
    rotation = Math.floor(0 * 180);
    fill_rotation = rotation;
    fix_rotation = rotation * 2;
    
    vm.getFillStyle = ()->
        return  { 
            "-webkit-transform" : 'rotate(' + fill_rotation + 'deg)', 
            "-ms-transform" : 'rotate(' + fill_rotation + 'deg)', 
            transform: 'rotate(' + fill_rotation + 'deg)'
        }  
    vm.getCircleFillStyle =()->
        return  { 
            "-webkit-transform" : 'rotate(' + fix_rotation + 'deg)', 
            "-ms-transform" : 'rotate(' + fix_rotation + 'deg)', 
            transform: 'rotate(' + fix_rotation + 'deg)'
        }  
    
    
    vm.setupItemStyle =(item)->
    
    gameIncrement =  Math.floor(.08 * 180)
    vm.selectItem = ()->
    rotationlock = 0
    vm.addItem = ()-> 
    vm.meterText ='Charging'
    canUseMeter = false;
    activateMeter= ()->
        vm.meterText= 'Ready'
        canUseMeter=true
    
    
    updatemeter = ()->
        if rotation < 180 and rotationlock is 0
            rotation+=gameIncrement
            if rotation > 180
                rotation = 180
            fill_rotation = rotation;
            fix_rotation = rotation * 2;
            if rotation is 180 
                rotationlock= 1
                activateMeter()
    
    gameLoop = $interval(updatemeter, 1000);
    vm.loadedRoutines = [{empty:true},{empty:true},{empty:true}];
    vm.routines=[{name:'sword', image:"image1", smallimage: "image2" , description:"it cuts things" , uuid:uuid.new(), empty:false},{ name:'gun', image:"image1", smallimage: "image2" , description:"it shoots things",uuid:uuid.new(), empty:false},{ name:'bomb', image:"image1", smallimage: "image2" , description:"it makes things go boom!",uuid:uuid.new(), empty:false} ] 
    vm.setCurrentRoutine=(routine)->
        vm.currentRoutine= routine
    
    ### Weapon ###
    mainweapon = { name:'gun', image:"image1", smallimage: "image2", description:"it shoots things",uuid:uuid.new(), empty:false}
    wepRotation = Math.floor(0 * 180);
    weapon_rotation = wepRotation;
    fixedWeapon_rotation = wepRotation * 2;
    chargeIncrement =   Math.floor(.3 * 180)
    weaponInterval = {}
    wepLock=0
    vm.startWeapon = ()-> 
        wepLock =0
        weaponInterval = $interval(chargeWeapon, 1000);
    currentAttack= {}
    
    startWeaponLoop = (wep, charge)->
    
    moveCurrentAttack= ()->
    
    vm.fireWeapon=()->
        $interval.cancel weaponInterval
        wepLock=1;
        updateWepRotain wepRotation
        
        ## fire a weapon here ##
        if loadedRoutine[0].empty 
            startWeaponLoop(wep,wepRotation)
        else
            startWeaponLoop(loadedRoutine[0],wepRotation)
            loadedRoutine.splice(0,1)
            loadedRoutine.push {empty:true}
        wepRotation =0

    updateWepRotain =(rot)->
        weapon_rotation = rot;
        fixedWeapon_rotation = rot * 2;

    chargeWeapon=()->
        if wepRotation < 180 
            wepRotation +=chargeIncrement
            if wepRotation > 180
                wepRotation = 180
            if wepLock 
                wepRotation=0
            updateWepRotain wepRotation
            
    getCurrentWeaponImage=()->
        if loadedRoutine[0].empty
            return mainweapon.smallImage
        else 
            return loadedRoutine[0].smallImage
            
    vm.getWeaponFillStyle= ()->
        return  { 
            "-webkit-transform" : 'rotate(' + weapon_rotation + 'deg)', 
            "-ms-transform" : 'rotate(' + weapon_rotation + 'deg)', 
            transform: 'rotate(' + weapon_rotation + 'deg)'
        }  
    vm.getWeaponCircleFillStyle =()->
        return  { 
            "-webkit-transform" : 'rotate(' + fixedWeapon_rotation + 'deg)', 
            "-ms-transform" : 'rotate(' + fixedWeapon_rotation + 'deg)', 
            transform: 'rotate(' + fixedWeapon_rotation + 'deg)'
        }  
    
    
    ### Game items ###
    
    removeRoutine = (routine)->
        index =0 
        found=-1
        for aroutine in vm.routines 
            if routine.uuid  is aroutine.uuid
                found =index
            index++ 
        vm.routines.splice found,1
    vm.dropped= ($index)->
        vm.loadedRoutines[$index] = vm.currentRoutine
        removeRoutine vm.currentRoutine
        vm.currentRoutine= ''
    
      
    
    vm.executeRoutines = () ->
         vm.meterText ='Loading'
         rotationlock = 0
         rotation = -gameIncrement
         $mdDialog
            .hide()
    vm.openItemSelector = ()->
        if rotationlock is 1      
            vm.loadedRoutines= []
            alert =  {
                title: 'Attention',
                templateUrl: 'views/cardSelection.html',
                scope: $scope, 
                preserveScope: true,
                ok: 'submit'
              }
            $mdDialog
                .show( alert)
        

netBattler
    .$inject = ['$location','$scope' ,'$interval','$mdDialog', 'uuid']

demo = ($location, $scope)->
    vm=$scope
    vm.loadGame = ()->
        $location.path '/battle'

demo
    .$inject = ['$location','$scope']



config =($routeProvider)->
    $routeProvider
        .when '/battle', 
            title:'battle',
            templateUrl: 'views/battle.html'
            controller: 'netBattler as vm'
         
        .otherwise 
            title:'demo',
            templateUrl: 'views/demo.html'
            controller: 'demo as vm'
        

angular
    .module 'netMananger', ['ngAnimate','ngRoute','ngResource','ngSanitize','ngMaterial', 'lvl.directives.dragdrop']
    .config(config)
    .controller('netBattler', netBattler)
    .controller('demo',demo)