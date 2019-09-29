#!/bin/bash

###
# This script automate the setup of QMI supported wwan devices.
#
# Tested on following environment:
#   * Lenovo ThinkPad X220 (4286-CTO)
#   * Gentoo/Linux, Linux Kernel 3.9.6
#   * NTT Docomo UIM card (Xi LTE SIM)
#   * Sierra Wireless, Inc. Gobi 3000 wireless wan module
#     (FRU 60Y3257, vendor and device id is 1199:9013)
#     memo:
#       I recommend to check if your wwan module works fine
#       for your mobile broadband provider with Windows
#       especially if you imported the device from other country.
#       You may have to initialize your device for your region.
#   * Required kernel config (other modules may be also required):
#     - qmi_wwan (CONFIG_USB_NET_QMI_WWAN)
#     - qcserial (CONFIG_USB_SERIAL_QUALCOMM)
#   * Required settings:
#     - you may have to create /etc/qmi-network.conf.
#       My qmi-network.conf has only a line "APN=mopera.net".
#

# your wwan device name created by qmi_wwan kernel module
# check it with "ip a" or "ifconfig -a". it may be wwan0?
WWAN_DEV=wwan0
# your cdc_wdm modem location
CDC_WDM=/dev/cdc-wdm0
# this script uses following qmi commands
QMICLI=/usr/bin/qmicli
QMI_NETWORK=/usr/bin/qmi-network
# the places of following commands vary depending on your distribution
IP=/bin/ip
IFCONFIG=/sbin/ifconfig
DHCPCD=/sbin/udhcpc
LSUSB=/usr/bin/lsusb
SUDO=/usr/bin/sudo
START_GPIO=/home/pi/gpio.sh
#network args
APN=three.co.uk
TYPE=4

function helpmsg {
    echo "usage: $0 {start|stop|restart|status}"
    exit 1
}

function qmi_boot {
   #boot GPIO
   if [ ! -d /sys/class/gpio/gpio18 ]; then
     echo "File exists."
     echo "18" > /sys/class/gpio/export
     sleep 2
   fi
   echo "out" > /sys/class/gpio/gpio18/direction
   sleep 1
   echo "0" > /sys/class/gpio/gpio18/value
   echo "1" > /sys/class/gpio/gpio18/value
   sleep 15
   # your cdc_wdm modem location
   CDC_WDM=/dev/cdc-wdm0
   qmi_start
}

function qmi_start {

        $COMMAND_PREFIX $LSUSB | grep Qualcom

    #check status 
    STATUS=$($COMMAND_PREFIX $QMI_NETWORK $CDC_WDM status | sed -n 's/.*Status: //p')

    if [ $STATUS == 'connected' ]; then
        echo "Network is connected, only need to ask for an IP"
    else
        echo "---- Reseting qmi lib ----"
        $COMMAND_PREFIX $QMICLI -d $CDC_WDM --wds-reset

        echo "Setting data format to raw-ip"
        $COMMAND_PREFIX $IP link set $WWAN_DEV down
        $COMMAND_PREFIX $QMICLI -d $CDC_WDM --set-expected-data-format=raw-ip
        $COMMAND_PREFIX $IP link set $WWAN_DEV up

        echo "start network..."
        $COMMAND_PREFIX qmicli -d $CDC_WDM --wds-start-network="apn=$APN,ip-type=$TYPE" --client-no-release-cid
    fi

    #$COMMAND_PREFIX $QMICLI -d $CDC_WDM --dms-set-operating-mode=online
    #$COMMAND_PREFIX $QMICLI -d $CDC_WDM --dms-set-operating-mode=online
    
    if [ $? -ne 0 ]; then
	echo "your wwan device may be RFKilled?"
	exit 1
    fi

    #$COMMAND_PREFIX $QMI_NETWORK $CDC_WDM start
    $COMMAND_PREFIX $DHCPCD -q -f -n -i $WWAN_DEV
    $COMMAND_PREFIX $IFCONFIG -v wwan0
    $COMMAND_PREFIX $IP r s
}

function qmi_stop {
    echo "Stopping old network connection"
    #$COMMAND_PREFIX $QMI_NETWORK $CDC_WDM stop
    $COMMAND_PREFIX qmicli -d $CDC_WDM --wds-stop-network="apn=$APN,ip-type=$TYPE"
    #$COMMAND_PREFIX kill `cat /var/run/dhcpcd-${WWAN_DEV}.pid`
    echo "Killing processus"
    #$COMMAND_PREFIX pkill -f "dhcpcd"
    #$COMMAND_PREFIX $IFCONFIG $WWAN_DEV down
}

function qmi_strength {
    dbm=`$COMMAND_PREFIX $QMICLI -d $CDC_WDM --nas-get-signal-strength | tr "'" " " | grep Network | head -1 | awk '{print $4}'`
    echo -n "Signal strength is "
    if [ $dbm -ge -73 ]; then
	echo -n 'Excellent'
    elif [ $dbm -ge -83 ]; then
	echo -n 'Good'
    elif [ $dbm -ge -93 ]; then
	echo -n 'OK'
    elif [ $dbm -ge -109 ]; then
	echo -n 'Marginal'
    else
	echo Unknown
    fi
    echo " (${dbm} dBm)"
}

function qmi_status {
    $COMMAND_PREFIX $QMI_NETWORK $CDC_WDM status
    qmi_strength
}

# check argument number
if [ $# -ne 1 ]
then
    helpmsg
fi

# check permission
if [ `whoami` != 'root' ]
then
    echo "warning: root permission required. setting command prefix to 'sudo'."
    COMMAND_PREFIX=$SUDO
fi

# run commands
case $1 in
    boot) qmi_boot ;;
    start) qmi_start ;;
    stop) qmi_stop ;;
    restart) qmi_stop; qmi_start ;;
    status) qmi_status ;;
    *) helpmsg ;;
esac
