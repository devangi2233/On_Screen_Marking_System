// function convertToBase64() {
// 	var selectedFile = document.getElementById("inputFile").files;
// 	if (selectedFile.length > 0) {
// 		var fileToLoad = selectedFile[0];
// 		var fileReader = new FileReader();
// 		var base64;
// 		fileReader.onload = function(fileLoadedEvent) {
// 			base64 = fileLoadedEvent.target.result;
// 			console.log(base64);
// 		};
// 		fileReader.readAsDataURL(fileToLoad);
		// String(base64);
		// console.log(typeof base64);
// 		base64 = base64.substr(0,27);
// 		$('#pdfBase64').val() == base64;
// 	}
// }

var pdfData = atob($('#pdfBase64').val());
var maxPDFx = 595;
var maxPDFy = 842;
var offsetY = 7;

'use strict';
pdfjsLib.GlobalWorkerOptions.workerSrc ='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

var loadingTask = pdfjsLib.getDocument({data: pdfData});
loadingTask.promise.then(function(pdf) {
	var next_page = document.getElementById("next_pg");
	var prev_page = document.getElementById("prev_pg");
	var page_no = 1;
	page_preview();
	next_page.onclick = function(){
		if(pdf.numPages >= page_no){
			page_no = page_no + 1;
			// window.location = window.location.origin+'/index.html'+'?page_no='+page_no;
			page_preview();
		}
	}
	prev_page.onclick = function(){
		if(page_no != 1){
			page_no = page_no - 1;
			page_preview();
		}
	}
	function page_preview(){
		pdf.getPage(page_no).then(function(page) {
			var scale = 3.0;
			var viewport = page.getViewport(scale);
			var canvas = document.getElementById('the-canvas');
			var context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			page.render(renderContext).then(function() {
				$(document).trigger("pagerendered");
		}, function() {
		console.log("ERROR");
		});
	  
	  });
	}
  });

//   interact('.dropzone').dropzone({
//     accept: '.drag-drop',
//     overlap: 1,
//     ondropactivate: function (event) {
//     	event.target.classList.add('drop-active');
//     },
//     ondragenter: function (event) {
//       	var draggableElement = event.relatedTarget,
//         dropzoneElement = event.target;
//       	dropzoneElement.classList.add('drop-target');
//       	draggableElement.classList.add('can-drop');
//       	draggableElement.classList.remove('dropped-out');
//     },
//     ondragleave: function (event) {
//       	event.target.classList.remove('drop-target');
//       	event.relatedTarget.classList.remove('can-drop');
//       	event.relatedTarget.classList.add('dropped-out');
//     },
//     ondrop: function (event) {
//     },
//     ondropdeactivate: function (event) {
//       	event.target.classList.remove('drop-active');
//       	event.target.classList.remove('drop-target');
//     }
//   });

//   interact('.drag-drop')
//     .draggable({
//       inertia: true,
//       restrict: {
//         restriction: "#selectorContainer",
//         endOnly: true,
//         elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
//       },
//       autoScroll: true,
//       onmove: dragMoveListener,
//     });
  
  
  function dragMoveListener (event) {
	    // var target = event.target,
	    //     x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
	    //     y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	    // translate the element
	    // target.style.webkitTransform =
	    // target.style.transform ='translate(' + x + 'px, ' + y + 'px)';

	    // update the posiion attributes
	    // target.setAttribute('data-x', x);
	    // target.setAttribute('data-y', y);
	  }

	  // this is used later in the resizing demo
	//   window.dragMoveListener = dragMoveListener;

  	$(document).bind('pagerendered', function (e) {
	   	$('#pdfManager').show();
	   	var parametri = JSON.parse($('#parameters').val());
		$('#parametriContainer').empty();
	   	renderizzaPlaceholder(0, parametri);
	});
  
  function renderizzaPlaceholder(currentPage, parametri){
		  	// var maxHTMLx = $('#the-canvas').width();
			// var maxHTMLy = $('#the-canvas').height();
		
			// var paramContainerWidth = $('#parametriContainer').width();
			var yCounterOfGenerated = 0;
			var numOfMaxItem = 6;
			var notValidHeight = 60;
			var y = 0;
			var x = 10;
			var page=2;
			
			// var totalPages=Math.ceil(parametri.length/numOfMaxItem);
			
			for (i = 0; i < parametri.length; i++) {
				var param = parametri[i];
				var page = Math.floor(i/numOfMaxItem);
				// var display= currentPage == page ? "block" : "none";
				
				if(i > 0 && i%numOfMaxItem == 0){
					yCounterOfGenerated = 0;
				}

				var classStyle = "";
				var valore = param.valore;
		
				if(i > 0 && i%numOfMaxItem == 0){
					yCounterOfGenerated = 0;
				}

				var classStyle = "";
				var valore = param.valore;
				y = yCounterOfGenerated;
				yCounterOfGenerated += notValidHeight;
				classStyle = "drag-drop dropped-out";
				
				// $("#parametriContainer").append('<div class="'+classStyle+'" data-id="-1" data-page="'+page+'" data-toggle="'+valore+'" data-valore="'+valore+'" data-x="'+x+'" data-y="'+y+'" style="transform: translate('+x+'px, '+y+'px); display:'+display+'">  <span class="circle"></span><span class="descrizione">'+param.descrizione+' </span></div>');
				$("#parametriContainer").append('<img class="'+classStyle+'" id="'+param.descrizione+'" marks="'+param.descrizione+'" width="50px" height="50px" ondragstart="drag(event)" src="'+param.src+'" data-id="'+param.idParametroModulo+'" data-toggle="'+valore+'" data-valore="'+valore+'" data-x="'+x+'" data-y="'+y+'" style="transform: translate('+x+'px, '+y+'px);"></img>');
			}
			
			y = notValidHeight * (numOfMaxItem+1);
			// var prevStyle = "";
			// var nextStyle = "";
			// var prevDisabled = false;
			// var nextDisabled = false;
			// if(currentPage == 0){
			// 	prevStyle = "disabled";
			// 	prevDisabled = true;
			// }
			
			// if(currentPage >= totalPages-1 || totalPages == 1){
			// 	nextDisabled=true;
			// 	nextStyle="disabled";
			// }
			
			// $("#parametriContainer").append('<ul id="pager" class="pager" style="transform: translate('+x+'px, '+y+'px); width:200px;"><li onclick="changePage('+prevDisabled+','+currentPage+',-1)" class="page-item '+prevStyle+'"><span>«</span></li><li onclick="changePage('+nextDisabled+','+currentPage+',1)" class="page-item '+nextStyle+'" style="margin-left:10px;"><span>&raquo;</span></li></ul>');
			
	 }
  
  	function renderizzaInPagina(parametri){
		var maxHTMLx = $('#the-canvas').width();
		var maxHTMLy = $('#the-canvas').height();
	
		var paramContainerWidth = $('#parametriContainer').width();
		// var yCounterOfGenerated = 0;
		// var numOfMaxItem = 26;
		// var notValidHeight = 30;
		var y = 0;
		var x = 6;
  		for (i = 0; i < parametri.length; i++) {
			var param = parametri[i];
			
			var classStyle = "drag-drop can-drop";
			var valore = param.valore;
			
			var pdfY = maxPDFy - param.posizioneY - offsetY;
			y = (pdfY * maxHTMLy) / maxPDFy;
			x = ((param.posizioneX * maxHTMLx) / maxPDFx) + paramContainerWidth;
	
			// $("#parametriContainer").append('<div class="'+classStyle+'" data-id="'+param.idParametroModulo+'" data-toggle="'+valore+'" data-valore="'+valore+'" data-x="'+x+'" data-y="'+y+'" style="transform: translate('+x+'px, '+y+'px);">  <span class="circle"></span><span class="descrizione">'+param.descrizione+' </span></div>');
			$("#parametriContainer").append('<img class="'+classStyle+'" id="'+param.descrizione+'" width="50px" height="50px" marks="'+param.descrizione+'" ondragstart="drag(event)" src="'+param.src+'" data-id="'+param.idParametroModulo+'" data-toggle="'+valore+'" data-valore="'+valore+'" data-x="'+x+'" data-y="'+y+'" style="transform: translate('+x+'px, '+y+'px);"></img>');
		}
  	}
	 
	 
	function changePage(disabled, currentPage, delta){
		// if(disabled){
		// 	return;
		// }
		var parametri = [];
		$(".drag-drop.dropped-out").each(function() {
			var valore = $(this).data("valore");
			var descrizione = $(this).find(".descrizione").text();
			parametri.push({valore:valore, descrizione:descrizione, posizioneX:-1000, posizioneY:-1000});
			$(this).remove();
		});
		$('#pager').remove();
		currentPage += delta;
		renderizzaPlaceholder(currentPage, parametri);
	}

  
//   function showCoordinates(){
//     var validi = [];
//   	  var nonValidi = [];
  	  
//   	  var maxHTMLx = $('#the-canvas').width();
//   	  var maxHTMLy = $('#the-canvas').height();
//       var paramContainerWidth = $('#parametriContainer').width();
  	  
//   	  //recupera tutti i placholder validi
//   	  $('.drag-drop.can-drop').each(function( index ) {
//   		  	var x = parseFloat($(this).data("x"));
//   		  	var y = parseFloat($(this).data("y"));
//   		  	var valore = $(this).data("valore");
//   		  	var descrizione = $(this).find(".descrizione").text();
  		    
//   		  	var pdfY = y * maxPDFy / maxHTMLy;
//   		  	var posizioneY = maxPDFy - offsetY - pdfY;	  
//   		  	var posizioneX =  (x * maxPDFx / maxHTMLx)  - paramContainerWidth;
//   		  	var val = {"descrizione": descrizione, "posizioneX":posizioneX,   "posizioneY":posizioneY, "valore":valore};
//   		  	validi.push(val);
//   	  });
    
//       if(validi.length == 0){
//          alert('No placeholder dragged into document');
//       }
//      else{
//       alert(JSON.stringify(validi));
//      }
//   }

function drag(e){
	e.dataTransfer.setData("text", e.target.id);
}

// if(jQuery('#q1::selection')){

// }

var count = 0;
var id_no = 0;
var copyimg;
var data;
var marks;
var original;
function dropcopy(ev) {
  	ev.preventDefault();
  	data = ev.dataTransfer.getData("Text");
  	copyimg = document.createElement("img");
  	original = document.getElementById(data);
  	marks = original.getAttribute("marks");
  	copyimg.src = original.src;
  	ev.target.appendChild(copyimg);
  	id_no++;
  	marks_id = "marks_" + id_no;
  	copyimg.setAttribute("id", marks_id);
  	copyimg.setAttribute("marks", marks);
  	copyimg.setAttribute("ondragstart", "drag(event)");
  	count = count + parseInt(marks);
  	document.getElementById("total").innerHTML = count;
}

function allowDrop(e) {
    e.preventDefault();
}

// $("html").on("drop", function(event){
	// event.preventDefault(); 
	// event.stopPropagation();
// 	console.log("Placed");
// 	return false;
// });

// document.getElementById('the-canvas').addEventListener('drop', function(event){console.log("Hellooo");})

// $("#the-canvas").droppable();

// function getCaretIndex(element) {
// 	let position = 0;
// 	const isSupported = typeof window.getSelection !== "undefined";
// 	if (isSupported) {
// 	  const selection = window.getSelection();
// 	  if (selection.rangeCount !== 0) {
// 		const range = window.getSelection().getRangeAt(0);
// 		const preCaretRange = range.cloneRange();
// 		preCaretRange.selectNodeContents(element);
// 		preCaretRange.setEnd(range.endContainer, range.endOffset);
// 		position = preCaretRange.toString().length;
// 	  }
// 	}
// 	return position;
//   }

//   var val = 0;
// for(var i = 1;i < 7;i++){
function ques(e,i){
	var part_count = 0;
	e.preventDefault();
	$('.flex-item[data-select ="true"').removeAttr("data-select");
	$('#q'+i).attr("data-select",'true');
	$('#the-canvas').on("drop", function(){
		$.ajax({
			url:window.location.pathname,
			type: 'GET',
			success: function(){
				if(typeof $('#q'+i).attr("data-select") != 'undefined'){
				  	// copyimg.setAttribute("ondragstart", "drag(event)");
				  	part_count = part_count + parseInt(marks);
					// $("#q"+i).on('click',function(i){
					// $("#q"+i).attr('clicked', true);
					$("#m-"+i).text(part_count);
				}
			},
			error: function(error){
				console.log('error');
			}
		});
	});
		// });
}
// }