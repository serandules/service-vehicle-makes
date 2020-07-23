var nconf = require('nconf');

nconf.overrides({
    "SERVICE_CONFIGS": "master:apis:/v/configs",
    "SERVICE_CLIENTS": "master:apis:/v/clients",
    "SERVICE_USERS": "master:apis:/v/users",
    "SERVICE_TOKENS": "master:apis:/v/tokens",
    "LOCAL_VEHICLE_MAKES": __dirname + "/..:apis:/v/vehicle-makes"
});

require('pot');
