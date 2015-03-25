# FlashAir Web File Manager
It is based on available code :  https://flashair-developers.com/en/documents/tutorials/advanced/2/     
please have also a check to : https://flashair-developers.com/en/documents/api/

#UI
<img src=https://github.com/luc-github/Flashair-FM/blob/master/Images/UI.jpg?raw=true>
#Feature
It allows to browse, upload and delete files on SD Card and to know the current capacity of the Card

#Configuration
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

4 - you can edit the List.htm to change the header
```
   <h1>Wifi SD Card</h1>
```
 
5 - Unplug and replug card to refresh settings
