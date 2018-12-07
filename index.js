var log = require('logger')('service-vehicle-makes');
var bodyParser = require('body-parser');

var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');

var model = require('model');

var VehicleMakes = require('model-vehicle-makes');

module.exports = function (router, done) {
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

    router.get('/:id',
      serandi.findOne(VehicleMakes),
      function (req, res, next) {
      model.findOne(req.ctx, function (err, make) {
        if (err) {
          return next(err);
        }
        res.send(make);
      });
    });


    /**
     * /users?data={}
     */
    router.get('/',
      serandi.find(VehicleMakes),
      function (req, res, next) {
      model.find(req.ctx, function (err, makes, paging) {
        if (err) {
          return next(err);
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

    done();
};

