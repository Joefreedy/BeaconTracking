var staff_draw = {
	context:null
};

staff_draw.init = function(document, width,  height, layer) {
	canvas_staff  = document.getElementById('track_map');
	var canvas=document.createElement("canvas");
	canvas.setAttribute("id", "staff_map");
	canvas.setAttribute("width", width);
	canvas.setAttribute("height", height);
	canvas.setAttribute("style", "position:absolute;z-index:0;");
	canvas_staff.appendChild(canvas);
	this.context = canvas.getContext('2d');
}

staff_draw.draw_one = function (data) {
        this.context.lineWidth=1;
        length=data.height;
        width=data.height/4;
        length_seg=(length-width)/3;
        // Head
        this.context.beginPath()
        this.context.arc(data.x+width/2, data.y+width/2, width/2, 0, 3.142*2, false);
        this.context.stroke();
        // Neck
        this.context.beginPath()
        this.context.moveTo(data.x+width/2, data.y+width);
        this.context.lineTo(data.x+width/2, data.y+width+length_seg );
        this.context.stroke();
        // Body
        this.context.beginPath()
        this.context.moveTo(data.x+width/2, data.y+width);
        this.context.lineTo(data.x+width/2, data.y+width+length_seg*2);
        this.context.stroke();
        // Arms
        this.context.moveTo(data.x+width/2, data.y+width);
        this.context.lineTo(data.x, data.y+width+width+length_seg/2 );
        this.context.moveTo(data.x+width/2, data.y+width);
        this.context.lineTo(data.x+width, data.y+width+width+length_seg/2);
        // Legs
        this.context.moveTo(data.x+width/2, data.y+width+length_seg*2);
        this.context.lineTo(data.x, data.y+width+length_seg*3);
        this.context.moveTo(data.x+width/2, data.y+width+length_seg*2);
        this.context.lineTo(data.x+width, data.y+width+length_seg*3);
        this.context.stroke();
}


staff_draw.draw = function (parsed_message) {
	var staff_list = parsed_message.list;
        x=parsed_message.x;
        y=parsed_message.y;
        width=parsed_message.width;
        height=parsed_message.height;
        this.context.clearRect(x-1,y-1,width+2,height+2);
        if (staff_list.length > 0) {
                console.log(staff_list);
                this.draw_one(parsed_message)
        } else {
                console.log("None");
        }
};

// **********************************************************************************************************************
// Room Map

var draw_map = {
        context:null
};

draw_map.init = function (context, width, height, layer) {
	canvas_map  = document.getElementById('track_map');
        var canvas=document.createElement("canvas");
        canvas.setAttribute("id", "map");
	canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
	canvas.setAttribute("style", "position:absolute;z-index:0;");
        canvas_map.appendChild(canvas);
        this.context = canvas.getContext('2d');
}

draw_map.draw_chair = function(data)
{
	this.context.beginPath();
        this.context.lineWidth=1;
	length=data.length;

	// Head rest
	x = data.x-length/2;
	y = data.y-length/2;
	head_width=4;

	this.context.moveTo(x,y);
	this.context.lineTo(x+length, y);

	this.context.moveTo(x+length, y);
	this.context.lineTo(x+length, y+head_width); 

	this.context.moveTo(x+length, y+head_width);
	this.context.lineTo(x, y+head_width);

	this.context.moveTo(x,y);
        this.context.lineTo(x, y+head_width);

	length=data.length-head_width;
	// Seat
        this.context.moveTo(data.x-length/2, data.y-length/2);
        this.context.lineTo(data.x+length/2, data.y-length/2);

        this.context.moveTo(data.x+length/2, data.y-length/2);
        this.context.lineTo(data.x+length/2, data.y+length/2);

        this.context.moveTo(data.x+length/2, data.y+length/2);
        this.context.lineTo(data.x-length/2, data.y+length/2);

        this.context.moveTo(data.x-length/2, data.y-length/2);
        this.context.lineTo(data.x-length/2, data.y+length/2);

        this.context.stroke();
}

draw_map.draw_wall = function (data)
{
        this.context.beginPath();
        this.context.lineWidth=5;
        this.context.moveTo(data.x, data.y);
        this.context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        this.context.stroke();
}

draw_map.draw_screen = function(data)
{
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.moveTo(data.x, data.y);
        this.context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        this.context.stroke();
}


draw_map.draw_door = function(data)
{
        angle=data.angle;
        this.context.beginPath();
        this.context.moveTo(data.x, data.y);
        this.context.lineWidth=5;
        this.context.lineTo(data.length*Math.cos(3.142*angle/180)+data.x, data.length*Math.sin(3.142*angle/180)+data.y);
        this.context.stroke();
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.moveTo(data.x, data.y);
        angle1 = angle+30;
        this.context.lineTo(data.length*Math.cos(3.142*angle1/180)+data.x, data.length*Math.sin(3.142*angle1/180)+data.y)
        this.context.stroke();
        // Arc
        this.context.beginPath();
        this.context.lineWidth=1;
        this.context.arc(data.x, data.y, data.length, 3.142*angle/180, 3.142*angle1/180, false);
        this.context.stroke();
}

draw_map.draw_table = function(data)
{
        this.context.beginPath();
        this.context.lineWidth=1;
	length=data.length;
	if (data.shape=='round')
	{
        	this.context.arc(data.x, data.y, length/2, 0, 3.142*2, false);
	} else if (data.shape=='square') 
	{
		x=data.x-length/2;
		y=data.y-length/2;
		this.context.fillStyle = "rgb(150,29,28)";
      		this.context.fillRect (x,y, length, length);

		this.context.moveTo(x, y);
		this.context.lineTo(x+length, y);

		this.context.moveTo(x+length, y);
		this.context.lineTo(x+length, y+length);

		this.context.moveTo(x+length, y+length);
		this.context.lineTo(x, y+length);

		this.context.moveTo(x, y);
		this.context.lineTo(x, y+length);
	}
        this.context.stroke();
}

draw_map.draw_window = function(data)
{
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.moveTo(data.x, data.y);
        this.context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        this.context.stroke();
        // Window
        x1 = 4*Math.cos(3.142*(90+data.angle)/180)+data.x;
        y1 = 4*Math.sin(3.142*(90+data.angle)/180)+data.y
        x2 = x1 + data.length*Math.cos(3.142*data.angle/180);
        y2 = y1 + data.length*Math.sin(3.142*data.angle/180);
        x3 = x2 - 4*Math.cos(3.142*(90+data.angle)/180);
        y3 = y2 - 4*Math.sin(3.142*(90+data.angle)/180);
        this.context.beginPath();
        this.context.lineWidth=1;
        this.context.moveTo(data.x, data.y);
        this.context.lineTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.lineTo(x3, y3);
        this.context.stroke();
}


draw_map.draw_item = function(data)
{
        if (data.type=='wall')
        {
                this.draw_wall(data)
        } else if (data.type=='door')
        {
                this.draw_door(data);
        } else if (data.type=='window')
        {
                this.draw_window(data);
        } else if (data.type=='screen')
        {
                this.draw_screen(data)
        } else if (data.type=='table')
        {
                this.draw_table(data);
        } else if (data.type=='chair')
        {
                this.draw_chair(data);
        }
}

function draw_beacon(context, data)
{
	context.beginPath();
        context.lineWidth=1;
        length=data.length;
	context.arc(data.x, data.y, length/2, 0, 3.142*2, false)
	context.arc(data.x, data.y, length/4, 0, 3.142*2, false)
        context.stroke();
}


draw_map.draw = function(data)
{
	console.log(data.floor1);
        for(var i=0; i<data.floor1.length; i++)
        {
                this.draw_item(data.floor1[i]);
        }
}

//**********************************************************************************************************************
// Tracking map

track_map = {
	document:null
}

track_map.init = function(document)
{
	this.document=document;
	div  = document.getElementById('track_map');
	width = 640;// div.style.width;
	height = 480;// div.style.height;
	console.log(width);
	console.log(height);
	draw_map.init(  document, width, height, 0);
	staff_draw.init(document, width, height, 1);

}

track_map.draw = function(data)
{
	parsed_data = JSON.parse(data);
        console.log(parsed_data);
        if (parsed_data.type=='map')
        {
        	// Draw map
		console.log("Draw map")
                draw_map.draw(parsed_data);
        }
        else if (parsed_data.type=='track')
        {
		console.log("Draw staff");
                staff_draw.draw(parsed_data);
        } else console.log("Other");
}
