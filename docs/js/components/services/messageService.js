angular.module('app').service('messageService', messageService);

messageService.$inject = [
    'mqttService',
    'brokerDetails',
    '$timeout'
];


function messageService(mqttService, brokerDetails, $timeout) {
    
    var registry = {};
    var self = this;
    self.initialize = initialize;
    self.onNewMessage = onNewMessage;
    self.subscribe = subscribe;
    self.unsubscribe = unsubscribe;
    self.registry = registry;
    self.publish = publish;
    self.disconnect = disconnect;
    self.resubscribe = resubscribe;
    
    

    function initialize(){
        console.log("Message service ini");
    }


    
    //mqttService.onMessageArrived(messageService.onMessageArrived);
    function onNewMessage(message){
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

    function resubscribe(){
        console.log("Resubscribing..");   
        //console.log(registry[topicPath]); 
        topicArray.forEach(element => {
            console.log(element);
            mqttService.subscribe(element);
        });
    }

    var topicArray = [];
    function subscribe(topicPath, subscriberName, callback){
        registry[topicPath] = {};
        registry[topicPath][subscriberName] = callback;
        mqttService.subscribe(topicPath);
        topicArray.push(topicPath);
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