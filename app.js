let express = require('express');
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

app.intent('Geenbetalingsregeling-custom-custom', (conv) => {
    conv.ask('Dit is een kaartje');
    let card = new BasicCard({
        title: 'This is the title',
        subtitle: 'This is the subtitle'
    });

    card.formattedText = 'This is the content'
    conv.ask(
        new BasicCard({
            text: `This is a basic card.  Text in a basic card can include "quotes" and
            most other unicode characters including emoji.  Basic cards also support
            some markdown formatting like *emphasis* or _italics_, **strong** or
            __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
            things like line  \nbreaks`, // Note the two spaces before '\n' required for
            // a line break to be rendered in the card.
            subtitle: 'This is a subtitle',
            title: 'Title: this is a title',
            buttons: new Button({
                title: 'This is a button',
                url: 'https://assistant.google.com/',
            }),
            image: new Image({
                url: 'https://example.com/image.png',
                alt: 'Image alternate text',
            }),
            display: 'CROPPED',
        }));
});

expressApp.post('/fulfillment', app);

expressApp.listen(port, function () {
    console.log('Gulp is running on port:' + port);
});
