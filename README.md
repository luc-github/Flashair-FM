# FlashAir Web File Manager
It is based on available code :  https://flashair-developers.com/en/documents/tutorials/advanced/2/     
please have also a check to : https://flashair-developers.com/en/documents/api/

# UI
<img src="https://github.com/luc-github/Flashair-FM/blob/devt/Images/NewUI.jpg?raw=true" >   
Use same base as https://github.com/luc-github/ESP3D-WEBUI    
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
1 - Install current [nodejs LTS](https://nodejs.org/en/download/)   (v10.14.0)    
2 - Install gulp-cli globaly `npm install --global gulp-cli`   
3 - Install gulp globaly `npm install --global gulp@4.0.0`   
4 - Install all addons `npm install`  

You should have something like this : 
```
E:\github\Flashair-FM>node -v
v10.14.0

E:\github\Flashair-FM>gulp -v
[22:17:03] CLI version 2.0.1
[22:17:03] Local version 4.0.0

E:\github\Flashair-FM>npm -v
6.4.1
```
4 - Do the code modification you want, then launch `gulp package`.   
```
E:\github\Flashair-FM>gulp package
[15:17:13] Using gulpfile E:\github\Flashair-FM\gulpfile.js
[15:17:13] Starting 'package'...
[15:17:13] Starting 'clean'...
[15:17:13] Finished 'clean' after 5.6 ms
[15:17:13] Starting 'lint'...
[15:17:13] Finished 'lint' after 144 ms
[15:17:13] Starting 'Copy'...
[15:17:13] Finished 'Copy' after 21 ms
[15:17:13] Starting 'concatApp'...
[15:17:14] Finished 'concatApp' after 53 ms
[15:17:14] Starting 'includehtml'...
[15:17:14] Finished 'includehtml' after 7.91 ms
[15:17:14] Starting 'includehtml'...
[15:17:14] Finished 'includehtml' after 6.18 ms
[15:17:14] Starting 'replaceSVG'...
[15:17:14] Finished 'replaceSVG' after 5.36 ms
[15:17:14] Starting 'minifyApp'...
\style.css: 125691
\style.css: 102958
[15:17:16] Finished 'minifyApp' after 2.2 s
[15:17:16] Starting 'smoosh'...
[15:17:16] Finished 'smoosh' after 117 ms
[15:17:16] Starting 'compress'...
[15:17:16] Finished 'compress' after 26 ms
[15:17:16] Starting 'clean2'...
[15:17:16] Finished 'clean2' after 3.83 ms
[15:17:16] Finished 'package' after 2.61 s
``` 

5 -  copy new SD_WLAN/List.htm file to your SD card

# Not yet implemented
Translation engine is there but no translation is done yet
