var validators = require('validators');
var VehicleMakes = require('model-vehicle-makes');

exports.find = function (req, res, next) {
    validators.query(req, res, function (err) {
        if (err) {
            return next(err);
        }
        validators.find({
            model: VehicleMakes
        }, req, res, next);
    });
};

exports.findOne = function (req, res, next) {
    validators.findOne({
        id: req.params.id,
        model: VehicleMakes
    }, req, res, next);
};