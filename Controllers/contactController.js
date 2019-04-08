let contactController = function(Contact) {
    let post = function(req, res) {
        let items;

        if (req.body.items !== undefined) {
            items = req.body.items;
        } else {
            items = req.body;
        }

        let contact = new Contact(items);
        console.log("body");
        console.log(items);
        console.log("end body");
        let requiredFields = ["bedrijf", "telefoonnummer"];
        let error = false;

        for (let i = 0; i < requiredFields.length; i++) {
            console.log(requiredFields[i] + " - " + items[requiredFields[i]]);
            if (
                items[requiredFields[i]] === undefined ||
                items[requiredFields[i]] === ""
            ) {
                error = true;
            }
        }

        if (error) {
            res.status(422).send("Vul meer gegevens in");
        } else {
            contact.save();

            res.status(201);
            res.send(contact);
        }
    };

    let get = function(req, res) {

        let collection = {};
        let query = {};

        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        // pagination waardes opvragen
        // req.body.start
        let start = 1;

        if(req.query.start) {
            start = parseInt(req.query.start);
        }

        // req.body.limit
        let limit = 1000000;
        if(req.query.limit) {
            limit = parseInt(req.query.limit);
        }


        Contact.find(query, function(err, contacts) {
            if (err) res.status(500).send(err);
            else {

                collection.items = [];

                let counter = 0;

                contacts.forEach(function (element) {

                    counter++;
                    let newContact = element.toJSON();


                    if ((counter >= start) && (collection.items.length < limit)) {
                        collection.items.push(newContact);
                    }
                });

                res.json(collection);

            }
        });
    };


    return {
        post: post,
        get: get
    };
};
module.exports = contactController;
