var files_currentPath = "/";
var files_filter_sd_list = false;
var files_file_list = [];
var files_file_list_cache = [];
var files_status_list = [];
var files_current_file_index = -1;
var files_error_status ="";
var show_sd_wlan = false;

function toogle_show_SD_WLAN(state){
show_sd_wlan = !show_sd_wlan;
if (typeof state != 'undefined')show_sd_wlan=state;
if (show_sd_wlan) {
     document.getElementById('show_sd_wlan_icon').innerHTML =  get_icon_svg("ok", "1.3em","1.2em");
} else document.getElementById('show_sd_wlan_icon').innerHTML ="";
if (files_currentPath.startsWith ( "/SD_WLAN") ||  (files_currentPath=="/")) files_refreshFiles("/");
}

function init_files_panel(){
    document.getElementById('files_createdir_btn').style.display="none";
    document.getElementById('files_refresh_btn').style.display="none";
}

function navbar(){
    var content="<table><tr>";
    var currentpath = files_currentPath;
    if (!currentpath.endsWith("/"))currentpath+="/";
    var tlist = currentpath.split("/");
    var path="/";
    var nb = 1;
    content+="<td><button class='btn btn-primary'  onclick='files_refreshFiles(\"" + path +"\");'>/</button></td>";
    while (nb < (tlist.length-1))
        {
            if (!path.endsWith("/"))path+="/";
            path+=tlist[nb];
            content+="<td><button class='btn btn-link' onclick='files_refreshFiles(\"" + path +"\");'>"+tlist[nb] +"</button></td><td>/</td>";
            nb++;
        }
        content+="</tr></table>";
    return content;
}

function files_set_button_as_filter(isfilter){
    if (!isfilter){
        document.getElementById('files_filter_glyph').innerHTML=get_icon_svg("filter", "1.3em","1.2em");
    } else {
    document.getElementById('files_filter_glyph').innerHTML=get_icon_svg("list-alt","1.2em","1.2em");
    }
}

function files_filter_button(item){
    files_filter_sd_list = !files_filter_sd_list;
    files_set_button_as_filter(files_filter_sd_list);
    files_build_display_filelist();
}

function files_build_file_line(index){
    var content = "";
    var entry = files_file_list[index];
    var is_clickable = files_is_clickable(index);
    if ((files_filter_sd_list && entry.isprintable) || (!files_filter_sd_list)){
        content +="<li class='list-group-item list-group-hover' >";
        content +="<div class='row'>";
        content +="<div class='col-md-1 col-sm-1' ";
         if (is_clickable){
            content +="style='cursor:pointer;' onclick='files_click_file(" + index + ")'";
        }
         content +="><span  style='color:DeepSkyBlue;'>"; 
        if (entry.isdir == true) content +=get_icon_svg("folder-open")  ;
        else content +=get_icon_svg("file");
        content +="</span ></div>";
        content +="<div class='col-md-4 col-sm-4' ";
        if (is_clickable){
            content +="style='cursor:pointer;' onclick='files_click_file(" + index + ")' ";
        }
        content +=">" + entry.name + "</div>";
        content +="<div class='col-md-2 col-sm-2'";
        if (is_clickable){
            content +="style='cursor:pointer;' onclick='files_click_file(" + index + ")' ";
        }
        content +=">";
        if (entry.isdir != true)content += entry.size;
        content +="</div>";
        content +="<div class='col-md-3 col-sm-3'";
         if (is_clickable){
            content +="style='cursor:pointer;' onclick='files_click_file(" + index + ")' ";
        }
        content +=">"+ entry.datetime+"</div>";
        content +="<div class='col-md-2 col-sm-2'>";
        content +="<div class='pull-right'>";
        if (files_showdeletebutton(index)){
            content +="<button class='btn btn-xs btn-danger' onclick='files_delete(" + index + ")'  style='padding-bottom: 2px;'>" + get_icon_svg("trash","1em","1em") + "</button>";
        }
        content +="</div>";
        content +="</div>";
        content +="</div>";
        content +="</li>";
    }
    return content;
}


function files_Createdir(){
    inputdlg(translate_text_item("Please enter directory name"), translate_text_item("Name:"), process_files_Createdir);
}

function process_files_Createdir(answer){
    if (answer.length > 0) files_create_dir(answer.trim());
}

function gettimestamp(){
    var timestring;
    var dt = new Date();
    var year = (dt.getFullYear() - 1980) << 9;
    var month = (dt.getMonth() + 1) << 5;
    var date = dt.getDate();
    var hours = dt.getHours() << 11;
    var minites = dt.getMinutes() << 5;
    var seconds = Math.floor(dt.getSeconds() / 2);
    timestring = "0x" + (year + month + date).toString(16) + (hours + minites + seconds).toString(16);
    return timestring;
}

function files_create_dir(name){
    var currentpath = files_currentPath;
    var timestring = gettimestamp();
    if (!currentpath.endsWith("/"))currentpath+="/";
    currentpath+=name;
    currentpath.trim();
    //time need to be set first or first operation won't have it 
    var url = "/upload.cgi?FTIME=" + timestring ;
    console.log(url);
    files_error_status = "Create " + name;
    SendGetHttp(url);
    var url = "/upload.cgi?UPDIR="+currentpath;
    files_error_status = "Create " + name;
    SendGetHttp(url, file_operation_success, file_operation_fail);
}

function files_delete(index){
    files_current_file_index = index;
    var msg = translate_text_item("Confirm deletion of directory: ");
    if (!files_file_list[index].isdir)msg = translate_text_item("Confirm deletion of file: ");
    confirmdlg(translate_text_item("Please Confirm"), msg + files_file_list[index].name, process_files_Delete);
}

function process_files_Delete(answer){
     if (answer == "yes" && files_current_file_index != -1)files_delete_file(files_current_file_index);
     files_current_file_index = -1;
}

function files_delete_file(index){
    if (!files_currentPath.endsWith("/"))files_currentPath+="/";
    var entry = files_file_list[index];    
    var path = files_currentPath + entry.name ;
    var url = "/upload.cgi?DEL="+path;
    console.log(url);
    files_error_status = "Delete " + entry.name;
    SendGetHttp(url, file_operation_success, file_operation_fail);
}

function file_operation_fail(error, response){
    files_error_status+= " failed";
    document.getElementById('files_sd_status_msg').innerHTML = files_error_status;
}

function file_operation_success(response){
    console.log(response);
    if ((response == "SUCCESS") || (response.indexOf("Success") != 1)) {
        files_error_status+= " done";
    }
    else  files_error_status+= " failed";
    console.log(files_error_status);
    if ((response == "SUCCESS") || (response.indexOf("Success") != 1)) files_refreshFiles(files_currentPath);
}

function files_proccess_and_update(answer){
    console.log(answer);
    files_refreshFiles(files_currentPath);
}

function files_is_clickable(index){
    return true;
}

function files_click_file(index){
    if (!files_currentPath.endsWith("/"))files_currentPath+="/";
    var entry = files_file_list[index];    
    if ( entry.isdir) {
        var path = files_currentPath + entry.name ;
         files_refreshFiles(path, true);
        return;
    }
    url = files_currentPath
    if (url.endsWith("/"))url += "/";
    url += entry.name;
    console.log(url);
    window.open(url.replace("//", "/"));
}

function files_showdeletebutton(index){
    var path = files_currentPath;
    var entry = files_file_list[index]; 
     if (!path.endsWith("/"))path+="/";
     path+= entry.name;
     path.toUpperCase();
     if ((path == "/SD_WLAN") || (path == "/SD_WLAN/CONFIG")|| (path== "/SD_WLAN/LIST.HTM")) return false;
   return true;
}

function files_refreshFiles(path, usecache){
    
    var cmdpath = path; 
    if (cmdpath.endsWith("/") && cmdpath.length > 1) {
         files_currentPath  = cmdpath.substring(0,cmdpath.length-1);
         cmdpath  = files_currentPath;
    }
    files_currentPath = cmdpath;
    if (typeof usecache === 'undefined') usecache = false;
    files_file_list = [];
    files_status_list = [];
    files_build_display_filelist(false);
    document.getElementById('files_list_loader').style.display="block";
    document.getElementById('files_nav_loader').style.display="block";
    var url = "/command.cgi?op=100&DIR=" + encodeURI(cmdpath);
    SendGetHttp(url, files_list_success, files_list_failed);
}

function files_format_size(size){
    var lsize = parseInt(size);
    var value=0.0;
    var tsize="";
    if (lsize < 1024) {
        tsize = lsize +" B";
    } else if(lsize < (1024 * 1024)) {
        value = (lsize/1024.0);
        tsize = value.toFixed(2) +" KB";
    } else if(lsize < (1024 * 1024 * 1024)) {
        value = ((lsize/1024.0)/1024.0);
        tsize = value.toFixed(2) +" MB";
    } else {
        value = (((lsize/1024.0)/1024.0)/1024.0);
        tsize = value.toFixed(2) +" GB";
    }
    return tsize;
}

function files_is_filename (file_name) {
    var answer = true;
    var s_name = String(file_name);
    var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    var rg2=/^\./; // cannot start with dot (.)
    var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
    //a 
    answer = rg1.test(file_name)&&!rg2.test(file_name)&&!rg3.test(file_name)
    if ((s_name.length == 0) || (s_name.indexOf(":") != -1) || (s_name.indexOf("..") != -1)) answer = false;
    
    return answer;
}

function files_canbeprinted(filename, isdir){
    if (isdir == true) return false;
    if (filename.toLowerCase().match(/\.g(code)?$/) || filename.toLowerCase().match(/\.gco(de)?$/)) return true;
    return false;
}

function files_list_success(response_text){
    var tlist = response_text.split("\n");
    for (var i=0; i < tlist.length; i++){
        var line = tlist[i].trim();
        var isdirectory = false;
        var file_name="";
        var pathv = "";
        var fsize="";
        var datev =0;
        var timev =0;
        var attribv = 0;
        if (line == "WLANSD_FILELIST") continue;
        if (line.length != 0){ 
            var data =  line.split(",");
            if (data.length == 6){
                if (data[0].length == 0) pathv = "/";
                else pathv = data[0];
                file_name  = data[1];
                fsize =  files_format_size(parseInt(data[2]));
                attribv = parseInt(data[3]);
                if (attribv & 0x10) isdirectory = true;
                else isdirectory = false;
                datev = parseInt(data[4]);
                var filedate = ((datev & 0x1e0) >> 5).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + '/' +
                        (datev & 0x1f).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + '/' +
                       (((datev & 0xfe00) >>> 9) + 1980).toString();
                timev = parseInt(data[5]);
                var filetime = ((timev & 0xf800) >>> 11).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + ':' + 
                       ((timev & 0x7c0) >> 5).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false}) + ':' + 
                       ((timev & 0x1f) * 2).toLocaleString('en-US', {minimumIntegerDigits:2, useGrouping:false});
                var d = filedate + " " + filetime;
                var isprint = files_canbeprinted(file_name,isdirectory);
                if (files_is_filename (file_name)) {
                var file_entry = {path: pathv, name:file_name, size: fsize, isdir: isdirectory, datetime: d,isprintable:isprint};
                files_file_list.push(file_entry);
                }
            }
        }
    }
    if ((files_currentPath == "/") && (show_sd_wlan)) {
            var file_entry = {path: "/", name:"SD_WLAN", size: "-1", isdir: true, datetime: "",isprintable:false};
            files_file_list.push(file_entry);  
    }
    files_build_display_filelist();
}

function files_list_failed(error_code, response){
     document.getElementById('files_navigation_buttons').style.display="block";
    alertdlg (translate_text_item("Error"), "Error " + error_code + " : " + response);
    files_build_display_filelist(false);
}

function need_up_level(){
    if(files_currentPath=="/") return false;
    return true;
}

function files_go_levelup(){
    var tlist = files_currentPath.split("/");
    var path="/";
    var nb = 1;
    while (nb < (tlist.length-1)){
        if(!path.endsWith("/"))path+="/";
        path+=tlist[nb] ;
        console.log("build parent path " + path);
        nb++;
    }
    files_refreshFiles(path, true);
}

function files_build_display_filelist(displaylist){
    var content = "";
    document.getElementById('files_uploading_msg').style.display="none";
    if (typeof displaylist == 'undefined')displaylist = true;
    document.getElementById('files_list_loader').style.display="none";
    document.getElementById('files_nav_loader').style.display="none";
    document.getElementById('files_refresh_btn').style.display="inline";
    document.getElementById('files_createdir_btn').style.display="inline";
    document.getElementById('upload_btn').style.display="inline";
    document.getElementById('files_navigation_buttons').style.display="block";
    if (!displaylist){
        document.getElementById('files_fileList').innerHTML= "";
        document.getElementById('files_fileList').style.display= "none";
        return;
    }
    if (need_up_level()){
        content +="<li class='list-group-item list-group-hover' style='cursor:pointer' onclick='files_go_levelup()''>";
        content +="<span >"+ get_icon_svg("level-up") + "</span>&nbsp;&nbsp;<span translate>Up...</span>";
        content +="</li>";
    }
    files_file_list.sort(function(a, b) { return compareStrings(a.name, b.name);});
    for(var index=0; index < files_file_list.length; index++){
        if (files_file_list[index].isdir == false)content +=  files_build_file_line(index);
    }
    for( index=0; index < files_file_list.length; index++){
        if (files_file_list[index].isdir )content +=  files_build_file_line(index);
    }
    document.getElementById('files_fileList').style.display= "block";
    document.getElementById('files_fileList').innerHTML=content;
    
    document.getElementById('navigationbar').innerHTML=navbar();
    document.getElementById('files_sd_status_msg').innerHTML = files_error_status;
    update_sd_space();
}

function update_sd_space(){
    var url = "/command.cgi?op=140";
    SendGetHttp(url, sd_space_success, sd_space_error);
}

function sd_space_success(response){
    var t1 = response.split(",");
    if (t1.length != 2) {
        sd_space_error(0, "Invalid data");
        return;
    }
    var t2 = t1[0].split("/");
     if (t2.length != 2) {
        sd_space_error(0, "Invalid data");
        return;
    }
    var totalfree = Number(t2[0]) * Number(t1[1]);
    var totalcard = Number(t2[1]) * Number(t1[1]);
     document.getElementById('files_sd_status_total').innerHTML = files_format_size(totalcard);
     document.getElementById('files_sd_status_used').innerHTML = files_format_size(totalcard-totalfree);
     var o = 100 * (totalcard-totalfree) / (1.0 * totalfree);
     if (o < 1) o=1;
     document.getElementById('files_sd_status_occupation').value = o ;
     document.getElementById('files_sd_status_percent').innerHTML = o.toFixed(0);
    document.getElementById('files_space_sd_status').style.display="table-row";
}

function sd_space_error(error, response_text){
    console.log("error");
    document.getElementById('files_space_sd_status').style.display="none";
}

function files_select_upload(){
    document.getElementById('files_input_file').click();
}

function files_check_if_upload(){
    console.log("Set time");
    var timestring = gettimestamp();
    var url = "/upload.cgi?UPDIR="+files_currentPath;
    SendGetHttp(url)
    //time need to be set first or first operation won't have it 
    url = "/upload.cgi?FTIME=" + timestring ;
    files_error_status = "Create " + name;
    SendGetHttp(url,files_start_upload, cannot_upload );
}

function cannot_upload(error, answer){
             alertdlg (translate_text_item("Upload failed"), translate_text_item("No SD card detected"));
             files_error_status ="No SD card"
             files_build_display_filelist(false);
}

function files_start_upload(response){
    console.log(response);
    var url = "/upload.cgi";
    var path = files_currentPath;
    var files = document.getElementById("files_input_file").files;
    if (!path.endsWith("/"))path+="/";
    if (files.value == "" || typeof files[0].name === 'undefined') {
        console.log("nothing to upload");
        return;
    }
    console.log("start upload");
    var formData = new FormData();
     for (var i = 0; i < files.length; i++) {
         var file = files[i];
         formData.append('myfile[]', file, path + file.name);
         console.log( path +file.name);
         }
     files_error_status = "Upload " +file.name;
     document.getElementById('files_currentUpload_msg').innerHTML =  file.name; 
     document.getElementById('files_uploading_msg').style.display="block";
     document.getElementById('files_navigation_buttons').style.display="none";
     SendFileHttp(url, formData, FilesUploadProgressDisplay, file_operation_success, file_operation_fail);
     document.getElementById("files_input_file").value="";
}


function FilesUploadProgressDisplay(oEvent){
    if (oEvent.lengthComputable) {
        var percentComplete = (oEvent.loaded / oEvent.total)*100;
        document.getElementById('files_prg').value=percentComplete;
        document.getElementById('files_percent_upload').innerHTML = percentComplete.toFixed(0);
      } else {
        // Impossible because size is unknown
      }
}
