
function draw_staff(context, x, y, width, height, staff_list)
{
	console.log(staff_list);
	console.log(width)
	//FIX ME
	context.clearRect(0,0,600,600)//(x,y,width,height);
	if (staff_list.length > 0) {
		context.fillText(staff_list, x, y);
	}
}


