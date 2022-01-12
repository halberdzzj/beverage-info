const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const { fetchDrinks } = require('./src/drinks/drink.process');
const sequelize = require('./src/cafes/database');
const Cafe = require('./src/cafes/models/cafe');
const { postAddCafe, syncDB, postAddEmployee, getCafebyLocation, getEmployees } = require('./src/cafes/services');
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/drinks', async (req, res) => {

    try {
        const type = req.query.type;
        // console.log('app', type)
        const data = await fetchDrinks(type);
        return res.send({ drinks: data });

    } catch (err) {
        return res.send({ Message: err.Message });
    }
});

app.get('/cafes', async (req, res) => {
    const result = await getCafebyLocation(req, res);
    return res.json(result)
});

app.get('/cafes/employees', async (req, res) => {
    const result = await getEmployees(req, res);
    return res.json(result);
});

app.post('/cafe', async (req, res) => {
    const result = await postAddCafe(req, res);
    return res.json(result)
});

app.post('/cafe/employee', async (req, res) => {
    const result = await postAddEmployee(req, res);
    return res.json(result)
});

// Cafe.sync().then(result => {
//     console.log('1', result);
// }).catch(err => {
//     console.error('err', err);
// });

syncDB();

app.listen(PORT, () => {
    console.log('app is running!');
});