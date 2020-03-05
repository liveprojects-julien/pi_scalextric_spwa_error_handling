angular.module('app').service('messageService', messageService);

messageService.$inject = [
    'mqttService',
    'brokerDetails',
    '$timeout'
];


function messageService(mqttService, brokerDetails, $timeout) {
    
    var registry = {};
    var vm = this;
    vm.initialize = initialize;
    vm.onMessageArrived = onMessageArrived;
    vm.subscribe = subscribe;
    vm.unsubscribe = unsubscribe;
    vm.registry = registry;
    vm.publish = publish;
    vm.disconnect = disconnect;
    
    

    function initialize(){
        console.log("Message service ini");
        mqttService.onMessageArrived(onMessageArrived);
    }


    
    //mqttService.onMessageArrived(messageService.onMessageArrived);
    function onMessageArrived(message){
        console.log(registry[message.topic]);
        var subscribers = registry[message.topic]; 
        if(subscribers != null){
           // subscribers.forEach(function(subscriber){ 

           var keys = Object.keys(subscribers);
            for(var index = 0; index < keys.length; index++){
                var property = keys[index];
                var subscriber = subscribers[property];

                $timeout(
                    function(){
                        subscriber(message);
                        console.log(message);
                    });


            }
                
           // });
        }
        //console.log(JSON.stringify(message.topic));
        //console.log(message);
    }

    function subscribe(topicPath, subscriberName, callback){
        registry[topicPath] = {};
        registry[topicPath][subscriberName] = callback;
        mqttService.subscribe(topicPath);
    }

    function unsubscribe(subscriberName,topicPath){
        delete registry[topicPath][subscriberName];
        if(!!registry[topicPath] && registry[topicPath].length == 0){
            mqttService.unsubscribe(topicPath);
        }
    }

    function publish(topicPath, arg){
        mqttService.publish(topicPath, arg);
    }

    function disconnect(){
        mqttService.disconnect();
    }



    


}