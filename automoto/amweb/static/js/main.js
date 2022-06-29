var serverUrl = "ws://localhost:9001/";     
var clientId = "my_mqtt_js_client";
var device_name = "My JS MQTT device";
var tenant = "<<tenant>>";
var username = "<<username>>";
var password = "<<password>>";

var undeliveredMessages = [];
var temperature = 25;


window.onload = function() {
    var alarm = document.getElementById("toggle");
    alarm.addEventListener('change',listenAlarm, false);

}
function listenAlarm() {
    var alarm = document.getElementById("toggle");
    publish("am/device/alarm/status", String(alarm.checked) , function(){});
    log(alarm.checked);
}
// configure the client to Cumulocity
var client = new Paho.MQTT.Client(serverUrl, clientId);

// display all incoming messages
client.onMessageArrived = function (message) {
   //tell me what to do with messages.
};

// display all delivered messages
client.onMessageDelivered = function onMessageDelivered(message) {
    log('Message "' + message.payloadString + '" delivered');
    var undeliveredMessage = undeliveredMessages.pop();
    if (undeliveredMessage.onMessageDeliveredCallback) {
        undeliveredMessage.onMessageDeliveredCallback();
    }
};

function createDevice() {
    // register a new device
    publish("s/us", "100," + device_name + ",c8y_MQTTDevice", function () {
        // set hardware information
        publish("s/us", "110,S123456789,MQTT test model,Rev0.1", function () {
            publish('s/us', '114,c8y_Restart', function () {
                log('Enable restart operation support');
                //listen for operation
                client.subscribe("s/ds");
            })

            // send temperature measurement
            setInterval(function () {
                publish("s/us", '211,' + temperature);
                temperature += 0.5 - Math.random();
            }, 3000);
        });
    });
}

// send a message
function publish(topic, message, onMessageDeliveredCallback) {
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    undeliveredMessages.push({
        message: message,
        onMessageDeliveredCallback: onMessageDeliveredCallback
    });
    client.send(message);
}
function subTopic() {
    client.subscribe("am/device/alarm")
}
// connect the client to Cumulocity
function init() {
    client.connect({
        onSuccess: subTopic,
    });
}

// display all messages on the page
function log(message) {
    console.log(message);
}

init(); 

