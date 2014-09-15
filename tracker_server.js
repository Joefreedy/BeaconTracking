/**
* Libraries
*/
var express = require('express');
var http = require('http');
var io = require('socket.io');
var sys = require ('sys');
var url = require('url');
var qs = require('querystring');
/**
* Detector - Ibeacon receivers
*/
var detectors = {};			// Detector info, position, changed etc... 
var detector_state = {};		// Detector state, current staff
var detected_staff = {};		// Currently detected staff
var detected_staff_timeout = {};	// Staff detection timeout

/**
* My method description.  Like other pieces of your comment blocks, 
* this can span multiple lines.
*
* @method addDetector
* @param {String} name   Detector/Receiver name
* @param {int}    x      Postion co-ordinate
* @param {int}    y      Postion co-ordinate
* @param {int}    width  Width of area covered by receiver/detector
* @param {int}    height Height of area covered by receiver/detector
*/
function add_detector( name, x, y, width, height)
{
        detector = new Object;
        detector.x=x;			// Map position
        detector.y=y;
	detector.width=width;
	detector.height=height;

        detector.name=name;		// Name
	detector.changed=0; 		// State changed - Only send updated data to browsers
        detectors[name]=detector;

	var staff = {};			// Currently detected staff
	detector_state[name]=staff;
}

/**
* List of detector/receivers
* Will move into a configuration file, perhaps json/database
*/
add_detector(1, 382, 315, 125, 100);
add_detector(2, 507, 315, 125, 100);
add_detector(3, 382, 215, 125, 100);
add_detector(4, 507, 215, 125, 100);

// Http Listener 
var http_listener;

// Client Socket
var client_socket=null;

/**
* Used to time out staff members. If a signal is not detected after a certain amount of time, it is assumed they are no longer there.
*
* @method time_decrement
* @param {object} entry
*/
function time_decrement(entry)
{
	var time = detected_staff_timeout[entry];
	if (time > 0) {
		time=time-1000;
		detected_staff_timeout[entry]=time;
		return 0;
	} else {
		// Remove From timeout list
		console.log("Timeout:" + entry);
		return 1;
	}
}

/**
* Update state of a receive or detector.
*
* @method set_detector_state
* @param {object}  detector  
* @param {object} new_state
*/
function set_detector_state(detector, new_state)
{
	console.log("set_detector_state");
	if (detector in detectors) {
		var detector_state  = detectors[detector];
		detector_state.changed=new_state;
	} else console.log("Unknown detector");
}

/**
* Simple timeout mechanism for staff detection
*
* @method timeout
*/
function timeout()
{
	var remove_list = new Array();
	for (key in detected_staff_timeout)
	{
		if (time_decrement(key)==1) {
			remove_list.push(key); 
		}
	}
	// Remove Keys
	var length = remove_list.length;
	if (length > 0) {
		console.log("Remove");
		for (var i = 0; i < length; i++) {
			var entry = remove_list[i];
			remove_staff(entry);
		}
		console.log("Removed");
	}
	update_page();
}

/**
* Remove staff when no longer detected (after timeout)
*
* @method remove_staff
*/
function remove_staff(staff_id) 
{
	console.log("remove_staff");
	delete detected_staff_timeout[staff_id];
        var staff = detected_staff[staff_id];
        var detector = detector_state[staff.detector];
        delete detector[staff_id]; // Unique id???
        delete detected_staff[staff_id];	
	set_detector_state(staff.detector, 1);
}

/**
* Add staff or update staff status when detected
*
* @method  add_staff
* @param   {String} detector_name
* @param   {String} uuid Beacon
* @param   {int}    major
* @param   {int}    minor
* @param   {int}    power
* @param   {int}    rssi
*/
function add_staff(detector_name, uuid, major, minor, power, rssi)
{
	console.log("Add staff");
	if (detector_name in detectors) {
		// Check if already exists
		if (major in detected_staff) {
			remove_staff(major);
		}
		var staff = new Object;
		staff.detector=detector_name;
		staff.uuid=uuid;
		staff.major=major;
		staff.minor=minor;
		staff.power=power;
		staff.rssi=rssi;

		detected_staff[major]=staff;
		detected_staff_timeout[major]=5000; // ? ms timeout

		var detector = detector_state[detector_name];
		detector[major] = staff; // Choose unique id
	} else console.log("Detector not registered");
	console.log("Added staff");
}  

/**
* Update connected web browser, only if there is a change
*
* @method update_page
*/
function update_page()
{
	for (key in detectors) 
	{
		var detector_state = detectors[key];
		if ( detector_state.changed==1) {
			// Update for this web page
			update_web(key);
			detector_state.changed=0; // Update complete so reset
		}
	}
}

/**
* Updates all connected web browsers concurrently
* (Perhaps not scaleable?)
*
* @method update_web
*/
function update_web(detector)
{
	console.log("Update web");
	var detector_pos  = detectors[detector];
	var full_info = new Object();
	full_info.id=detector;
	full_info.x=detector_pos.x;
	full_info.y=detector_pos.y;
	full_info.width=detector_pos.width;
	full_info.height=detector_pos.height;
	var staff_list = detector_state[detector];
	var list=new Array();
	for (key in staff_list)
        {
                item=staff_list[key];
		list.push(item.major);
        }
	full_info.list=list;	
	http_listener.sockets.emit('message', JSON.stringify(full_info));
}

/**
* Create web server for receiving data from receiver/detectors
*/
var data_server=http.createServer(
	function (request, response) {
    		if (request.method=='GET')
		{
        		var url_parts = url.parse(request.url,true);
			var url_query = url_parts.query;
        		response.writeHead( 200 );
        		response.end();
			add_staff(url_query.detector, url_query.uuid, url_query.major, url_query.minor, url_query.power, url_query.rssi);
			set_detector_state(url_query.detector, 1);
    		}               
	}
);
 
// HTML Page Server
/**
* Web page server,  for tracking display.
*/
var app = express();
app.use(express.static('./public'));
var http_server = http.createServer(app).listen(8124); //Server listens on the port 8124
http_listener = io.listen(http_server);
 
http_listener.sockets.on("connection",function(socket){
    client_socket=socket;
    console.log('Socket.io Connection with the client established');
    socket.on('disconnect', function () {
        console.log("Disconnect");
    });
});

/**
* Websocket server, used to update connected web pages
*/
data_server.listen( 8125 );
/**
* Timeout timer
*/
setInterval(timeout, 1000);

