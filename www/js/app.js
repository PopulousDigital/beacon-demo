const API_URL = 'http://api.populousdigital.com/v0.1/beacon.php';
const API_KEY = 'kcx6WElYaXwL0kl0eB93NJfQWFrVQGF79puW4LExkfublWZqAWZ72hyTvHDzdbqf';

var menu = {
  toggle : function() {
    $button = $('#menu-button');
    if ($button.hasClass('on')) {
      $button.removeClass('on');
      $('#menu').hide();
    } else {
      $button.addClass('on');
      $('#menu').show();
    }
  }
}

var app = (function() {
	var app = {};

	var touchIsActive = false
	var touchStartX = 0
	var touchStartY = 0

	app.currentScreenId = null;
	app.beaconColorStyles = [
		'style-color-unknown style-color-unknown-text',
		'style-color-mint style-color-mint-text',
		'style-color-ice style-color-ice-text',
		'style-color-blueberry-dark style-color-blueberry-dark-text',
		'style-color-white style-color-white-text',
		'style-color-transparent style-color-transparent-text'];


  var pushNotification;
  function errorHandler(error) {
    alert(error);
  }

  onNotification = function (e) {
    switch (e.event) {
      case 'registered':
        if ( e.regid.length > 0 ) {
          user.token = e.regid;
          user.set();
          $('#regid').val(e.regid);
          //alert(e.regid);
        }
        break;
      case 'message':
        if (e.foreground) {
          //var soundfile = e.soundname || e.payload.sound;
          //var my_media = new Media("/android_asset/www/"+ soundfile);
          //my_media.play();
          //alert('foreground');
        } else {
          if ( e.coldstart ) {
            //alert('coldstart');
          } else {
            //alert('background');
          }
        }
        alert(e.payload.message);
        //alert(e.payload.msgcnt);
        //alert(e.payload.timeStamp);
        break;
      case 'error':
        alert(e.msg);
      break;
      default:
        alert('failed');
      break;
    }
  }

  function successHandler(token) {
    //alert('token: ' + token);
  }

  function tokenHandler (result) {
    alert('device token = ' + result);
    user.token = result;
  }

  function onNotificationAPN (event) {
    if (event.alert) {
      //navigator.notification.alert(event.alert);
    }

    if (event.sound) {
      var snd = new Media(event.sound);
      snd.play();
    }

    if (event.badge) {
      pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
  }

	function onDeviceReady() {
		app.startRanging();
    pushNotification = window.plugins.pushNotification;
    if (device.platform.toLowerCase() == 'android' || device.platform == "amazon-fireos") {
      pushNotification.register(successHandler, errorHandler, {'senderID' : '408275255910', 'ecb' : 'onNotification'});
    } else if (device.platform.toLowerCase() == 'ios') {
      pushNotification.register(tokenHandler, errorHandler, {"badge":"true", "sound":"true", "alert":"true", "ecb":"onNotificationAPN"});
    }
    /*
    $('.menu-item').on('mousedown', function() {
      $(this).addClass('on');
    });
    $('.menu-item').on('mouseup', function() {
      $(this).removeClass('on');
    });
    */
	}

	function checkTouchActive() {
		var active = touchIsActive;
		touchIsActive = false;
		return active;
	}

	function beaconColorStyle(color) {
		if (!color) {
			color = 0;
		}

		color = Math.max(0, color);
		color = Math.min(5, color);

		return app.beaconColorStyles[color];
	}

	app.showScreen = function(screenId) {
		if (app.currentScreenId != null) {
			$('#' + app.currentScreenId).hide();
		}

		app.currentScreenId = screenId;
		$('#' + app.currentScreenId).show();
		document.body.scrollTop = 0;
	};

	app.showHomeScreen = function() {
		app.showScreen('id-screen-home');
	};

	app.showScanScreen = function() {
		app.showScreen('id-screen-scan');
	};

	app.showRangeScreen = function() {
		app.showScreen('id-screen-range');
	};


	app.startScanning = function() {
		function onScan(beaconInfo) {
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage) {
			console.log('Scan error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo) {
			$('#id-screen-scan .style-beacon-list').empty();

			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.rssi > beacon2.rssi; });

			var html = '';
			$.each(beaconInfo.beacons, function(key, beacon) {
        alert('this');
        if (beacon.macAddress === 'D5:EB:88:F1:32:58') {
          var element = $(createBeaconHTML(beacon));
          $('#id-screen-scan .style-beacon-list').append(element);
        }
			});
		};

		function createBeaconHTML(beacon) {
			console.log('beacon: '+beacon.major+' '+beacon.minor+', '+beacon.rssi+' ('+beacon.measuredPower+')');
			var colorClasses = beaconColorStyle(beacon.color);
			html = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
				+ '</td></tr><tr><td>Measured power</td><td>' + beacon.measuredPower
				+ '</td></tr><tr><td>MAC address</td><td>' + beacon.macAddress
				+ '</td></tr></table></div>';
			return html;
		};

		app.showScanScreen();

		console.log("startEstimoteBeaconsDiscoveryForRegion")

		EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion({}, onScan, onError);
	};

	app.stopScanning = function() {
		console.log("stopEstimoteBeaconDiscovery")
		EstimoteBeacons.stopEstimoteBeaconDiscovery();
		app.showHomeScreen();
	};

	app.startRanging = function() {
    var average = 0;
    var distances = new Array();
		function onRange(beaconInfo) {
      //beacon.clear();
			$.each(beaconInfo.beacons, function(key, beacon) {
        //beacon.add(beacon.macAddress);
        /*if (beacon.macAddress === 'D5:EB:88:F1:32:58') {
          distances.push(beacon.distance);
          if (distances.length >= 5) {
            distances.shift();
          }
          $.each(distances, function(index, value) {
            average += value;
          });
          average = average / distances.length;
          if (average <= 2) {
            $('#beacon-message').show();
            $('#beacon-message').html('Welcome to Chris\' office!');
          } else {
            $('#beacon-message').hide();
          }
        }*/
			});
      //beacon.show();
		}

		function onError(errorMessage) {
			console.log('Range error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo) {
      /*
			$('#id-screen-range .style-beacon-list').empty();

			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.distance > beacon2.distance; });

			$.each(beaconInfo.beacons, function(key, beacon) {
        alert('test');
        //if (beacon.macAddress === 'D5:EB:88:F1:32:58') {
          var element = $(createBeaconHTML(beacon));
          $('#id-screen-range .style-beacon-list').append(element);
        //}
			});
      */
		};

		function createBeaconHTML(beacon) {
			var colorClasses = beaconColorStyle(beacon.color);
			html = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
				+ '</td></tr><tr><td>Power</td><td>' + beacon.measuredPower
				+ '</td></tr><tr><td>MAC address</td><td>' + beacon.macAddress
			if (beacon.distance) {
				html += '</td></tr><tr><td>Distance</td><td>'
					+ beacon.distance
			}
			html += '</td></tr></table></div>';
			return html;
		};

		app.showRangeScreen();

		EstimoteBeacons.requestAlwaysAuthorization();

		EstimoteBeacons.startRangingBeaconsInRegion({}, onRange, onError);
	};

	app.stopRanging = function()
	{
		EstimoteBeacons.stopRangingBeaconsInRegion({});
		app.showHomeScreen();
	};

	app.onStartScanning = function()
	{
		console.log('app.onStartScanning1');
		if (!checkTouchActive()) { return }
		console.log('app.onStartScanning2');
		app.startScanning();
	};

	app.onStopScanning = function()
	{
		if (!checkTouchActive()) { return }
		app.stopScanning();
	};

	app.onStartRanging = function()
	{
		if (!checkTouchActive()) { return }
		//app.startRanging();
	};

	app.onStopRanging = function()
	{
		if (!checkTouchActive()) { return }
		app.stopRanging();
	};

	app.onNavigateBack = function()
	{
		if (!checkTouchActive()) { return }
		history.back();
	};

	app.onTouchStart = function(event)
	{
		var changedTouch = event.changedTouches[0];
		touchStartX = changedTouch.screenX
		touchStartY = changedTouch.screenY;
		touchIsActive = true;
	};

	app.onTouchMove = function(event)
	{
		if (touchIsActive)
		{
			var changedTouch = event.changedTouches[0];
			var touchDeltaX = Math.abs(changedTouch.screenX - touchStartX);
			var touchDeltaY = Math.abs(changedTouch.screenY - touchStartY);
			if (touchDeltaX > 5 || touchDeltaY > 5)
			{
				touchIsActive = false;
			}
		}
	};

	app.onTouchCancel = function(event)
	{
		touchIsActive = false;
	};

	// ------------- Initialisation ------------- //

	document.addEventListener('deviceready', onDeviceReady, false);

	app.showHomeScreen();

	// ------------- Return application object ------------- //

	return app;

})();
