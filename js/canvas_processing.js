//Canvas creation

//Creating the filter list

var tabFilters = [];
var image;
var area;
var canvasfilter
var contextfilter
var filtered;
var aspect_ratio;
	canvasfilter= document.getElementById('canvas3'), 
	contextfilter = canvasfilter.getContext('2d'),
	uploadedFile = document.getElementById('uploaded-file');

	canvasfilter.height = 0;
	canvasfilter.width = 0;

	area= document.getElementById('area');





//Loading image

function loadFile(file){
	for(var i = 0; i<document.getElementsByClassName('checkbox').length;i++){
		document.getElementsByClassName('checkbox')[i].checked = false;
	}

	var imageType = /image.*/;

	if(file.type.match(imageType)){
		var reader = new FileReader();

		reader.onloadend = function(event){
			var tempImageStore = new Image();

			//Load image - does not load anything if an image is present

			tempImageStore.onload = function(ev){
				document.getElementsByClassName('infos')[0].style.display = "none";
				var area =  document.getElementById('area');

// Set the size of the canvas according to the image and the work area.
				if(ev.target.width < area.offsetWidth){
					canvas.width = ev.target.width;
					area.style.width = ev.target.width + 'px';
				} else {
					canvas.width = ev.target.width;
				}

				if(ev.target.height < area.offsetHeight){
					canvas.height = ev.target.height;
					area.style.height = ev.target.height + 'px';
				} else {
					canvas.height = ev.target.height;
				}

				//Draw the image in the canvas
				context.drawImage(ev.target, 0, 0);

				//Recover
				image = context.getImageData(0, 0, ev.target.width, ev.target.height);
			}
			tempImageStore.src = event.target.result; //Put the image into a new image object, triggering the onload function.

		}
		reader.readAsDataURL(file); //Read our image data and then it'll run our onloadend function above

	}
	return true;
}

//Detects filter loading

function toggleFilter(checked,filter,options){
	if(checked == true){
		modifyFilter(filter,options);
	} else {
		deleteFilter(filter);
	}
}

//Applies the filters

function applyFilter(){
	//Loading the base image
	cropperInstance.disabled = false;
	var img = document.getElementById("disp-img");
	contextfilter.canvas.height = img.height;
	contextfilter.canvas.width = img.width;

	contextfilter.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	contextfilter.drawImage(img, 0, 0);
	//context.putImageData(image,0,0);
	var imageTMP = contextfilter.getImageData(0, 0, canvasfilter.width, canvasfilter.height);//cropperInstance.getImageData();//context.getImageData(0, 0, canvas.width, canvas.height);
	//Application of filters
	
		/*canvasfilter.width=canvas[0].width;
		canvasfilter.height=canvas[0].height;*/
	
	for(var i = 0; i<tabFilters.length; i++){
		
		//filters(imageTMP.data,tabFilters[i][0],tabFilters[i][1]);
		  // pass it to a filter and get the modified copy
		 // var filtered = ImageFilters.GrayScale(imageTMP);
		 var filtered = ImageFilters.GaussianBlur(imageTMP, 4);
		 var filtered = ImageFilters.Sharpen (imageTMP, 4)
		contextfilter.putImageData(filtered,0,0);		
	}
	var temp_img=document.getElementById("canvas3").toDataURL("image/png");
	cropperInstance.replace(temp_img);
	cropperInstance.disabled = true;
	return true;
}

//Adding the filter in the list

function modifyFilter(filter,options){
	//Creating the filter

	var tabFilter = [filter,options];
	//Detect if a filter exists

	if(tabFilters.length != 0){
		//Detect if the filter exists

		for(var j = 0; j < tabFilters.length; j++){
			if(tabFilters[j][0] == filter && tabFilters[j][1] != options){
				//Changing the filter option

				tabFilters[j][1] = options;
				//Application of filters

				applyFilter();
				return true;
			} else if(tabFilters[j][0] == filter){
				return true;
			} else {
				//Adding the filter in the list

				tabFilters.push(tabFilter);
				//Application of filters

				applyFilter();
				return true;
			}
		}
	} else {
		tabFilters.push(tabFilter);
		//Application of filters

		applyFilter();
		return true;
	}
}

//Filter removal

function deleteFilter(filter){
	for(var i = 0; i<tabFilters.length; i++){
		//Filter detection

		if(tabFilters[i][0] == filter){
			//Suppression 
			tabFilters.splice(i,1);
			//Application of filters
			applyFilter();
		}
	}
	return true;
}

//Remove all filters
 
function resetFilters(){
	for(var i = 0; i<document.getElementsByClassName('checkbox').length;i++){
		document.getElementsByClassName('checkbox')[i].checked = false;
	}
	tabFilters = [];
	applyFilter();
	return true;
}

//List of filters

function filters(data,filter,options){
	for (var i = 0; i < data.length; i+=4){
		var red = data[i],
			green = data[i+1],
			blue = data[i+2],
			alpha=data[i+3];

		switch (filter){
			case undefined:
				break;
			case 'greyscale':
				green = red;
				blue = red;
				break;
			case 'blackandwhite':
				var average = (red + green + blue) / 3;
				if (average < 128) red = green = blue = 0;
				else red = green = blue = 255;
				break;
			case 'turnred':
				green = 0;
				blue = 0;
				break;
			case 'turngreen':
				red = 0;
				blue = 0;
				break;
			case 'turnblue':
				red = 0;
				green = 0;
				break;
			case 'turncyan':
				red = 0;
				break;
			case 'turnpink':
				green = 0;
				break;
			case 'turnyellow':
				blue = 0;
				break;
			case 'threshold':
				if (options){
					if (options.min){
						if (red < options.min) red = 0;
						if (green < options.min) green = 0;
						if (blue < options.min) blue = 0;
					} if (options.max){
						if (red > options.max) red = 255;
						if (green > options.max) green = 255;
						if (blue > options.max) blue = 255;
					}
				}
				break;
			case 'luminance':
				var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; 
				if (options){
					if (options.max && (luminance > options.max)){
						red = options.max;
						green = options.max;
						blue = options.max;
					}
					if (options.min && (luminance < options.min)){
						red = options.min;
						green = options.min;
						blue = options.min;
					}
				}
				break;
			case 'thresholdluminance':
				var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; 
				if (options){
					if (options.max && (luminance > options.max)){
						red = 255;
						green = 255;
						blue = 255;
					}
					if (options.min && (luminance < options.min)){
						red = 0;
						green = 0;
						blue = 0;
					}
				}
				break;
			case 'blackandwhiteluminance':
				var luminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000; // Gives a value from 0 - 255
				red = luminance;
				green = luminance;
				blue = luminance;
				break;
		}
		data[i] = red;
		data[i+1] = green;
		data[i+2] = blue;
	}
	return true;
}

function setFilter(flag){
	//Loading the base image
	cropperInstance.disabled = false;
	var img = document.getElementById("edited-img");
	contextfilter.canvas.height = img.height;
	contextfilter.canvas.width = img.width;

	contextfilter.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	contextfilter.drawImage(img, 0, 0);
	//context.putImageData(image,0,0);
	var imageTMP = contextfilter.getImageData(0, 0, canvasfilter.width, canvasfilter.height);//cropperInstance.getImageData();//context.getImageData(0, 0, canvas.width, canvas.height);

	// if(document.getElementById('filter8').checked){
		
	// 		$('.size-panel').css('display','flex')
		
	// }else{
	// 	$('.size-panel').css('display','none')
	// }
	var filterList=$('.filters input');
	filtered=imageTMP;
	for(var i=0;i<$('.filters input').length;i++){

		if(filterList[i].checked){

			var filter= filterList[i].value;
			
			switch (filter){
				case undefined:
					break;
				case 'Grayscale':
				filtered= ImageFilters.GrayScale(filtered);
				contextfilter.putImageData(filtered,0,0);		
					break;
				case 'GaussianBlur':
				filtered=ImageFilters.GaussianBlur(filtered, 2)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'StackBlur':
				filtered=ImageFilters.StackBlur(filtered, 6)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Brightness':
				filtered=ImageFilters.Brightness(filtered, 3)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Channels':
				//channel: 1- red, 2-green, 3- blue
				filtered=ImageFilters.Channels(filtered, 1)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Flip':
				//false:horizontal, true:vertical
				filtered=ImageFilters.Flip(filtered, false)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Resize':
				if(flag!=1 && $('#img_width').val()=='' ){
					$('#img_width').val(canvasfilter.width)
					$('#img_height').val(canvasfilter.height)
					aspect_ratio=canvasfilter.width/canvasfilter.height;
				}			
				
					break;
				case 'Sepia':
				filtered=ImageFilters.Sepia(filtered)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Sharpen':
				filtered=ImageFilters.Sharpen (filtered, 4)
				contextfilter.putImageData(filtered,0,0);	
					break;
				case 'Transpose':
				filtered=ImageFilters.Transpose (filtered)
				contextfilter.putImageData(filtered,0,0);	
					break;			
			
			}
		}
		
		

	}	

		var temp_img=document.getElementById("canvas3").toDataURL("image/png");
		
		context.clearRect(0, 0, canvas.width, canvas.height)	
		cropperInstance.replace(temp_img,false);
		/*context.canvas.height = temp_img.height;
		context.canvas.width = temp_img.width;*/
		cropperInstance.disabled = true;
}


function setSize(){
	//setFilter(1);
	cropperInstance.disabled = false;
	var img = document.getElementById("edited-img");
	contextfilter.canvas.height = img.height;
	contextfilter.canvas.width = img.width;

	contextfilter.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	contextfilter.drawImage(img, 0, 0);
	var imageTMP = contextfilter.getImageData(0, 0, canvasfilter.width, canvasfilter.height);//cropperInstance.getImageData();//context.getImageData(0, 0, canvas.width, canvas.height);

	
	// var img = document.getElementById("disp-img");
	// contextfilter.canvas.height = img.height;
	// contextfilter.canvas.width = img.width;

	// contextfilter.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	// contextfilter.drawImage(img, 0, 0);
	// //context.putImageData(image,0,0);
	// var imageTMP = contextfilter.getImageData(0, 0, canvasfilter.width, canvasfilter.height);//cropperInstance.getImageData();//context.getImageData(0, 0, canvas.width, canvas.height);
	// filtered=imageTMP;
	var width=$('#img_width').val();
	var height=$('#img_height').val();
	console.log(width+" - "+height)
	filtered=ImageFilters.Resize (imageTMP, width, height);				
	contextfilter.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	contextfilter.canvas.width=width;
	contextfilter.canvas.height=height;
	context.canvas.width=width;
	context.canvas.height=height;
	contextfilter.putImageData(filtered,0,0);
	temp_img=document.getElementById("canvas3").toDataURL("image/png");
		
		context.clearRect(0, 0, canvas.width, canvas.height)	
		cropperInstance.replace(temp_img);
		/*context.canvas.height = temp_img.height;
		context.canvas.width = temp_img.width;*/
		
		cropperInstance.disabled = true;
		
}
function setWidth(){
	var widthT=$('#img_height').val() * aspect_ratio;
	$('#img_width').val(Math.round(widthT));
				
}
function setHeight(){
	var heightT=$('#img_width').val() / aspect_ratio;
	$('#img_height').val(Math.round(heightT));
}
$('.apply-resize').click(function(){
	canvasfilter = document.getElementById('canvas3');
	imageDataURL = canvasfilter.toDataURL('image/png')
	document.getElementById("edited-img").src = imageDataURL;
	document.getElementById("disp-img").src = imageDataURL;
	
	
	if(ophead==oparations.length-1 || oparations.length==0){
		oparations.push({
			cw:$('#edited-img').width(),
			ch:$('#edited-img').height(),
			img:imageDataURL
		})
	}else{
		ophead++;
		oparations[ophead]=	{
			cw:$('#edited-img').width(),
			ch:$('#edited-img').height(),
			img:imageDataURL
		}
		oparations.length=ophead+1;
	}
	ophead=oparations.length-1;
	$('.undo').removeAttr('disabled')
	$('.redo').attr('disabled','disabled')
	// Swal.fire({
	// 	//position: 'top-end',
	// 	type: 'success',
	// 	title: 'Your work has been saved',
	// 	showConfirmButton: false,
	// 	timer: 1500
	//   })
	showmsg();
	 // $('.resize-box').hide();
	 // $('.control-panels').css('left', '100%')
})
$('.close-resize').click(function(){
	cropperInstance.destroy();
	var img = document.getElementById("edited-img");
	if(cropperInstance!=undefined && cropperInstance.canvas!==null){
		console.log("close 1")
		cropperInstance.disabled=false
		cropperInstance.replace(img.src);
		cropperInstance.disabled=true
	}else{
		console.log("close 2")
context.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	context.canvas.height = img.height;
	context.canvas.width = img.width;
	context.drawImage(img, 0, 0);
	}
	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
	$('.control-panels').css('left', '100%')
})
$('.apply-filter').click(function(){
	canvasfilter = document.getElementById('canvas3');
	imageDataURL = canvasfilter.toDataURL('image/png')
	document.getElementById("edited-img").src = imageDataURL;
	document.getElementById("disp-img").src = imageDataURL;
	
	for(var i=0;i<$('.filters input').length;i++){$('.filters input')[i].checked=false}
	
	if(ophead==oparations.length-1 || oparations.length==0){
		oparations.push({
			cw:$('#edited-img').width(),
			ch:$('#edited-img').height(),
			img:imageDataURL
		})
	}else{
		ophead++;
		oparations[ophead]=	{
			cw:$('#edited-img').width(),
			ch:$('#edited-img').height(),
			img:imageDataURL
		}
		oparations.length=ophead+1;
	}
	ophead=oparations.length-1;
	$('.undo').removeAttr('disabled')
	$('.redo').attr('disabled','disabled')
	// Swal.fire({
	// 	//position: 'top-end',
	// 	type: 'success',
	// 	title: 'Your work has been saved',
	// 	showConfirmButton: false,
	// 	timer: 1500
	//   })
	showmsg();
	  $('.filters').hide();
	  $('.control-panels').css('left', '100%')
})
$('.close-filter').click(function(){
	var img = document.getElementById("edited-img");
	if(cropperInstance!=undefined && cropperInstance.canvas!==null){
		cropperInstance.disabled=false
		cropperInstance.replace(img.src);
		cropperInstance.disabled=true
	}else{
context.clearRect(0, 0, canvasfilter.width, canvasfilter.height)
	context.canvas.height = img.height;
	context.canvas.width = img.width;
	context.drawImage(img, 0, 0);
	}
	
	$('.control-panels').css('left', '100%')
	for(var i=0;i<$('.filters input').length;i++){$('.filters input')[i].checked=false}
})