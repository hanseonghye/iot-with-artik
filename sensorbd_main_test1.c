#include <stdio.h>
#include <apps/shell/tash.h>
#include <fcntl.h>
#include <tinyara/gpio.h>
#include <tinyara/analog/adc.h>
#include <tinyara/analog/ioctl.h>
#include <tinyara/pwm.h>
#include <fcntl.h>

#define HIGH 1
#define LOW 0

static void show_usage(FAR const char *program)
{
	printf("USAGE:\n");
	printf(" %s led        : gpio led on/off test\n", program);
	printf(" %s ledpwm     : pwm led on/off test\n", program);
	printf(" %s ledst      : gpio starter board led test\n", program);
	printf(" %s uart       : uart loopback test\n", program);
	printf(" %s gpio       : gpio loopback test\n", program);
	printf(" %s button     : gpio button interrupt test\n", program);
	printf(" %s pwm        : pwm buzzer test\n", program);
	printf(" %s tcs34725   : i2c rgb sensor(tcs34725) test\n", program);
	printf(" %s mpu9250    : i2c 9-axis motion tracking sensor(MPU9250) test\n", program);
	printf(" %s k6ds3      : spi 6-axis acceler sensor(K6DS3) test\n", program);
	printf(" %s lis3lv02qd : spi 3-axis acceler sensor(LIS3LV02QD) test\n", program);
	printf(" %s adctest    : adc print all channel value\n", program);
}


/*
static void gpio_write(int port,int value)
{
	char str[4];
		static char devpath[16];
		snprintf(devpath, 16, "/dev/gpio%d", port);
		int fd = open(devpath, O_RDWR);

		ioctl(fd, GPIOIOC_SET_DIRECTION, GPIO_DIRECTION_OUT);
		write(fd, str, snprintf(str, 4, "%d", value != 0) + 1);

		close(fd);
}*/


#ifdef CONFIG_BUILD_KERNEL
int main(int argc, FAR char *argv[])
#else
int sensorbd_main(int argc, FAR char *argv[])
#endif*
{
	int ret = 0;

	switch (argc) {
	case 2:
		if (strcmp(argv[1], "led") == 0) {
			ledonoff_main(argc, argv);
		} else if (strcmp(argv[1], "ledpwm") == 0) {
			ledpwm_main(argc, argv);
		} else if (strcmp(argv[1], "ledst") == 0) {
			starterled_main(argc, argv);
		} else if (strcmp(argv[1], "uart") == 0) {
			uartloopback_main(argc, argv);
		} else if (strcmp(argv[1], "gpio") == 0) {
			gpioloopback_main(argc, argv);
		} else if (strcmp(argv[1], "button") == 0) {
			switch_main(argc, argv);
		} else if (strcmp(argv[1], "pwm") == 0) {
			pwmbuzzer_main(argc, argv);
		} else if (strcmp(argv[1], "tcs34725") == 0) {
			tcs34725_main(argc, argv);
		} else if (strcmp(argv[1], "mpu9250") == 0) {
			mpu9250_main(argc, argv);
		} else if (strcmp(argv[1], "k6ds3") == 0) {
			k6ds3_main(argc, argv);
		} else if (strcmp(argv[1], "lis3lv02qd") == 0) {
			lis3lv02qd_main(argc, argv);
		} else if (strcmp(argv[1], "adctest") == 0) {
			adctest_main(argc, argv);
		} else {
			show_usage(argv[0]);
		}
		break;

	default:
		show_usage(argv[0]);
		break;
	}

	return ret;
}

void digitalWrite(int port, int value)
{
	char str[4];
	static char devpath[16];
	snprintf(devpath, 16, "/dev/gpio%d", port);
	int fd = open(devpath, O_RDWR);

	ioctl(fd, GPIOIOC_SET_DIRECTION, GPIO_DIRECTION_OUT);
	write(fd, str, snprintf(str, 4, "%d", value != 0) + 1);

	close(fd);
}



int main(int argc, FAR char *argv[]){
//	tash_cmd_install("sensor", sensorbd_main, 1);

	int i=0;
	int pin=51;
	for(i;i<10;++i){
	        digitalWrite(pin,HIGH);
	        up_mdelay(1000);

	        digitalWrite(pin,LOW);
	        up_mdelay(1000);

	        printf("%d\n",i);
	    }

	return 0;
}
