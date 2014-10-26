function staff_draw_human(context, data)
{
        context.lineWidth=1;
        length=data.height;
        width=data.height/4;
        length_seg=(length-width)/3;
        // Head
        context.beginPath()
        context.arc(data.x+width/2, data.y+width/2, width/2, 0, 3.142*2, false);
	context.stroke();
        // Neck
	context.beginPath()
        context.moveTo(data.x+width/2, data.y+width);
        context.lineTo(data.x+width/2, data.y+width+length_seg );
	context.stroke();
        // Body
	context.beginPath()
        context.moveTo(data.x+width/2, data.y+width);
        context.lineTo(data.x+width/2, data.y+width+length_seg*2);
	context.stroke();
        // Arms
        context.moveTo(data.x+width/2, data.y+width);
        context.lineTo(data.x, data.y+width+width+length_seg/2 );
        context.moveTo(data.x+width/2, data.y+width);
        context.lineTo(data.x+width, data.y+width+width+length_seg/2);
        // Legs
        context.moveTo(data.x+width/2, data.y+width+length_seg*2);
        context.lineTo(data.x, data.y+width+length_seg*3);
        context.moveTo(data.x+width/2, data.y+width+length_seg*2);
        context.lineTo(data.x+width, data.y+width+length_seg*3);
        context.stroke();
}

function staff_draw_staff(context, parsed_message)
{
        var staff_list = parsed_message.list;
	x=parsed_message.x;
	y=parsed_message.y;
	width=parsed_message.width;
        height=parsed_message.height;
	context.clearRect(x-1,y-1,width+2,height+2);
	if (staff_list.length > 0) {
		console.log(staff_list);
		staff_draw_human(context, parsed_message)
	} else {
		console.log("None");
		context.clearRect(x-1,y-1,width+2,height+2);
	}
}


