let express = require('express');
let contactRouter = express.Router();

let routes = function (Contact) {
    let contactController = require('../Controllers/contactController.js')(Contact);

    contactRouter.route('/')
        .options(function (req, res) {
            res.set('Allow', 'GET,OPTIONS,POST');
            res.end();
        })
        .post(contactController.post)

        .get(contactController.get);

    contactRouter.use('/:contactId', function (req, res, next) {
        Contact.findById(req.params.contactId, function (err, contact) {
            if (err) {
                res.status(500).send(err);
            } else if (contact) {
                req.contact = contact;
                next();
            } else {
                res.status(404).send('contact not found');
            }
        });
    });

    contactRouter.route('/:contactId')
        .get(function (req, res) {

            let returnContact = req.contact.toJSON();
            returnContact._links = {};
            returnContact._links.self = {};
            returnContact._links.self.href = 'http://' + req.headers.host + '/contacts/' + returnContact._id;
            returnContact._links.collection = {};
            returnContact._links.collection.href = 'http://' + req.headers.host + '/contacts/';

            res.json(returnContact);
        })

        .put(function (req, res) {

            let requiredFields = ['bedrijf', 'telefoonnummer'];
            let error = false;

            for (let i = 0; i < requiredFields.length; i++) {
                if (req.body[requiredFields[i]] === undefined || req.body[requiredFields[i]] === '') {
                    error = true;
                }
            }

            if (!error) {
                req.contact.bedrijf = req.body.title;
                req.contact.telefoonnummer = req.body.artist;

                //req.contact.favourite = req.body.favourite;

                if (req.headers['content-type'] === 'application/json') {
                    req.contact.save(function (err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            let returnContact = req.contact.toJSON();
                            returnContact._links = {};
                            returnContact._links.self = {};
                            returnContact._links.self.href = 'http://' + req.headers.host + '/contacts/' + returnContact._id;
                            returnContact._links.collection = {};
                            returnContact._links.collection = 'http://' + req.headers.host + '/contacts/';
                            res.json(returnContact);
                        }
                    });
                } else {
                    res.status(400).json({'message': 'Headers are incorrect'});
                }
            } else {
                console.log("hello");
                res.status(415).json({'message': 'Unsupported format: */*'});
            }
        })

        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (let p in req.body) {
                req.contact[p] = req.body[p];
            }

            req.contact.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.contact);
                }
            });
        })
        .delete(function (req, res) {
            req.contact.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Contact was removed')
                }
            });
        })
        .options(function (req, res) {
            res.set('Allow', 'GET,OPTIONS,PUT,PATCH,DELETE');
            res.end();
        });

    return contactRouter;
};

module.exports = routes;
