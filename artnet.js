var options = {
    host: '172.16.23.15'
}
 
var artnet = require('artnet')(options);
 
// set channel 1 to 255 and disconnect afterwards.
artnet.set(1, 255, function (err, res) {
    artnet.close();
});