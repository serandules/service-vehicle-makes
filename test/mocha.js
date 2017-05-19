var nconf = require('nconf');

nconf.overrides({
    'services': [
        {"path": __dirname + '/..', "domain": "autos", "prefix": "/apis/v/vehicle-makes"}
    ]
});