var canvas2
var f;
var canvasText;
var lastusedcolor;
var default_canvas;
var default_context;
function fabricinit() {

	fabric.filterBackend = fabric.initFilterBackend();
	//canvas2 = new fabric.Canvas('canvas1');
	//test = canvas2;
	f = fabric.Image.filters;
	var filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
		'brightness', 'contrast', 'saturation', 'noise', 'vintage',
		'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
		'polaroid', 'blend-color', 'gamma', 'kodachrome',
		'blackwhite', 'blend-image', 'hue', 'resize'
	];
	cropperInstance['filters'] = filters
	console.log(f)
	//applyFilter(0, new f.Grayscale());
}

function applyFilter(index, filter) {
	var obj = cropperInstance;
	obj.filters[index] = filter;
	var timeStart = +new Date();
	obj.applyFilters();
	var timeEnd = +new Date();
	var dimString = canvas2.width + ' x ' +
		canvas2.height;
	$('bench').innerHTML = dimString + 'px ' +
		parseFloat(timeEnd - timeStart) + 'ms';
	canvas2.renderAll();
}

var fitImageOn = function (canvas, imageObj, context) {
	console.log(imageObj.width)
	var imageAspectRatio = imageObj.width / imageObj.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	var renderableHeight, renderableWidth, xStart, yStart;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if (imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (canvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if (imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (canvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
	}
	console.log(renderableWidth, renderableHeight)
	context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
};

function setCrop() {

	if (cropperInstance.canvas == null) {
		cropperInstance = new Cropper(context.canvas, {
			autoCrop: false
		});
	} else {
		cropperInstance.disabled = false;
		cropperInstance.crop();
	}

	$('.edit-ops').css('display', 'none');
	$('.control-panels').css('left', '0');
	$('.crop').css('display', 'block');
	cropperInstance.disabled = false;
}

function initFilters() {

	$('.edit-ops').css('display', 'none');
	$('.control-panels').css('left', '0');
	$('.filters').css('display', 'block');

}

$('.close-crop').click(function () {
	$('#edited-img').attr('src', $('#disp-img').attr('src'));
	cropperInstance.clear();
	cropperInstance.disabled = true;
	$('.control-panels').css('left', '100%')
})

$('.ratio').click(function () {
	$('.ratio-rect').removeClass('active')
	$(this).find('.ratio-rect').addClass('active')
	var ratio = $(this).attr('data-ratio').split(':')
	//	console.log(ratio[0]/ratio[1])
	cropperInstance.setAspectRatio(ratio[0] / ratio[1])

})
$('.apply-crop').click(function () {
	var croppedImageDataURL = cropperInstance.getCroppedCanvas().toDataURL("image/jpeg");

	$('#disp-img').attr('src', croppedImageDataURL);
	$('#edited-img').attr('src', croppedImageDataURL);

	cropperInstance.replace(croppedImageDataURL);
	//cropperInstance.destroy();
	$('#canvas1').attr('width', $('#edited-img').width())
	$('#canvas1').attr('height', $('#edited-img').height())

	if (ophead == oparations.length - 1 || oparations.length == 0) {
		oparations.push({
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: croppedImageDataURL
		})
	} else {
		ophead++;
		oparations[ophead] = {
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: croppedImageDataURL
		}
		oparations.length = ophead + 1;
	}
	ophead = oparations.length - 1;
	$('.undo').removeAttr('disabled')
	$('.redo').attr('disabled', 'disabled')
	$('.control-panels').css('left', '100%')
	$('.edit-ops').css('display', 'none')	
	
	showmsg();
	
	// Swal.fire({
	// 	//position: 'top-end',
	// 	type: 'success',
	// 	title: 'Your work has been saved',
	// 	showConfirmButton: false,
	// 	timer: 1500
	// })
	cropperInstance.clear();
	cropperInstance.disabled = true;
})

function resetCanvas(){

	cropperInstance.destroy();
	default_canvas = document.getElementById('canvas1');
	default_context = default_canvas.getContext('2d');
	//cropperInstance.disabled = false;
	var img2 = document.getElementById("edited-img");
	default_context.canvas.height = img2.height;
	default_context.canvas.width = img2.width;

	default_context.clearRect(0, 0, default_canvas.width, default_canvas.height)
	default_context.drawImage(img2, 0, 0);

	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
}
/* img filters */
function setFilters() {
	fabricinit();
	applyFilter(0, new f.Grayscale());
}

function hexToRgb(hex, alpha) {
	hex = hex.replace('#', '');
	var r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
	var g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
	var b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
	if (alpha) {
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
	} else {
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}
}

function setCanvas(){
	resetCanvas = document.getElementById('canvas1');
	resetcontextoverlay = resetCanvas.getContext('2d');
	//cropperInstance.disabled = false;
	var img = document.getElementById("edited-img");
	resetcontextoverlay.canvas.height = img.height;
	resetcontextoverlay.canvas.width = img.width;

	resetcontextoverlay.clearRect(0, 0, resetCanvas.width, resetCanvas.height)
	resetcontextoverlay.drawImage(img, 0, 0);

	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
}
function setOverlay() {
	$('.edit-ops').css('display', 'none');
	$('.control-panels').css('left', '0');
	$('.overlay').css('display', 'block');
	$('#opacityRange').val('0.5')
	$('.opacity').html($('#opacityRange').val())

	cropperInstance.destroy();
	canvasoverlay = document.getElementById('canvas1');
	contextoverlay = canvasoverlay.getContext('2d');
	//cropperInstance.disabled = false;
	var img = document.getElementById("edited-img");
	contextoverlay.canvas.height = img.height;
	contextoverlay.canvas.width = img.width;

	contextoverlay.clearRect(0, 0, canvasoverlay.width, canvasoverlay.height)
	contextoverlay.drawImage(img, 0, 0);

	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
}

function setOpacity() {
	$('.opacity').html($('#opacityRange').val())
	showOpacity(lastusedcolor)
}

function showOpacity(color) {
	if(color==undefined){
		return;
	}
	lastusedcolor = color;
	color = color.replace("op", $('#opacityRange').val());
	var img = document.getElementById("edited-img");
	context.clearRect(0, 0, canvasoverlay.width, canvasoverlay.height)
	context.drawImage(img, 0, 0);
	context.beginPath();
	context.rect(0, 0, canvasoverlay.width, canvasoverlay.height);
	context.fillStyle = color;
	context.fill();

}
$('.apply-overlay').click(function () {
	// context.beginPath();
	// context.rect(0, 0, canvasoverlay.width, canvasoverlay.height);
	// context.fillStyle = 'red';
	// context.globalAlpha = 0.2;
	// context.fill();

	canvasoverlay = document.getElementById('canvas1');
	imageDataURL = canvasoverlay.toDataURL('image/png')
	document.getElementById("edited-img").src = imageDataURL;
	document.getElementById("disp-img").src = imageDataURL;



	if (ophead == oparations.length - 1 || oparations.length == 0) {
		oparations.push({
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: imageDataURL
		})
	} else {
		ophead++;
		oparations[ophead] = {
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: imageDataURL
		}
		oparations.length = ophead + 1;
	}
	ophead = oparations.length - 1;
	$('.undo').removeAttr('disabled')
	$('.redo').attr('disabled', 'disabled')
	$('.overlay').hide();
	$('.control-panels').css('left', '100%')
	// Swal.fire({
	// 	//position: 'top-end',
	// 	type: 'success',
	// 	title: 'Your work has been saved',
	// 	showConfirmButton: false,
	// 	timer: 1500
	// })
	showmsg();
})
$('.custom-overlay').click(function () {
	var color = hexToRgb($('#overlay-color').val(),$('.custom-range').val()) //$('#custom-overlay').val();
	console.log(color)
	var img = document.getElementById("edited-img");
	context.clearRect(0, 0, canvasoverlay.width, canvasoverlay.height)
	context.drawImage(img, 0, 0);
	context.beginPath();
	context.rect(0, 0, canvasoverlay.width, canvasoverlay.height);
	context.fillStyle = color;
	context.fill();
})
$('.close-overlay').click(function () {
	var img = document.getElementById("edited-img");
	context.clearRect(0, 0, canvasoverlay.width, canvasoverlay.height)
	context.canvas.height = img.height;
	context.canvas.width = img.width;
	context.drawImage(img, 0, 0);
	$('.control-panels').css('left', '100%')
})
$('.text-overlay-cancel').click(function () {
	var img = document.getElementById("edited-img");
	context.clearRect(0, 0, canvasText.width, canvasText.height)
	context.drawImage(img, 0, 0);
	$('.control-panels').css('left', '100%')
	
})

var activeText;
var updateActive=false;
var addtext_instance;
function addText() {
	
	var buttonText = canvasText.display.text({
		x: canvasText.width / 2,
		y: canvasText.width / 5,
		origin: {
			x: "center",
			y: "center"
		},
		align: "center",
		//font: "bold 25px sans-serif",
		family: $('#font-family').val(),
		size: $('#font-size').val() == '' ? 36 : parseInt($('#font-size').val()),
		weight: $('#font-wt').val(),
		text: $('#overlay-text').val(),
		width: 200,
		fill: $('#color').val()
	});

	canvasText.addChild(buttonText);
	var dragOptions = {
		changeZindex: true
	};
	buttonText.dragAndDrop(dragOptions);

	buttonText.bind("dblclick ", function () {
		//console.log(this)
		updateActive=true;
		activeText = this;
		//canvasText.removeChild(this)
		$('#font-family').val(activeText.family);
		$('#overlay-text').val(activeText.text)
		$('#font-wt').val(activeText.weight);
		$('#font-size').val(activeText.size)
		$('#color').val(activeText.fill)
		$('.addText').css('display', 'none')
		$('.updateText').css('display', 'inline-block')
		$('.cancelUpdateText').css('display', 'inline-block')
	})

	$('#font-family option:first-child').attr("selected", "selected");
	$('#font-wt option:first-child').attr("selected", "selected");
	$('#font-size').val('')
	$('#overlay-text').val('')

}
$('.updateText').click(function(){
	updateActive=false;
})
function updateText(temp) {
	
	activeText.family = $('#font-family').val();
	activeText.text = $('#overlay-text').val()
	activeText.weight = $('#font-wt').val();
	activeText.size = parseInt($('#font-size').val());
	activeText.fill = $('#color').val()
	activeText.redraw();
	if(temp==undefined){
		$('.updateText').css('display', 'none')
		$('.cancelUpdateText').css('display', 'none')
		$('.addText').show();
		$('#font-family option:first-child').attr("selected", "selected");
	$('#font-wt option:first-child').attr("selected", "selected");
	$('#font-size').val('')
	$('#overlay-text').val('')
	}

}
function updateActiveText(){
	if(updateActive==true){
		updateText(1);
	}
}
$('.text-overlay-apply').click(function () {
	canvasText = document.getElementById('canvas1');
	imageDataURL = canvasText.toDataURL('image/png')
	document.getElementById("edited-img").src = imageDataURL;

	if (ophead == oparations.length - 1 || oparations.length == 0) {
		oparations.push({
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: imageDataURL
		})
	} else {
		ophead++;
		oparations[ophead] = {
			cw: $('#edited-img').width(),
			ch: $('#edited-img').height(),
			img: imageDataURL
		}
		oparations.length = ophead + 1;
	}
	ophead = oparations.length - 1;
	$('.undo').removeAttr('disabled')
	$('.redo').attr('disabled', 'disabled')
	$('.control-panels').css('left', '100%')
	$('.text-overlay').css('display', 'none')


	// Swal.fire({
	// 	//position: 'top-end',
	// 	type: 'success',
	// 	title: 'Your work has been saved',
	// 	showConfirmButton: false,
	// 	timer: 1500
	// })
	showmsg();
	
	addtext_instance.destroy();
	setTimeout(function(){
		setCanvas();
	},0)
	
	
})
$('.cancelUpdateText').click(function () {
	$('.updateText').css('display', 'none')
	$('.addText').css('display', 'block')
	$('.cancelUpdateText').css('display', 'none')
})

function setTextBox() {
	$('.addText').css('display', 'block')
	$('.updateText').css('display', 'none')
	$('.cancelUpdateText').css('display', 'none')
	//$('#font-family option:first-child').attr("selected", "selected");
	$('#font-family').val($('#font-family option:first-child').val())
	//$('#font-wt option:first-child').attr("selected", "selected");
	$('#font-wt').val($('#font-wt option:first-child').val());
	$('#font-size').val('')
	$('#overlay-text').val('')
	var imgObj = document.getElementById("edited-img").src
	if (!imgObj.includes('base64')) {
		var tempimg = document.getElementById("edited-img");
		var vertualcanvas = document.createElement('canvas');
		vertualcanvas.width = tempimg.naturalWidth; // or 'width' if you want a special/scaled size
		vertualcanvas.height = tempimg.naturalHeight; // or 'height' if you want a special/scaled size
		vertualcanvas.getContext('2d').drawImage(tempimg, 0, 0);
		croppedImageDataURL = vertualcanvas.toDataURL('image/png')
		document.getElementById("edited-img").src = croppedImageDataURL;
	}
	$('.edit-ops').css('display', 'none');
	$('.control-panels').css('left', '0');
	$('.text-overlay').css('display', 'block');
	cropperInstance.destroy();
	canvasText = document.getElementById('canvas1');

	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}

	$('#canvas1').attr('width', document.getElementById("edited-img").width)
	$('#canvas1').attr('height', document.getElementById("edited-img").height)
	canvasText = oCanvas.create({
		canvas: "#canvas1"
	});
	console.log(canvasText)
	addtext_instance=canvasText;
	var image = canvasText.display.image({
		x: 0,
		y: 0,

		image: document.getElementById("edited-img").src
	});

	canvasText.addChild(image);
	var button = canvasText.display.rectangle({
		x: canvasText.width / 2,
		y: canvasText.width / 5,
		origin: {
			x: "center",
			y: "center"
		},
		width: 300,
		height: 40,
		fill: "#079",
		stroke: "10px #079",
		join: "round"
	});
	// var buttonText = canvasText.display.text({
	// 	x: canvasText.width / 2,
	// 	y: canvasText.width / 5,
	// 	origin: { x: "center", y: "center" },
	// 	align: "center",
	// 	font: "bold 25px sans-serif",
	// 	text: "Toggle Rotation",
	// 	fill: "#fff"
	// });
	//	button.addChild(buttonText);
	// canvasText.addChild(buttonText);
	// var dragOptions = { changeZindex: true };
	// buttonText.dragAndDrop(dragOptions);

}


function setResizeBox() {
	var tempCanvas=document.getElementById('canvas1')
	$('#img_width').val(tempCanvas.width)
					$('#img_height').val(tempCanvas.height)
					aspect_ratio=tempCanvas.width/tempCanvas.height;
					
	$('.edit-ops').css('display', 'none');
	$('.control-panels').css('left', '0');
	$('.resize-box').css('display', 'block');

}

function loadAndUse(font) {
	var myfont = new FontFaceObserver(font)
	myfont.load()
		.then(function () {
			// when font is loaded, use it.
			canvasText.getActiveObject().set("fontFamily", font);
			canvasText.requestRenderAll();
		}).catch(function (e) {
			console.log(e)
			alert('font loading failed ' + font);
		});
}

function showmsg(){
	$('.resp-msg').show()
setTimeout(function(){
	hidesmsg();
},2000)
}
function hidesmsg(){
	$('.resp-msg').hide()
}