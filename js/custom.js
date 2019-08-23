var page = 1;
var loading = false;
//var base_url = 'http://imageedit.saltdigital.in/includes/';
var base_url = 'http://localhost/RFI/includes/';
var orientation_global;
var oparations = [];
var ophead = -1;
var img_download;

function runScript(event) {

	if (event.keyCode == 13) {
		//$('.search-text').val();
		//	if($('.search-text').val().trim()!=''){
		//console.log($('.search-text').val().trim())
		getImages(1);
		//	}

	}
}

function checkOrientation(url) {
	var orientation,
		img = new Image();

	img.onload = function () {

		if (img.naturalWidth > img.naturalHeight) {
			orientation = 'landscape';
		} else if (img.naturalWidth < img.naturalHeight) {
			orientation = 'portrait';
		} else {
			orientation = 'even';
		}
		orientation_global = orientation;
		console.log(orientation)
		document.getElementById("disp-img").src = url;
		if (orientation == 'landscape') {
			$('#disp-img').css('width', '75%')
		} else {
			$('#disp-img').css('width', '35%')
		}
	}
	img.src = url;
}
$('#editor-modal').on('hidden.bs.modal', function (e) {
	if (cropperInstance != undefined) {
		cropperInstance.disabled = false;
		cropperInstance.destroy();
	}
	$('.undo-redo').hide();
})
$('.close-edit').click(function () {
	console.log(cropperInstance)
	if (cropperInstance.canvas != null) {
		resetCanvas();
	}
	$('.top-action-btn').show()
	$('.action-btns').hide()
    $('.undo-redo').hide();
    $('.credit-info').show();
	// var img2 = document.getElementById("edited-img");

	// var imgObj = img2.src
	// if (imgObj.includes('base64')) {
	// 	$('.save-download').css('display', 'inline-block');
	// 	$('.download-original').css('display', 'none');

	// } else {
	// 	$('.save-download').css('display', 'none');
	// 	$('.download-original').css('display', 'inline-block');
	// }

})
// $('.close-edit').click(function () {
// 	$('.top-action-btn').show()
// 	$('.action-btns').hide()
// })
$(window).scroll(function () {
	if (loading == false) {
		if (Math.round((window.innerHeight + $(window).scrollTop())) == $(document).height()) {
			loading = true;
			$('.loader').show();
			var keyword = $('#query').val() == '' ? '' : $('#query').val();
			var service = $("input[name='site-filter']:checked").val();
			var data = {
				'page': page,
				//	'method': 'apiCall',
				'keyword': keyword,
				'service': service,

			};
			$.ajax({
				url: base_url + 'ajax.php', //"https://36afde7e.ngrok.io/RFI/data.json",
				method: 'post',
				data: data,
				success: function (result) {
					result = JSON.parse(result);
					var temphtml = '';
					for (i = 0; i < result.length; i++) {
                        var user="{'userimage':'"+result[i].userimage+"', 'username':'"+result[i].username+"', 'userlink':'"+result[i].userlink+"', 'credit':'"+result[i].credit+"'}";

                        
						temphtml = temphtml + '<div class="item"><a data-toggle="modal" data-target=".bd-example-modal-xl" data-user="'+user+'" data-img="' + result[i].imageurl +
							'"><div class="img-container"><img src="' + result[i].imageurlsmall +
							'"></div></a><div class="credit"><a href="' + result[i].landing + '" target="_blank">' + result[i].credit + '</a></div></div>'
					}
					$('.image-content').append(temphtml);
					page++;
					loading = false;
					$('.loader').hide();
				}
			});
		}
	}

});

function getImages(flag) {
	//	$('.loader').show();
	//if (flag != 1 && $('#query').val().trim() == '') {
	// 	if (flag != undefined) {
	// 	return;
	// }
	$('.loading').show();
	var keyword = $('#query').val().trim() == '' ? '' : $('#query').val().trim();
	var service = $("input[name='site-filter']:checked").val();

	if (service == 'all') {
		//service = '';
	}
	if (flag == 1) {
		page = 1
	}
	var data = {
		'page': page,
		'method': 'apiCall',
		'keyword': keyword,
		'service': service
	};
	$.ajax({
		url: base_url + 'ajax.php', //"https://36afde7e.ngrok.io/RFI/data.json",
		method: 'post',
		data: data,
		success: function (result) {

			//	$('.loader').hide();
			$('.loading').hide();
			if (result == '[]') {
				$('.image-content').html('<h2 class="mt-5 text-center">No results found</h2>');
				return;
			}
			result = JSON.parse(result);
			var temphtml = '';
			for (i = 0; i < result.length; i++) {
                var user="{'userimage':'"+result[i].userimage+"', 'username':'"+result[i].username+"', 'userlink':'"+result[i].userlink+"', 'credit':'"+result[i].credit+"'}";
				temphtml = temphtml + '<div class="item"><a data-toggle="modal" data-target=".bd-example-modal-xl" data-user="'+(user)+'" data-img="' + result[i].imageurl +
					'"><div class="img-container"><img src="' + result[i].imageurlsmall +
					'"></div></a><div class="credit"><a href="' + result[i].landing + '" target="_blank">' + result[i].credit + '</a></div></div>'
			}
			$('.image-content').html(temphtml);
			page++;
		}
	});
}

////////////////////////

var coordinates;
//	let canvas;
$(document).ready(function () {

	$('.image-content').on('click', 'a', function () {

       var userdata= $(this).attr('data-user');
       userdata=JSON.parse(userdata.replace(/'/g, '"'));
       document.getElementById("user-photo").src=userdata.userimage;
        $('.username').html('@'+userdata.username)
        $('.source').html(userdata.credit)
        $('.userlink').attr('href',userdata.userlink)
		$('.modal-content').hide();
		$('.loading').show();
		/* check image load */
		$("#disp-img")
			.on('load', function () {
				$('.modal-content').show();
				$('.loading').hide();

				/* canvas for original img download */
				var canvas3 = document.getElementById('canvas3');
				var context3 = canvas3.getContext('2d');
				context3.clearRect(0, 0, canvas3.width, canvas3.height);
				var img3 = document.getElementById("temp-img");
				//var img = document.getElementById("temp-img");
				context3.canvas.height = img3.height;
				context3.canvas.width = img3.width;
				context3.clearRect(0, 0, canvas3.width, canvas3.height)
				context3.drawImage(img3, 0, 0);

				/* end */

			})
			.on('error', function () {

				$('.modal-content').show();
				$('.loading').hide();
			});
		/* end load */
		$('.top-action-btn').show()
		$('.action-btns').hide()
		$('#canvas1').css('display', 'none');
		$('#disp-img').css('display', 'block');
		$('.action-btns').css('display', 'none')
		$('.control-panels').css('left', '100%')
		for (var i = 0; i < $('.filters input').length; i++) {
			$('.filters input')[i].checked = false
		}
		document.getElementById("temp-img").src = $(this).attr('data-img')
		document.getElementById("disp-img").src = $(this).attr('data-img')
		document.getElementById("edited-img").src = $(this).attr('data-img')
		checkOrientation($(this).attr('data-img'));

		var canvas = document.getElementById('canvas1');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		var imageObj = new Image();
		imageObj.src = $(this).attr('data-img')
		oparations = [];
		ophead = 0;
		$('.undo').attr('disabled', 'disabled')
		$('.redo').attr('disabled', 'disabled')
	});

	getImages(1);

});

function applyChanges() {
	var croppedImageDataURL = cropperInstance.getCroppedCanvas().toDataURL("image/png");
	$('.action-btns').append($('<img>').attr('src', croppedImageDataURL));
	cropperInstance.destroy();
}

function saveImage() {
	$('.loading').show();

	if (cropperInstance != undefined && cropperInstance.canvas != null) {
		var croppedImageDataURL = cropperInstance.getCroppedCanvas().toDataURL("image/png");
		var filesize = getBase64ImageSize(croppedImageDataURL);
		if (filesize > post_size) {
			alert('File size not more than ' + post_size + 'MB');
			return;
		}
		var data = {
			'method': 'uploadImage',
			'imgdata': croppedImageDataURL
		};
		$.ajax({
			url: base_url + 'upload_image.php', //"https://36afde7e.ngrok.io/imageProcessing/imageApi.php",
			method: 'post',
			data: data,
			success: function (result) {
				//console.log(result.flag)
				result = JSON.parse(result)
				//alert(result.msg)
				$('.loading').hide();
				img_download = result.file;
				var link = document.createElement('a');
				link.download = "image-download";
				link.href = img_download;
				link.click();

			}
		});

		//return image;
	} else {
		var img = document.getElementById("edited-img");
		var vertualcanvas = document.createElement('canvas');
		vertualcanvas.width = img.naturalWidth; // or 'width' if you want a special/scaled size
		vertualcanvas.height = img.naturalHeight; // or 'height' if you want a special/scaled size
		vertualcanvas.getContext('2d').drawImage(img, 0, 0);

		// Get raw image data
		//callback(vertualcanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
		croppedImageDataURL = vertualcanvas.toDataURL('image/png')
		var data = {
			'method': 'uploadImage',
			'imgdata': croppedImageDataURL
		};
		$.ajax({
			url: base_url + 'upload_image.php', //"https://36afde7e.ngrok.io/imageProcessing/imageApi.php",
			method: 'post',
			data: data,
			success: function (result) {
				$('.loading').hide();

				//console.log(result.flag)
				result = JSON.parse(result)
				img_download = result.file;
				var link = document.createElement('a');
				link.download = "image-download";
				link.href = img_download;
				link.click();
				//$('.download').click();

			}
		});
	}

}

function checkarea(img, selection) {
	coordinates = selection;
}


let canvas = $("#canvas1");
const context = canvas.get(0).getContext("2d");

var base64String;
var croppedImageDataURL;
var cropperInstance;

const resultWrapper = document.querySelector(".result-wrapper");
const resultImage = document.querySelector(".result-image");
const base64StringWrapper = document.querySelector(".base64-string-wrapper");
const base64Debugger = document.querySelector(".base64-debugger");
const base64GenerateButton = document.querySelector(".base64-generate-button");
const base64DownloadButton = document.querySelector(".base64-download-button");
const fileInput = document.querySelector(".fileInput");
const restoreCanvasButton = document.querySelector(".restore-canvas-button");
const cropCanvasButton = document.querySelector(".crop-canvas-button");
const rotateCanvasButton = document.querySelector(".rotate-canvas-button");
const img = new Image();
const reader = new FileReader();

function editImage() {
	$('.undo-redo').show();
	$('.top-action-btn').hide();
	$('.credit-info').hide();
	$('.action-btns').css('display', 'block')
	$('#canvas1').css('display', 'block');
	$('#disp-img').css('display', 'none');
	$('#img_width').val('');
	if (cropperInstance != undefined && cropperInstance.canvas != null) {
		//cropperInstance.disabled = false;
		//cropperInstance.destroy();
		return;
	}
	var img;
	var imgObj = document.getElementById("edited-img").src
	if (imgObj.includes('base64')) {
		img = imgObj
	} else {
		img = document.getElementById("temp-img");
		//var img = document.getElementById("temp-img");
		context.canvas.height = img.height;
		context.canvas.width = img.width;
		/* temp */
		contextfilter.canvas.height = img.height;
		contextfilter.canvas.width = img.width;
		/* end temp */

	}

	context.clearRect(0, 0, canvas.width, canvas.height)
	context.drawImage(img, 0, 0);
	contextfilter.drawImage(img, 0, 0);
	cropperInstance = new Cropper(context.canvas, {
		autoCrop: false
	});
	setTimeout(function () {
		cropperInstance.disabled = true;
	}, 1000);

}

$('.site-filters input').click(function () {
	getImages(1);
	//console.log(this.value)
	// if (this.value != 'all') {
	// 	getImages(1)
	// }
})

function getBase64ImageSize(base64Image) { //return memory size in B, KB, MB

	size_in_bytes = parseInt(((base64Image.length) * 3 / 4));
	size_in_kb = size_in_bytes / 1024;
	size_in_mb = size_in_kb / 1024;
	return size_in_mb;

}

function getDataUri(url, callback) {
	var image = new Image();

	image.onload = function () {
		var vertualcanvas = document.createElement('canvas');
		vertualcanvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
		vertualcanvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

		vertualcanvas.getContext('2d').drawImage(this, 0, 0);

		// Get raw image data
		//callback(vertualcanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
		console.log(vertualcanvas.toDataURL('image/png'))
		// ... or get as Data URI
		//callback(canvas.toDataURL('image/png'));
	};

	image.src = url;
}
$('.undo').click(function () {
	$('.redo').removeAttr('disabled')
	canvasundo = document.getElementById('canvas1');
	contextundo = canvasundo.getContext('2d');
	//cropperInstance.disabled = false;
	if (ophead == 0) {

		document.getElementById("edited-img").src = document.getElementById("temp-img").src
	} else {
		document.getElementById("edited-img").src = oparations[ophead - 1].img;
	}
	//document.getElementById("edited-img").src=oparations[ophead-1].img;
	var img2 = document.getElementById("edited-img");
	contextundo.canvas.height = img2.height;
	contextundo.canvas.width = img2.width;
	contextundo.clearRect(0, 0, canvasundo.width, canvasundo.height)
	if (cropperInstance != undefined && cropperInstance.canvas != null) {
		cropperInstance.disabled = false;
		cropperInstance.replace(img2.src);
	} else {
		//contextundo.clearRect(0, 0, canvasundo.width, canvasundo.height)
		//contextundo.drawImage(img2, 0, 0);
		if (ophead == 0) {
			img2 = document.getElementById("temp-img");
			context.canvas.height = img2.height;
			context.canvas.width = img2.width;
			/* temp */
			contextfilter.canvas.height = img2.height;
			contextfilter.canvas.width = img2.width;

			context.clearRect(0, 0, canvas.width, canvas.height)
			context.drawImage(img2, 0, 0);
			contextfilter.drawImage(img2, 0, 0);
			cropperInstance = new Cropper(context.canvas, {
				autoCrop: false
			});
		} else {
			contextundo.clearRect(0, 0, canvasundo.width, canvasundo.height)
			contextundo.drawImage(img2, 0, 0);
		}
	}


	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
	if (ophead - 1 < 0) {
		$('.undo').attr('disabled', 'disabled')
	}
	//if(ophead-1>=0){
	ophead--;
	//}
	cropperInstance.disabled = true;
})

$('.redo').click(function () {

	canvasundo = document.getElementById('canvas1');
	contextundo = canvasundo.getContext('2d');
	//cropperInstance.disabled = false;
	if (ophead <= oparations.length - 1) {
		document.getElementById("edited-img").src = oparations[ophead + 1].img;
	}
	// if (ophead == 0) {

	// 	document.getElementById("edited-img").src = document.getElementById("temp-img").src
	// } else {
	// 	document.getElementById("edited-img").src = oparations[ophead - 1].img;
	// }
	//document.getElementById("edited-img").src=oparations[ophead-1].img;
	var img2 = document.getElementById("edited-img");
	contextundo.canvas.height = img2.height;
	contextundo.canvas.width = img2.width;
	contextundo.clearRect(0, 0, canvasundo.width, canvasundo.height)
	if (cropperInstance != undefined && cropperInstance.canvas != null) {
		cropperInstance.disabled = false;
		cropperInstance.replace(img2.src);
	} else {
		contextundo.clearRect(0, 0, canvasundo.width, canvasundo.height)
		contextundo.drawImage(img2, 0, 0);
	}


	if (orientation_global == 'landscape') {
		$('#canvas1').css('width', '75%')
	} else {
		$('#canvas1').css('width', '35%')
	}
	ophead++;
	if (ophead == oparations.length - 1) {
		$('.redo').attr('disabled', 'disabled')
		$('.undo').removeAttr('disabled')
	} else {

	}
	//if(ophead-1>=0){

	//}
	cropperInstance.disabled = true;
})

function download_image() {
	var link = document.createElement('a');
	link.download = "image-download";
	link.href = document.getElementById("edited-img").src;
	link.click();

	return;
	if (cropperInstance != undefined && cropperInstance.canvas != null) {
		console.log('1')
		var canvas = document.getElementById("canvas1");
		image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		var link = document.createElement('a');
		link.download = "image-download.png";
		link.href = image;
		link.click();

	} else {
		console.log('2')

		var img2 = document.getElementById("edited-img");

		var imgObj = img2.src
		if (imgObj.includes('base64')) {
			//img = imgObj

			var vertualcanvas = document.getElementById("canvas3");
			vertualcanvas.width = img2.naturalWidth; // or 'width' if you want a special/scaled size
			vertualcanvas.height = img2.naturalHeight; // or 'height' if you want a special/scaled size
			vertualcanvas.getContext('2d').drawImage(img2, 0, 0);

			// Get raw image data
			//callback(vertualcanvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
			//	image = vertualcanvas.toDataURL('image/png');
			image = vertualcanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

			var link = document.createElement('a');
			link.download = "image-download.png";
			//	link.setAttribute('download',true);
			link.href = image;
			link.click();
		} else {
			// console.log('else')
			var img2 = document.getElementById("edited-img");
			var canvas = document.getElementById("canvas3");
			var ctx = canvas.getContext("2d");
			//image = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');//canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			// var link = document.createElement('a');
			// link.download = "image-download.png";
			// link.href = image;
			// link.click();

			// step 1 - resize to 50%
			var oc = document.createElement('canvas'),
				octx = oc.getContext('2d');
			oc.width = canvas.width * 0.5;
			oc.height = canvas.height * 0.5;
			octx.drawImage(img, 0, 0, oc.width, oc.height);

			console.log(oc.width + '----' + (oc.width * 0.5))
			// step 2
			octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);


			ctx.drawImage(img2, 0, 0, img2.width * 0.5, img2.height * 0.5,
				0, 0, img2.width, img2.height);
			// step 3, resize to final size
			ctx.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5,
				0, 0, img2.width, img2.height);

			image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			var link = document.createElement('a');
			link.download = "image-download.png";
			link.href = image;
			link.click();

		}


	}


}

function resizeBase64Img(base64, width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");
	var deferred = $.Deferred();
	$("<img/>").attr("src", "data:image/gif;base64," + base64).load(function () {
		context.scale(width / this.width, height / this.height);
		context.drawImage(this, 0, 0);
		deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
	});
	return deferred.promise();
}

function get_action(form) {
	console.log(form)
	form.action = document.getElementById("edited-img").src + '?attachment';
}

function get_save_download(form) {
	console.log(form)
	form.action = img_download + '?attachment';

}