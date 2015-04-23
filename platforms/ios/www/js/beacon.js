var beacon = {
  beacons : new Array(),
  add : function(macadd) {
    alert(macadd);
    beacon.beacons.push(macadd);
  },
  clear : function() {
    beacon.beacons = [];
  },
  show : function() {
    $.each(beacon.beacons, function(key, beacon) {
      alert(beacon);
    });
  }
};
