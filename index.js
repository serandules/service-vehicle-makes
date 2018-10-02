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

var validators = require('./validators');
var sanitizers = require('./sanitizers');

module.exports = function (router) {
    router.use(serandi.many);
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

    router.get('/:id', validators.findOne, sanitizers.findOne, function (req, res) {
      mongutils.findOne(VehicleMakes, req.query, function (err, make) {
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
    router.get('/', validators.find, sanitizers.find, function (req, res) {
      mongutils.find(VehicleMakes, req.query.data, function (err, makes, paging) {
        if (err) {
          log.error('vehicle-makes:find', err);
          return res.pond(errors.serverError());
        }
        res.many(makes, paging);
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

