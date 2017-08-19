load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_timer.js');
load("api_esp8266.js");
load('api_http.js');

//***********************************************
//put the link in the quotes if using request...
let requestUrl = '';

//...or set io.adafruit mqtt settings and set feed name here:
let feedName = 'wifiButton01';

//some millisecond settings. adjust to your needs
let millisToTurnOff = 60000;
//***********************************************

//
Timer.set(millisToTurnOff , false , function() {
  print("deep sleep");
  ESP8266.deepSleep(0);
}, null);

if(requestUrl.length > 0)
{
	//request url not empty so invoke it
	Net.setStatusEventHandler(function(ev, edata){
		if(ev !== Net.STATUS_GOT_IP) return;
		print("httpRequest");
		HTTP.query({
				url: requestUrl,
				success: function(){
					print('HTTP request sent');
				},
				error: function(){
					print('HTTP request failed');
				}
			});
		Net.setStatusEventHandler(function(){}, null);
	}, null);
}

//trying mqtt
MQTT.setEventHandler(function(conn, ev, edata) 
{
	if (ev === MQTT.EV_CONNACK)
	{
		let topic = Cfg.get('mqtt.user') + '/feeds/' + feedName;
		let ok = MQTT.pub(topic, JSON.stringify(1), 1);
		if(ok) print('sent mqtt')
		else print('failed mqtt');
		MQTT.setEventHandler(function(){}, null);
	}
}, null);
