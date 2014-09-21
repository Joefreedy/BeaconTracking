Real Time BeaconTracking
=========================

The idea is to place ibeacon receivers in a building. Using the transmitters, you would then track ibeacon transmitters, which may be on id tags, phones etc....

In this experimental code the receiver will only detect the transmitter proximity. In future, information from multiple receivers will be used for triangulation.

The Design Idea

1 Data is transmitted from the receiver (http)
  This will contain, rssi, transmission power, minor, major, and perhaps mac info.
2 The server receives the data, and using web socket updates the display of all the currently connected web browsers.

Currently positional data is sent from the beacon using a simple http get request.

http://????:8125/?detector=4&uuid=3&major=42&minor=11&power=255&rssi=255

Uses nodejs
-----------

sudo apt-get install nodejs
sudo apt-get install npm

Support Libararies

npm install socket.io
npm install express
