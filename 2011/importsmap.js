var url = 'http://maps.news21.com/api/Tileset/imports'
wax.tilejson(url, function(tilejson) {
  var mm = com.modestmaps;
  var m = new mm.Map('modestmaps-setup',
    new wax.mm.connector(tilejson),
    new mm.Point(850,680));
  m.setCenterZoom(new mm.Location(
    tilejson.center[1],  // lon
    tilejson.center[0]), // lat
    tilejson.center[2]); // zoom
  wax.mm.interaction(m, tilejson);
  wax.mm.fullscreen(m, tilejson).appendTo(m.parent);
});
