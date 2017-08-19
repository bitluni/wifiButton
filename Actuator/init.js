load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_timer.js');
load("api_pwm.js");

//***********************************************
//io.adafruit mqtt settings and set feed name here:
let feedName = 'wifiButton01';
//***********************************************
let D1 = 5;
let subbed = false;

//trying mqtt
MQTT.setEventHandler(function(conn, ev, edata) 
{
	if (ev === MQTT.EV_CONNACK && !subbed)
	{
		print('subbing mqtt');
		let topic = Cfg.get('mqtt.user') + '/feeds/' + feedName;
    MQTT.sub(topic, function(conn, topic, msg){
      print('new value ' + topic + ' ' + msg);
    	action();		
    });
    subbed = true;
	}
}, null);

function action()
{
  print('moving servo');
	GPIO.set_mode(D1, GPIO.MODE_OUTPUT);
	//move to position 0
	PWM.set(D1, 50, 10);
	//wait for servo
	Timer.set(1000, false , function() {
		//turn off servo
		PWM.set(D1, 50, 0);
		//wait a sec
		Timer.set(1000, false , function() {
			//move to position 1
			PWM.set(D1, 50, 1);
			//wait for servo
			Timer.set(1000, false , function() {
				//turn off
				PWM.set(D1, 50, 0);
				print('servo off');
			}, null);
		}, null);
	}, null);
}
