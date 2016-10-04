var log = require('logger')('vehicle-make-service');
var utils = require('utils');
var VehicleMake = require('vehicle-make');
var mongoose = require('mongoose');
var mongutils = require('mongutils');
var sanitizer = require('./sanitizer');

var express = require('express');
var router = express.Router();

module.exports = router;

var paging = {
    start: 0,
    count: 1000,
    sort: ''
};

var fields = {
    '*': true
};

/**
 * {"name": "serandives app"}
 */
router.post('/vehicle-makes', function (req, res) {
    VehicleMake.create(req.body, function (err, make) {
        if (err) {
            log.error(err);
            res.status(500).send({
                error: true
            });
            return;
        }
        res.send(make);
    });
});

router.get('/vehicle-makes/:id', function (req, res) {
    VehicleMake.findOne({
        id: req.params.id
    }).exec(function (err, make) {
            if (err) {
                log.error('vehicle-make find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            if (!make) {
                res.status(404).send({
                    error: true
                });
                return;
            }
            res.send(sanitizer.export(make));
        });
});


/**
 * /users?data={}
 */
router.get('/vehicle-makes', function (req, res) {
    var data = req.query.data ? JSON.parse(req.query.data) : {};
    sanitizer.clean(data.criteria || (data.criteria = {}));
    utils.merge(data.paging || (data.paging = {}), paging);
    utils.merge(data.fields || (data.fields = {}), fields);
    VehicleMake.find(data.criteria)
        .skip(data.paging.start)
        .limit(data.paging.count)
        .sort(data.paging.sort)
        .exec(function (err, makes) {
            if (err) {
                //TODO: send proper HTTP code
                log.error('vehicle-make find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            res.send(makes);
        });
});

router.delete('/vehicle-makes/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(404).send({
            error: 'specified vehicle-make cannot be found'
        });
        return;
    }
    VehicleMake.findOne({_id: req.params.id}).exec(function (err, make) {
        if (err) {
            log.error('vehicle-make find error');
            res.status(500).send({
                error: 'error while retrieving vehicle-make'
            });
            return;
        }
        if (!make) {
            res.status(404).send({
                error: 'specified vehicle-make cannot be found'
            });
            return;
        }
        make.remove();
        res.send({
            error: false
        });
    });
});

