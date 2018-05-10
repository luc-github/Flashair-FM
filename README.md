# FlashAir Web File Manager
It is based on available code :  https://flashair-developers.com/en/documents/tutorials/advanced/2/     
please have also a check to : https://flashair-developers.com/en/documents/api/

# UI
<img src=https://github.com/luc-github/Flashair-FM/blob/devt/Images/NewUI.jpg?raw=true>
UI use a customized version of <a href='http://getbootstrap.com' target='_blank'>bootstrap</a> including a local limited version of svg version of<a href='http://glyphicons.com/' target='_blank'> Glyphicons Halflings</a> to get a small footprint.   

# Feature
It allows to browse, upload and delete files on SD Card and to know the current capacity of the Card

# Configuration
1 - Backup the content of SD_WLAN of your SD Card - just in case
2 - Add/Replace the content of SD_WLAN by the one of github   
3 - Edit the CONFIG based on your network - I have prepared CONFIG-SAMPLE, it joins existing network - just need to complete SSID/Password and Name    
```
   APPMODE=5   
   APPSSID=<Your-SSID>   
   APPNETWORKKEY=<Your-Password>   
   APPNAME=<YourName>  
```
For more information please check : https://flashair-developers.com/en/documents/api/config/

4 - you can edit the List.htm to change the description
```
  <script>var web_ui_title="File Manager for Flashair";</script>
```
 
5 - Unplug and replug card to refresh settings

# Source modification

To be able to generate file from sources you need to install nodejs, gulp and some addons.    
1 - Install current nodejs   
2 - Install gulp-cli globaly npm install --global gulp-cli   
3 - Then go the repository ESP3D-webUI and install gulp and all necessary addons:   

npm install --global gulp-cli   
npm install --save-dev gulp-jshint   
npm install --save-dev jshint   
npm install --save-dev gulp-if   
npm install --save-dev gulp-concat  
npm install --save-dev gulp-uglify  
npm install --save-dev gulp-clean-css   
npm install --save-dev gulp-remove-code   
npm install --save-dev del   
npm install --save-dev gulp-zip   
npm install --save-dev gulp-gzip   
npm install --save-dev gulp-htmlmin   
npm install --save-dev gulp-replace   
npm install --save-dev gulp-smoosher   

4 - Do the code modification you want, then launch gulp package.   

# Not yet implemented
Translation engine is there but no translation is done yet
