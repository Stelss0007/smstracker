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
    smsplugin.startReception(function(result){alert('sms=>' + result);}, function(error){alert('error '+ error);});
    alert('end get sms');
});

$('#stopGetSMS').on( "click", function(){
    alert('stop get sms');
    smsplugin.stopReception(function(result){alert('stop get sms!' + result);}, function(error){alert('error '+ error);});
    alert('stop get sms');
});


var markers = {};

navigator.geolocation.getCurrentPosition (geolocationSuccess);

var map = L.map('map');

function geolocationSuccess(position) {
    alert (' Широта: ' + position.coords.latitude + "\n" + ' Долгота: ' + position.coords.longitude + "\n" + ' Высота: ' + position.coords.altitude + "\n" + ' точность: ' + position.coords.accuracy + "\n" + ' высоте точность: ' + position.coords.altitudeAccuracy + "\n" + ' заголовок: ' + position.coords.heading + "\n" + ' скорость: ' + position.coords.speed + "\n" + ' штампа времени: ' + position.timestamp + "\n");

    map.setView([position.coords.latitude, position.coords.longitude], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
      }).addTo(map);

    //set marker
    var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);

    //set  sircle radius
    //position.coords.accuracy - точность
    var circle = L.circle([position.coords.latitude, position.coords.longitude], position.coords.accuracy, {
        color: 'green',
        fillColor: '#00ff00',
        fillOpacity: 0.3
    }).addTo(map);

  
    //Сообщение для маркера
    marker.bindPopup("<b>Вы</b><br>Ваше место нахождения.").openPopup();
    setObjectPosition(49.4370, 32.0258, 'Rus');

};



function setObjectPosition(lat, lng, name) 
{
    alert(markers[name]);
    if(markers[name] === undefined) {
        alert('new marker');
        markers[name] = L.marker([lat, lng]).addTo(map);
        markers[name].bindPopup("<b>Object1 ["+name+"]</b><br>Место нахождения.").openPopup();
    } else {
        markers[name].setLatLng([lat, lng]).update();
    }
}
