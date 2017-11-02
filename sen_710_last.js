var Math=require('mathjs');
var mqtt=require('mqtt');
var client=mqtt.connect('mqtts://api.artik.cloud',{
        port: 8883,
        rejectUnauthorized:false,
        username: '7fb1a3b92382468582ef43ea8f5cdfae',
        password: 'c125f57ff99040fcb69da35d99f898b0'
});

client.on('connect', function(){
        console.log("MQTT Connect");}
		)

function sendMsg01(msg){
        json_msg={"Button_State":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/7fb1a3b92382468582ef43ea8f5cdfae',str_msg);
		}

function sendMsg02(msg){
        json_msg={"Read_Data":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/7fb1a3b92382468582ef43ea8f5cdfae',str_msg);
		}

function send_Msg_temp(msg){
        json_msg={"temp":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/7fb1a3b92382468582ef43ea8f5cdfae',str_msg);
		}


function send_Msg_mag(msg){
        json_msg={"mag":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/7fb1a3b92382468582ef43ea8f5cdfae',str_msg);
		}


function send_Msg_danger(msg){
        json_msg={"danger":msg};
        str_msg=JSON.stringify(json_msg);
        client.publish('/v1.1/messages/7fb1a3b92382468582ef43ea8f5cdfae',str_msg);
		}


var artik=require('artik-sdk');
var gpio=artik.gpio;


////////////////////////////////////////////////


var temp=artik.adc(1,"temp");
var temp_val=0;
var volt1,RES,kT,cT,temp1;
var pre_temp=100;

var mag1=new gpio(artik.artik710.ARTIK_A710_GPIO_GPIO1,'mag1','in', 'digital','both',0);
var mag_state=0;
var pre_mag=1;

var buzzer=new gpio(artik.artik710.ARTIK_A710_GPIO_GPIO0,'buzzer','out', 'digital','none',0);
var off_buzzer=0;

var tmp_test=setInterval(function() {
        temp.request();
        temp_val=temp.get_value();
        volt1= (temp_val*3.3)/4095.0;
        RES = ((52000.0)/volt1) - 10000;
        temp1=Math.log(RES/10000);
        temp1=parseFloat(temp1);
        temp1=temp1.toFixed(6)*-1;
        kT = 1/((1/(273.15+25))+(1/6300.0)*temp1);
        cT = kT-273.15;
        console.log(" temp is "+cT );	
	if(Math.abs(pre_temp-cT)>2){ send_Msg_temp(cT); pre_temp=cT;}

	
}, 2000);

var mag_Test=setInterval(function(){
        mag1.request();
        mag_state=mag1.read();
		mag1.release();
		
		if(mag_state==1){mag_state=0;}
		else if(mag_state==0) {mag_state=1;}
        console.log(mag_state);
		
		if(mag_state!=pre_mag) { send_Msg_mag(mag_state); }
		pre_mag=mag_state;
		
        if(mag_state==1){ off_buzzer=0; }

},200);


client.on('connect', function(){
        console.log("MQTT Connect");
        client.subscribe('/v1.1/actions/7fb1a3b92382468582ef43ea8f5cdfae');
})


client.on('message', function(topic, message){

        if(message.indexOf("check")>-1){
                if(message.indexOf('"cc":2')>-1){
                        console.log("check");

                        if(mag_state==0 ){
                                if(off_buzzer==0){
                                        send_Msg_danger(1);
                                        buzzer.request();
                                        buzzer.write(0);
                                        buzzer.release();
                                        off_buzzer=1;
                                }
        	        }
       		 }
        }

          if(message.indexOf("buzzer_test")>-1){
             if(message.indexOf('"buzzer_state":555')>-1){
                buzzer.request();
                buzzer.write(1);
                buzzer.release();
                off_buzzer=2;
               }
        }


},1000);



