function draw_chair(context, data)
{
	context.beginPath();
        context.lineWidth=1;
	length=data.length;

	// Head rest
	x = data.x-length/2;
	y = data.y-length/2;
	head_width=4;

	context.moveTo(x,y);
	context.lineTo(x+length, y);

	context.moveTo(x+length, y);
	context.lineTo(x+length, y+head_width); 

	context.moveTo(x+length, y+head_width);
	context.lineTo(x, y+head_width);

	context.moveTo(x,y);
        context.lineTo(x, y+head_width);

	length=data.length-head_width;
	// Seat
        context.moveTo(data.x-length/2, data.y-length/2);
        context.lineTo(data.x+length/2, data.y-length/2);

        context.moveTo(data.x+length/2, data.y-length/2);
        context.lineTo(data.x+length/2, data.y+length/2);

        context.moveTo(data.x+length/2, data.y+length/2);
        context.lineTo(data.x-length/2, data.y+length/2);

        context.moveTo(data.x-length/2, data.y-length/2);
        context.lineTo(data.x-length/2, data.y+length/2);

        context.stroke();
}

function draw_wall(context, data)
{
        context.beginPath();
        context.lineWidth=5;
        context.moveTo(data.x, data.y);
        context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        context.stroke();
}

function draw_screen(context, data)
{
        context.beginPath();
        context.lineWidth=2;
        context.moveTo(data.x, data.y);
        context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        context.stroke();
}

function draw_door(context, data)
{
        angle=data.angle;
        context.beginPath();
        context.moveTo(data.x, data.y);
        context.lineWidth=5;
        context.lineTo(data.length*Math.cos(3.142*angle/180)+data.x, data.length*Math.sin(3.142*angle/180)+data.y);
        context.stroke();
        context.beginPath();
        context.lineWidth=2;
        context.moveTo(data.x, data.y);
        angle1 = angle+30;
        context.lineTo(data.length*Math.cos(3.142*angle1/180)+data.x, data.length*Math.sin(3.142*angle1/180)+data.y)
        context.stroke();
        // Arc
        context.beginPath();
        context.lineWidth=1;
        context.arc(data.x, data.y, data.length, 3.142*angle/180, 3.142*angle1/180, false);
        context.stroke();
}


function draw_table(context, data)
{
        context.beginPath();
        context.lineWidth=1;
	length=data.length;
	if (data.shape=='round')
	{
        	context.arc(data.x, data.y, length/2, 0, 3.142*2, false);
	} else if (data.shape=='square') 
	{
		x=data.x-length/2;
		y=data.y-length/2;
		context.fillStyle = "rgb(150,29,28)";
      		context.fillRect (x,y, length, length);

		context.moveTo(x, y);
		context.lineTo(x+length, y);

		context.moveTo(x+length, y);
		context.lineTo(x+length, y+length);

		context.moveTo(x+length, y+length);
		context.lineTo(x, y+length);

		context.moveTo(x, y);
		context.lineTo(x, y+length);
	}
        context.stroke();
}

function draw_window(context, data)
{
        context.beginPath();
        context.lineWidth=2;
        context.moveTo(data.x, data.y);
        context.lineTo(data.length*Math.cos(3.142*data.angle/180)+data.x, data.length*Math.sin(3.142*data.angle/180)+data.y);
        context.stroke();
        // Window
        x1 = 4*Math.cos(3.142*(90+data.angle)/180)+data.x;
        y1 = 4*Math.sin(3.142*(90+data.angle)/180)+data.y
        x2 = x1 + data.length*Math.cos(3.142*data.angle/180);
        y2 = y1 + data.length*Math.sin(3.142*data.angle/180);
        x3 = x2 - 4*Math.cos(3.142*(90+data.angle)/180);
        y3 = y2 - 4*Math.sin(3.142*(90+data.angle)/180);
        context.beginPath();
        context.lineWidth=1;
        context.moveTo(data.x, data.y);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.stroke();
}


function draw_item(context, data)
{
        if (data.type=='wall')
        {
                draw_wall(context, data)
        } else if (data.type=='door')
        {
                draw_door(context, data);
        } else if (data.type=='window')
        {
                draw_window(context, data);
        } else if (data.type=='screen')
        {
                draw_screen(context, data)
        } else if (data.type=='table')
        {
                draw_table(context, data);
        } else if (data.type=='chair')
        {
                draw_chair(context, data);
        }
}

function draw_map(context, data)
{
	console.log(data.floor1);
        for(var i=0; i<data.floor1.length; i++)
        {
                draw_item(context, data.floor1[i]);
        }
}



