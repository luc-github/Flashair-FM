window.onload = function() {

    console.log("init cmd processor");
    setInterval(function(){ process_cmd(); }, 100);
    document.getElementById("UI_VERSION").innerHTML=web_ui_version;
    document.getElementById("UI_TITLE").innerHTML=web_ui_title;
    toogle_show_SD_WLAN(false);
    build_language_menu();
     initUI();
};

function build_language_menu(){
var content ="";
for (var lang_i =0 ; lang_i < language_list.length; lang_i++){
    content+="<a href='#' onclick=\"translate_text('";
    content+= language_list[lang_i][0];
    content+= "');\"><span >";
    content+= language_list[lang_i][1];
    content+= "</span><span class=\"clearfix\"></span></a>";
    if ( language_list[lang_i][0] == language){
        document.getElementById("translate_menu").innerHTML=language_list[lang_i][1];
        }
}
document.getElementById("lang_menu").innerHTML=content;
}

function initUI() {
    init_files_panel();
}


function compareStrings(a, b) {
  // case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();
  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function compareInts(a, b) {
  return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function HTMLEncode(str){
  var i = str.length,
      aRet = [];

  while (i--) {
    var iC = str[i].charCodeAt();
    if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
        if(iC==65533) iC=176;
        aRet[i] = '&#'+iC+';';
    } else {
      aRet[i] = str[i];
    }
   }
  return aRet.join('');    
}

function decode_entitie(str_text) {
var tmpelement = document.createElement('div');
tmpelement.innerHTML = str_text;
str_text = tmpelement.textContent;
tmpelement.textContent = '';
return str_text;
}
