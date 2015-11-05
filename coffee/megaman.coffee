#  cfcoptions : { "out": "../js/"   }

netBattler = ($location,$scope,$interval, $mdDialog , uuid)->
    vm=$scope
    vm.grids= []
    side ='ally'
    canclick =true
    currentGridY= 2;
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
        topPos = 14+6*currentGridY
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
            rotation +=gameIncrement
            if rotation > 180
                rotation = 180
            fill_rotation = rotation;
            fix_rotation = rotation * 2;
            if rotation is 180 
                rotationlock= 1
                activateMeter()
        
        
    gameLoop = $interval(updatemeter, 1000);
    vm.loadedRoutines = [{empty:true},{empty:true},{empty:true}];
    uuid1 =uuid.new()
    uuid2 =uuid.new()
    vm.routines=[{name:'sword', image:"image1", description:"it cuts things" , uuid:uuid1},{ name:'gun', image:"image1", description:"it shoots things",uuid:uuid2}] 
    vm.setCurrentRoutine=(routine)->
        vm.currentRoutine= routine
    
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
         vm.meterText ='Charging'
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