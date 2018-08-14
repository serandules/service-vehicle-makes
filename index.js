var log = require('logger')('service-vehicle-makes');
var express = require('express');
var bodyParser = require('body-parser');

var errors = require('errors');
var utils = require('utils');
var mongutils = require('mongutils');
var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');

var VehicleMakes = require('model-vehicle-makes');

// var validators = require('./validators');
var sanitizers = require('./sanitizers');

var paging = {
    start: 0,
    count: 1000,
    sort: ''
};

var fields = {
    '*': true
};


module.exports = function (router) {
    router.use(serandi.ctx);
    router.use(auth({
        GET: [
            '^\/$',
            '^\/.*'
        ]
    }));
    router.use(throttle.apis('vehicle-makes'));
    router.use(bodyParser.json());

    /**
     * {"name": "serandives app"}
     */
    /*router.post('/', validators.create, sanitizers.create, function (req, res) {
        VehicleMakes.create(req.body, function (err, make) {
            if (err) {
                log.error(err);
                return res.pond(errors.serverError());
            }
            res.locate(make.id).status(201).send(make);
        });
    });*/

    router.get('/:id', function (req, res) {
        if (!mongutils.objectId(req.params.id)) {
            return res.pond(errors.notFound());
        }
        VehicleMakes.findOne({_id: req.params.id}).exec(function (err, make) {
            if (err) {
                log.error('vehicle-makes:find-one', err);
                return res.pond(errors.serverError());
            }
            if (!make) {
                return res.pond(errors.notFound());
            }
            res.send(make);
        });
    });


    /**
     * /users?data={}
     */
    router.get('/', function (req, res) {
        var data = req.query.data ? JSON.parse(req.query.data) : {};
        sanitizers.clean(data.query || (data.query = {}));
        utils.merge(data.paging || (data.paging = {}), paging);
        utils.merge(data.fields || (data.fields = {}), fields);
        VehicleMakes.find(data.query)
            .skip(data.paging.start)
            .limit(data.paging.count)
            .sort(data.paging.sort)
            .exec(function (err, makes) {
                if (err) {
                    log.error('vehicle-makes:find', err);
                    return res.pond(errors.serverError());
                }
                res.send(makes);
            });
    });

    /*router.delete('/:id', function (req, res) {
        if (!mongutils.objectId(req.params.id)) {
            return res.pond(errors.notFound());
        }
        VehicleMakes.remove({_id: req.params.id}, function (err) {
            if (err) {
                log.error(err);
                return res.pond(errors.serverError());
            }
            res.status(204).end();
        });
    });*/
};

