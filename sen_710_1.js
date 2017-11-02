var mqtt=require('mqtt');
var client=mqtt.connect('mqtts://api.artik.cloud',{
	port: 8883,
	rejectUnauthorized:false,
	username: '1896ed4c7e3847c792f8e7e3315cd8fe',
	password: 'd6c71c0088284dddb2f293a15e8566e2'
});

client.on('connect', function(){
	console.log("MQTT Connect");
})

function sendMsg01(msg){
	json_msg={"Button_State":msg};
	str_msg=JSON.stringify(json_msg);
	client.publish('/v1.1/messages/1896ed4c7e3847c792f8e7e3315cd8fe',str_msg);}

function sendMsg02(msg){
	json_msg={"Read_Data":msg};
	str_msg=JSON.stringify(json_msg);
	client.publish('/v1.1/messages/1896ed4c7e3847c792f8e7e3315cd8fe',str_msg);}

function send_Msg_temp(msg){
	json_msg={"temp":msg};
	str_msg=JSON.stringify(json_msg);
	client.publish('/v1.1/messages/1896ed4c7e3847c792f8e7e3315cd8fe',str_msg);}


function send_Msg_mag(msg){
        json_msg={"mag":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/1896ed4c7e3847c792f8e7e3315cd8fe',str_msg);}


function send_Msg_danger(msg){
        json_msg={"danger":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/1896ed4c7e3847c792f8e7e3315cd8fe',str_msgg
);}


var artik=require('artik-sdk');
var gpio=artik.gpio;


////////////////////////////////////////////////

led1=new gpio(artik.artik710.ARTIK_A710_GPIO_GPIO0,'led1','out', 'digital','none',0);
var led_state=0;

var temp=artik.adc(1,"temp");
var temp_val=0;

var mag1=new gpio(artik.artik710.ARTIK_A710_GPIO_GPIO1,'mag1','in', 'digital','both',0);
var mag_state=0;

var buzzer=new gpio(artik.artik710.ARTIK_A710_GPIO_GPIO2,'buzzer','out', 'digital','none',0);
var buzzer_state=0;

/*setTimeout(function() {
	clearInterval(iv);
	led1.request();
        led1.write(0);
        led1.release();
},   5000);
*/

var tmp_test=setInterval(function() {
	temp.request();
	temp_val=temp.get_value()*0.439453125;
	temp_val=(temp_val-500)/10;
	console.log(" temp is "+temp_val );
	send_Msg_temp(temp_val);
	
}, 10000);

var mag_test=setInterval(function(){
        mag1.request();
	console.log(mag1.read());
        send_Msg_mag(mag1.read());
        mag1.release();
},2000);


client.on('connect', function(){
	console.log("MQTT Connect");
	client.subscribe('/v1.1/actions/1896ed4c7e3847c792f8e7e3315cd8fe');
})


client.on('message', function(topic, message){
	if(message.indexOf("setDualLed")>-1){
		if(message.indexOf('"state":"1"')>-1){
			console.log("Dddddd");
			if(mag1.read()==0)
			{	console.log("magmag");
			//	send_Msg_danger(1);
				buzzer.request();
				buzzer.write(0);
				buzzer.release();
			}
			else{ //붙
			}
		}
	}
//	 if(message.indexOf("mqtt_test")>-1){
  //              if(message.indexOf('"buzzer":true')>-1){
    //                    console.log("22");
      //          }
        //	}

});

