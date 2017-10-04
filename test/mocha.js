var nconf = require('nconf');

nconf.overrides({
    "LOCAL_VEHICLE_MAKES": __dirname + "/..:autos:/apis/v/vehicle-makes"
});