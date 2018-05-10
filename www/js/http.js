var http_communication_locked = false;
var http_cmd_list = [];
var processing_cmd = false;

var max_cmd = 20;

function clear_cmd_list(){
	http_cmd_list = [];
	processing_cmd = false;
}

function http_resultfn(response_text){
	if ((http_cmd_list.length > 0) && (typeof http_cmd_list[0].resultfn != 'undefined' ))
		{
			var fn =  http_cmd_list[0].resultfn;
		fn(response_text);
		} 
	http_cmd_list.shift();
	processing_cmd = false;
}
function http_errorfn(errorcode, response_text){
	if ((http_cmd_list.length > 0) && (typeof http_cmd_list[0].errorfn != 'undefined' )) 
		{
		var fn = http_cmd_list[0].errorfn;
		fn(errorcode, response_text);
		} 
	http_cmd_list.shift();
	processing_cmd = false;
}

function process_cmd(){
	if ((http_cmd_list.length > 0) && (!processing_cmd)) {
		if (http_cmd_list[0].type == "GET") {			
			processing_cmd = true;
			ProcessGetHttp(http_cmd_list[0].cmd, http_resultfn, http_errorfn);
		} else if (http_cmd_list[0].type == "POST") {
			processing_cmd = true;
			if (!(http_cmd_list[0].isupload)) {
				ProcessPostHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, http_resultfn, http_errorfn);
			} else {
				ProcessFileHttp(http_cmd_list[0].cmd, http_cmd_list[0].data, http_cmd_list[0].progressfn, http_resultfn, http_errorfn);
			}
		} else if (http_cmd_list[0].type == "CMD"){
			var fn = http_cmd_list[0].cmd;
			fn();
			http_cmd_list.shift();
		}
		
	} 
}

function AddCmd(cmd_fn, id){
	if (http_cmd_list.length > max_cmd){
		return;
	}
	var cmd_id = 0;
	var cmd  = {cmd:cmd_fn,type:"CMD", id:cmd_id};
	http_cmd_list.push(cmd);
}

function SendGetHttp(url, result_fn, error_fn, id, max_id){
	if ((http_cmd_list.length > max_cmd) && (max_cmd != -1)){
		error_fn();
		return;
	}
	var cmd_id = 0;
	var cmd_max_id = 1;
	if (typeof id != 'undefined') {
		cmd_id = id;
		if (typeof max_id != 'undefined')  cmd_max_id= max_id;
		for (p=0; p < http_cmd_list.length;p++){	
			if (http_cmd_list[p].id == cmd_id){
				cmd_max_id--;
			}
			if (cmd_max_id <= 0) {
				return;
				}
		}
	}
	var cmd  = {cmd:url,type:"GET", isupload:false, resultfn:result_fn, errorfn:error_fn, id:cmd_id};
	http_cmd_list.push(cmd);
}

	
function ProcessGetHttp(url, resultfn, errorfn){
    if (http_communication_locked) {
        errorfn(503, translate_text_item("Communication locked!"));
        return;
        }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200 )
                {
                    if (typeof resultfn != 'undefined' && resultfn != null )resultfn(xmlhttp.responseText);
                }
            else {
                    if (xmlhttp.status == 401)GetIdentificationStatus();
                    if (typeof errorfn != 'undefined' && errorfn != null )errorfn(xmlhttp.status, xmlhttp.responseText);
            }
        }
    }
    
    console.log(url);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function SendPostHttp(url, postdata,result_fn, error_fn, id, max_id){
	if ((http_cmd_list.length > max_cmd) && (max_cmd != -1)){
		error_fn();
		return;
	}
	var cmd_id = 0;
	var cmd_max_id = 1;
	if (typeof id != 'undefined') {
		cmd_id = id;
		if (typeof max_id != 'undefined')  cmd_max_id= max_id;
		for (p=0; p < http_cmd_list.length;p++){
			if (http_cmd_list[p].id == cmd_id)cmd_max_id--;
			if (cmd_max_id <= 0) return;
		}
	}
	var cmd  = {cmd:url,type:"POST",isupload:false, data:postdata, resultfn:result_fn, errorfn:error_fn, initfn:init_fn, id:cmd_id};
	http_cmd_list.push(cmd);
}

function ProcessPostHttp(url, postdata,resultfn, errorfn){
    if (http_communication_locked) {
        errorfn(503, translate_text_item("Communication locked!"));
        return;
        }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200 )
                {
                    if (typeof resultfn != 'undefined' && resultfn != null )resultfn(xmlhttp.responseText);
                }
            else {
                    if (xmlhttp.status == 401)GetIdentificationStatus();
                    if (typeof errorfn != 'undefined' && errorfn != null)errorfn(xmlhttp.status, xmlhttp.responseText);
            }
        }
    }
    //console.log(url);
    xmlhttp.open("POST", url, true);
    xmlhttp.send(postdata);
}

function SendFileHttp(url, postdata, progress_fn,result_fn, error_fn){
	if ((http_cmd_list.length > max_cmd) && (max_cmd != -1)){
		error_fn();
		return;
	}
	if (http_cmd_list.length != 0)  process = false;
	var cmd  = {cmd:url,type:"POST",isupload:true, data:postdata, progressfn: progress_fn, resultfn:result_fn, errorfn:error_fn, id:0};
	http_cmd_list.push(cmd);
}

function ProcessGetCrossHttp(url, resultfn, errorfn){

var xdr = new XMLHttpRequest(); 

xdr.onload = function() {
	alert(xdr.responseText);
}

xdr.open("GET", url);
xdr.send();

}

function ProcessFileHttp(url, postdata, progressfn,resultfn, errorfn){
    if (http_communication_locked) {
        errorfn(503, translate_text_item("Communication locked!"));
        return;
        }
    http_communication_locked = true;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            http_communication_locked = false;
            if (xmlhttp.status == 200 )
                {
                    if (typeof resultfn != 'undefined' && resultfn != null )resultfn(xmlhttp.responseText);
                }
            else {
                    if (xmlhttp.status == 401)GetIdentificationStatus();
                    if (typeof errorfn != 'undefined' && errorfn != null)errorfn(xmlhttp.status, xmlhttp.responseText);
            }
        }
    }
    //console.log(url);
    xmlhttp.open("POST", url, true);
    if (typeof progressfn !='undefined' && progressfn != null)xmlhttp.upload.addEventListener("progress", progressfn, false);
    xmlhttp.send(postdata);
}


