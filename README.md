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

3 Room Layouts

These will be generated from json based floor plans. The floor plan will be rendered using html5 canvas. Ideally I should use a open source solution, however I am still in the research phase.

4 Beacon Position

To be determined  based on a json configuration file. However a dynamic one would be preferable. A beacon would simply register itself, and dynamically provide position info.

Uses nodejs
-----------

sudo apt-get install nodejs
sudo apt-get install npm

Support Libararies

npm install socket.io
npm install express
