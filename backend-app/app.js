const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { fetchDrinks } = require('./src/drinks/drink.process');

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     return res.json({ result: 'working !', data: new Date().toISOString() });
// });

app.get('/drinks', async (req, res) => {

    try {
        const type = req.query.type;
        // console.log('app', type)
        const data = await fetchDrinks(type);
        return res.send({drinks: data});

    } catch (err) {
        return res.send({ Message: err.Message });
    }
})

app.listen(PORT, () => {
    console.log('app is running!');
});