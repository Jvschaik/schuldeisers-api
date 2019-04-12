let express = require('express');
let debtors = require('./SchuldEisers');
let bodyParser = require('body-parser');
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    BasicCard,
    BrowseCarousel,
    BrowseCarouselItem,
    Button,
    RichResponse
} = require('actions-on-google');

const app = dialogflow({
    debug: true
});
const expressApp = express().use(bodyParser.json());
let port = process.env.PORT || 8000;

function capitalize(string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}
app.intent('contactgegevens-schuldeisers', (conv) => {
    let _debtor = conv.contexts.get('awaiting_debtor').parameters.schuldeiser.toLowerCase();
    let debtor = debtors[_debtor];
    conv.ask('Hier zijn de contact gegevens voor ' + capitalize(_debtor));
    conv.ask(new BasicCard({
        title: capitalize(_debtor),
        subtitle: debtor.type,
        buttons: new Button({
            title: 'Bel met ' + capitalize(_debtor),
            url: 'https://b50988fe.ngrok.io/call/' + debtor.phone_number,
        }),
        image: new Image({
            url: debtor.image,
            alt: _debtor,
        }),
        text: ``
    }))
});
app.intent('lukt de betaling - yes', (conv) => {
    conv.ask('Als tip raad ik je aan om mee te doen met de challenges in onze app. Zo kun je leren geld te besparen op een makkelijke en leuke manier en kun je prijzen winnen. Bij eventuele vragen kun je contact opnemen met het jongerenloket. Zij zullen je graag te woord staan.');
    conv.ask(new BasicCard({
        title: 'Jongeren Loket',
        subtitle: 'Gemeente Rotterdam',
        buttons: new Button({
            title: 'Bel met het jongerenloket',
            url: 'https://b50988fe.ngrok.io/call/',
        }),
        image: new Image({
            url: 'https://pbs.twimg.com/profile_images/534263421269585921/VZJJa4sb_400x400.jpeg',
            alt: 'jongeren_loket',
        }),
        text: ``
    }))
});
app.intent('onnodig', (conv) => {
    conv.ask('Ik raad je aan om mee te doen met de challenges in onze app. Zo kun je leren geld te besparen op een makkelijke en leuke manier en kun je prijzen winnen. Tevens verwijs ik je graag naar het jongerenloket om samen met een medewerker een plan te maken.');
    conv.ask(new BasicCard({
        title: 'Jongeren Loket',
        subtitle: 'Gemeente Rotterdam',
        buttons: new Button({
            title: 'Bel met het jongerenloket',
            url: 'https://b50988fe.ngrok.io/call/',
        }),
        image: new Image({
            url: 'https://pbs.twimg.com/profile_images/534263421269585921/VZJJa4sb_400x400.jpeg',
            alt: 'jongeren_loket',
        }),
        text: ``
    }))
});

app.intent('nodig', (conv) => {
    conv.ask('Oké, dan raad ik je aan om langs te gaan bij het jongerenloket. Zij willen je graag helpen om een plan op te stellen en jou verder op weg te helpen.');
    conv.ask(new BasicCard({
        title: 'Jongeren Loket',
        subtitle: 'Gemeente Rotterdam',
        buttons: new Button({
            title: 'Bel met het jongerenloket',
            url: 'https://b50988fe.ngrok.io/call/',
        }),
        image: new Image({
            url: 'https://pbs.twimg.com/profile_images/534263421269585921/VZJJa4sb_400x400.jpeg',
            alt: 'jongeren_loket',
        }),
        text: ``
    }))
});

expressApp.post('/fulfillment', app);

expressApp.get('/call/:phoneNumber', function (req, res) {
    res.redirect('tel:' + req.params.phoneNumber);
});

expressApp.get('/email/:emailAddress', function (req, res) {
    res.redirect('mailto:' + req.params.emailAddress);
});

expressApp.listen(port, function () {
    console.log('Gulp is running on port:' + port);
});
