/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
//var smsplugin = cordova.require("info.asankan.phonegap.smsplugin.smsplugin");
var smsplugin = null;
var myLocation = {};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    
    
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        alert('ready');
        app.receivedEvent('deviceready');
        smsplugin = cordova.require("info.asankan.phonegap.smsplugin.smsplugin");
        
        smsplugin.isSupported(function(result){alert('isSuported => ');}, function(error){alert('Suported Error ');});
        smsplugin.startReception(function(result){alert('sms=>' + result);}, function(error){alert('error '+ error);});
        
        $('#sendSMS').on( "click", function(){
            alert('start');
            smsplugin.send($('#telephone').val(), $('#smsMessage').val(), '', function(result) {alert('ok');},function(error){alert('error');});
            alert('end');
        });

    },
    
    
    
    
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};





$('#sendSMS').on( "click", function(){
    alert('start send sms');
    smsplugin.send($('#telephone').val(), $('#smsMessage').val(), '', function(result) {alert('ok');},function(error){alert('error');});
    alert('end send sms');
});

$('#getSMS').on( "click", function(){
    alert('start get sms');
    smsplugin.isSupported(function(result){alert('isSuported => ');}, function(error){alert('Suported Error ');});
    smsplugin.startReception(getSMSResult, function(error){alert('error '+ error);});
    alert('end get sms');
});

$('#stopGetSMS').on( "click", function(){
    alert('stop get sms');
    smsplugin.stopReception(function(result){alert('stop get sms!' + result);}, function(error){alert('error '+ error);});
    alert('stop get sms');
});


var markers = {};

navigator.geolocation.getCurrentPosition (
                                          geolocationSuccess,
                                          function(){alert('Error Get My Location')},
                                          { maximumAge: 50000, timeout: 5000 }
                                         );

var map = L.map('map');

function geolocationSuccess(position) {
	myLocation['lat'] = position.coords.latitude;
	myLocation['lng'] = position.coords.longitude;
	myLocation['accuracy'] = position.coords.accuracy;

    alert (' Широта: ' + position.coords.latitude + "\n" + ' Долгота: ' + position.coords.longitude + "\n" + ' Высота: ' + position.coords.altitude + "\n" + ' точность: ' + position.coords.accuracy + "\n" + ' высоте точность: ' + position.coords.altitudeAccuracy + "\n" + ' заголовок: ' + position.coords.heading + "\n" + ' скорость: ' + position.coords.speed + "\n" + ' штампа времени: ' + position.timestamp + "\n");

    map.setView([position.coords.latitude, position.coords.longitude], 13);

//    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    L.tileLayer('file:///sdcard/tiles/{z}/{x}/{y}.jpg', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 13
      }).addTo(map);

    //set marker
    var marker = L.marker([myLocation['lat'], myLocation['lng']]).addTo(map);

    //set  sircle radius
    //position.coords.accuracy - точность
    var circle = L.circle([myLocation['lat'], myLocation['lng']], position.coords.accuracy, {
        color: 'green',
        fillColor: '#00ff00',
        fillOpacity: 0.3
    }).addTo(map);


    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var curentTime = hours+':'+minutes+':'+seconds
   

    //Сообщение для маркера
    marker.bindPopup("<b>Вы</b><br>Ваше место нахождения.<br> time: "+curentTime).openPopup();
	
	//Место нахождения другого обекта
	var objLocation = {};
	objLocation['lat'] = 49.4370;
	objLocation['lng'] = 32.0258;
	
  setObjectPosition(objLocation['lat'], objLocation['lng'], 'Rus');

};

function getSMSResult(result) {
  alert(result);
  var smsTextMapData = getUrlParams( result, 'q' );
  alert(smsTextMapData);
  
  var LatLng = splitLatLng(smsTextMapData);
  setObjectPosition(LatLng[0], LatLng[1], 'smsResult');
}

////////////////////////////////////////////////////
////////////// Измерение дистанции /////////////////
////////////////////////////////////////////////////
function distanceKM(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getUrlParams( url, name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return null;
  else
    return results[1];
}

function splitLatLng(str) {
  return str.split(",");
}

///////////// Отображение или пермещение маркера /////////////////////////
function setObjectPosition(lat, lng, name) 
{
    alert('obj start');
    var distance = distanceKM(myLocation['lat'], myLocation['lng'], lat, lng);
    alert(distance);
    if(markers[name] === undefined || markers[name] === null) {
        alert('new marker');
        markers[name] = L.marker([lat, lng]).addTo(map);
        markers[name].bindPopup("<b>Object1 ["+name+"]</b><br>Растояние:"+distance+"KM").openPopup();
    } else {
        markers[name].setLatLng([lat, lng]).update();
    }
    alert('obj end');
}

