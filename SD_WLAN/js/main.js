/**
 *  main.js
 *
 *  Created by Junichi Kitano, Fixstars Corporation on 2013/05/15.
 * 
 *  Copyright (c) 2013, TOSHIBA CORPORATION
 *  All rights reserved.
 *  Released under the BSD 2-Clause license.
 *   http://flashair-developers.com/documents/license.html
 */
// JavaScript Document

// Judge the card is V1 or V2.
function isV1(wlansd) {
	if ( wlansd.length == undefined || wlansd.length == 0 ) {
		// List is empty so the card version is not detectable. Assumes as V2.
		return false;
	} else if ( wlansd[0].length != undefined ) {
		// Each row in the list is array. V1.
		return true;
	} else {
		// Otherwise V2.
		return false;
	}
}
// Convert data format from V1 to V2.
function convertFileList() {
	for (var i = 0; i < wlansd.length; i++) {
		var elements = wlansd[i].split(",");
		wlansd[i] = new Array();
		wlansd[i]["r_uri"] = elements[0];
		wlansd[i]["fname"] = elements[1];
		wlansd[i]["fsize"] = Number(elements[2]);
		wlansd[i]["attr"]  = Number(elements[3]);
		wlansd[i]["fdate"] = Number(elements[4]);
		wlansd[i]["ftime"] = Number(elements[5]);
	}
}
// Callback Function for sort()
function cmptime(a, b) {
    if( a["fdate"] == b["fdate"] ) {
        return a["ftime"] - b["ftime"];
    }else{
        return a["fdate"] - b["fdate"];
    }
}
// Show file list
function showFileList(path) {
	// Clear box.
	Capacity();
	$("#list").html('');
    // Output a link to the parent directory if it is not the root directory.
    if( path != "/" ) {
        $("#list").append(
            $("<div></div>").append(
                $('<a href="javascript:void(0)" class="dir"><img src=/SD_WLAN/images/return.png width=15>..</a>')
            )
        );
    }
    
    $.each(wlansd, function() {
		var file = this;
		// Skip hidden file.
		//if ( file["attr"] & 0x02 ) {
		//	return;
		//}
		// Make a link to directories .
		var filelink = $('<a href="javascript:void(0)"></a>');
		var caption = file["fname"] ;
		var fileicon = '<img src=/SD_WLAN/images/file.png width=15>';
		var fileobj = $("<div></div>");
		var item='';
        if ( file["attr"] & 0x10 ) {
            filelink.addClass("dir");
			fileicon = '<img src=/SD_WLAN/images/dir.png  width=15>';
			item = filelink.append(fileicon + caption  );
        } 
		// Append a directory to the end of the list.
        $("#list").append(
            fileobj.append(
				item
				
			)
        );
    });    
//display the  files
    $.each(wlansd, function() {
		var file = this;
		// Skip hidden file.
		if ( file["attr"] & 0x02 ) {
			return;
		}
		// Make a link to directories and files.
		var filelink = $('<a href="javascript:void(0)"></a>');
		var filedel = '';
		var caption = file["fname"] ;
		var fileicon = '<img src=/SD_WLAN/images/file.png width=15>';
		var filedownload='';
		var fileobj = $("<div></div>");
		var filesize = file["fsize"];
		var filesizeunit='Oct';
		var filedate = ((file["fdate"] & 0x1e0) >> 5).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + '/' +
						(file["fdate"] & 0x1f).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + '/' +
					   (((file["fdate"] & 0xfe00) >>> 9) + 1980).toString();
		var filetime = ((file["ftime"] & 0xf800) >>> 11).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + ':' + 
					   ((file["ftime"] & 0x7c0) >> 5).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + ':' + 
					   ((file["ftime"] & 0x1f) * 2).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false});
		var item='';
        if ( ! (file["attr"] & 0x10) ) {
            filelink.addClass("file").attr('href', file["r_uri"] + '/' + file["fname"]).attr("target","_blank");
			filedel='<img src=/SD_WLAN/images/del.png width=15 style=\'cursor:pointer;\' onclick=\'DeleteFile(\"'+file["r_uri"] + '/'+file["fname"]+'\");\';>';
			filedownload='<img src=/SD_WLAN/images/download.png  width=15 style=\'cursor:pointer;\' onClick=\'window.open(\"'+file["r_uri"] + '/' + file["fname"]+'\");\' >';
			if (filesize>1024){
			filesize =  Number(file["fsize"] / 1024).toFixed(2);
			filesizeunit='Ko';
			}
			if (filesize>1024){
			filesize =  Number(filesize / 1024).toFixed(2);
			filesizeunit='Mo';
			}
			if (filesize>1024){
			filesize =  Number(filesize / 1024).toFixed(2);
			filesizeunit='G0';
			}
			item = fileicon + caption +'&nbsp;' + filesize + filesizeunit+'&nbsp;'+filedate+'&nbsp;'+filetime+'&nbsp;'+filedownload +'&nbsp;'+ filedel ;
        }
		// Append a file entry or directory to the end of the list.
        $("#list").append(
            fileobj.append(
				item
				
			)
        );
    });    
    
    
     
}
//Making Path
function makePath(dir) {
	var arrPath = currentPath.split('/');
	if ( currentPath == "/" ) {
		arrPath.pop();
	}
    if ( dir == ".." ) {
		// Go to parent directory. Remove last fragment.
        arrPath.pop();
    } else if ( dir != "" && dir != "." ) {
		// Go to child directory. Append dir to the current path.
		arrPath.push(dir);
    }
	if ( arrPath.length == 1 ) {
		arrPath.push("");
	}
    return arrPath.join("/");
}
// Get file list
function getFileList(dir) {
    
	// Make a path to show next.
	var nextPath = makePath(dir);
	// Make URL for CGI. (DIR must not end with '/' except if it is the root.)
    var url = "/command.cgi?op=100&DIR=" + nextPath;
	// Issue CGI command.
    $.get(url, function(data) {
       // Save the current path.
        currentPath = nextPath;
        // Split lines by new line characters.
        wlansd = data.split(/\n/g);
        // Ignore the first line (title) and last line (blank).
        wlansd.shift();
        wlansd.pop();
		// Convert to V2 format.
		convertFileList(wlansd);
		// Sort by date and time.
        wlansd.sort(cmptime);
		
		// Show
		showFileList(currentPath);
		
	});
}
//UploadProcess
function doUpload() {
	var path = makePath(".");
	var cgi = "/upload.cgi";
	var timestring;
	var dt = new Date();
	var year = (dt.getFullYear() - 1980) << 9;
	var month = (dt.getMonth() + 1) << 5;
	var date = dt.getDate();
	var hours = dt.getHours() << 11;
	var minites = dt.getMinutes() << 5;
	var seconds = Math.floor(dt.getSeconds() / 2);
	timestring = "0x" + (year + month + date).toString(16) + (hours + minites + seconds).toString(16);	
	$.get(cgi + "?WRITEPROTECT=ON&UPDIR=" + path + "&FTIME=" + timestring, function() {
		var uploadFile = $('#file')[0].files[0];
		var fd = new FormData();
		fd.append("file", uploadFile);
		$.ajax({ url: cgi,
			type: "POST",
			data: fd,
			beforeSend: function() {
            $("#message1").show().html("Uploading...");
        },
			processData: false,
			contentType: false,
			cache: false,
			success: function(html){
				if ( html.indexOf("SUCCESS") ) {
					alert("success");
					getFileList(".");
				}else{
					alert("error");
				}
				$("#message1").html("").fadeOut(5000);
				$('#upload').html('<input type=\"file\" id=\'file\' name=\'file\'><br>');
				
			}
		});		
	});
	
	return False;
}
function Capacity() {
	var url = "/command.cgi?op=140";
	var capacitystring='None';
	$.get(url, function(capa) {
          Tcapacitystring = capa.split("/") ;
		  snotused = Tcapacitystring[0] ;
		  Tcapacitystring2=Tcapacitystring[1].split(",");
		  nbtotal = Tcapacitystring2[0];
		  bpersec = Tcapacitystring2[1];
		  totalfree = Number(snotused) * Number(bpersec);
		  totalcard = Number(nbtotal) * Number(bpersec);
		  percentused = Number(totalfree/totalfree).toFixed(2);
		  unitfree='Oct';
		  unitTotal='Oct';
		  if (totalfree>1024){
			totalfree =  Number(totalfree / 1024).toFixed(2);
			unitfree='Ko';
			}
		  if (totalfree>1024){
			totalfree =  Number(totalfree / 1024).toFixed(2);
			unitfree='Mo';
			}
		  if (totalfree>1024){
			totalfree =  Number(totalfree / 1024).toFixed(2);
			unitfree='Go';
			}
		  if (totalcard>1024){
			totalcard =  Number(totalcard / 1024).toFixed(2);
			unitTotal='Ko';
			}
		  if (totalcard>1024){
			totalcard =  Number(totalcard / 1024).toFixed(2);
			unitTotal='Mo';
			}
		  if (totalcard>1024){
			totalcard =  Number(totalcard / 1024).toFixed(2);
			unitTotal='Go';
			}
		$("#Capacity").html('SDCard Free : '+ totalfree + unitfree + "/" + totalcard + unitTotal + ", Used : "+ percentused + "%");
	});
	//capacitystring = sresult;
	
	return false;
}
function DeleteFile(filename) {
		var cgi = "/upload.cgi";
		if(confirm('Delete File : '+ filename + '?'))
		{
		$.get(cgi + "?DEL=" + filename , function(html) {
				html2="*"+html+"*";
				if ( html2.indexOf("SUCCESS") ) {
					alert("success");
					getFileList(".");
				}else{
					alert("error");
					getFileList(".");
				}
			});
		};		
	return false;
}
//Document Ready
$(function() {
    // Iniialize global variables.
    currentPath = location.pathname;
	wlansd = new Array();
	// Show the root directory.
    getFileList('');
    // Register onClick handler for <a class="dir">
    $(document).on("click","a.dir",function() {
        getFileList(this.text);
    }); 
    $("#cmdUpload").click(function(e) {
        doUpload();
    	return false;
    });
});

