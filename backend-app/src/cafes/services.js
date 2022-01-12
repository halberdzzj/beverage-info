const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./database');
const Cafe = require('./models/cafe');
const Employee = require('./models/employee');
const WorkRecord = require('./models/workday');
const Op = Sequelize.Op;

const generateEmployeeId = (length = 7) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return `UI${result}`;
}

const postAddCafe = async (req, res) => {
    const cafeObj = {
        id: uuidv4(),
        name: req.body.name,
        logo: req.body.logo,
        location: req.body.location
    }
    try {
        const result = await Cafe.create(cafeObj);
        console.log(result.dataValues)
        return result.dataValues;
    } catch (err) {
        console.error(err.message);
        return err;
    }
}

const postAddEmployee = async (req, res) => {
    // get cafe id by cafe name to insert the employee as reference
    const cafeName = req.body.cafeName;

    try {
        const cafe = await Cafe.findAll({
            where: {
                name: {
                    [Op.eq]: cafeName
                }
            }
        });

        if (cafe.length === 0) {
            return { Message: 'This cafe does not exist.' }
        }
        const cafeId = cafe[0].dataValues.id;


        // to check if this employee is already working at some other cafe
        const newEmployeeName = req.body.name;
        const existingEmployee = await Employee.findAll({
            where: {
                name: {
                    [Op.eq]: newEmployeeName
                }
            }
        });
        if (existingEmployee.length > 0) {
            return { Message: 'Employee is working under some cafe already.' }
        }
        const postResult = await Employee.create({
            id: generateEmployeeId(),
            name: newEmployeeName,
            cafeId: cafeId
        });
        return postResult.dataValues;
    } catch (error) {
        return error;
    }
}

const getCafebyLocation = async (req, res) => {
    const location = req.query.location;
    if (!!!location) return { Message: 'Location is invalid.' }
    const cafes = await sequelize.query(`SELECT c.name, c.description,COUNT(e.id) AS employees, c.logo, c.location, c.id  FROM cafe AS c, employee AS e WHERE c.location = '${location}' AND c.id = e.cafeId GROUP BY c.id ORDER BY employees DESC;`, { type: sequelize.QueryTypes.SELECT })
    // const cafes = await Cafe.findAll({
    //     attributes: {
    //         include: [[Sequelize.fn('COUNT', Sequelize.col('employees.id')), "employeeCount"]]
    //     }, //['name', 'description', 'logo', 'location', 'id'],
    //     include: [
    //         {
    //             model: Employee,
    //             attributes: []
    //         }
    //     ],
    //     where: {
    //         location: {
    //             [Op.eq]: location
    //         }
    //     },
    //     group: ['cafe.id'],
    //     // order: ['employeeCount']
    // });
    // console.log(cafes)
    return cafes;
}

const getEmployees = async (req, res) => {
    // const employees.
    const employees = await sequelize.query(
        `SELECT e.name, 
                COUNT(w.id) AS days_worked, 
                c.name AS cafe, 
                e.id 
                FROM cafe AS c, employee AS e, workrecord AS w 
                WHERE c.id = e.cafeId AND e.id = w.employeeId 
                GROUP BY e.name, e.id
                ORDER BY days_worked DESC;`, { type: sequelize.QueryTypes.SELECT })
    return employees
}

const generateRandomIndex = (max) => {
    return Math.floor(Math.random() * max);
}
const populateDBDate = async () => {
    // insert cafe data
    const cafes = [
        { name: 'Sweet Savory Expresso Bar', logo: 'http://sweetsavoryexpressobar/logo.jpg', description: 'something about the cafe', location: 'Area A' },
        { name: 'Brew Ha Ha Tearoom', logo: 'http://brewhahatearoom/logo.jpg', description: 'something about the cafe', location: 'Area A' },
        { name: 'ABC Cafe', logo: 'http://abccafe/logo.jpg', description: 'something about the cafe', location: 'Area B' },
        { name: 'Brew Bar', logo: 'http://brewbar/logo.jpg', description: 'something about the cafe', location: 'Area A' },
        { name: 'Java Hut', logo: 'http://javahut/logo.jpg', description: 'something about the cafe', location: 'Area C' },
        { name: 'Last Bites Cafe', logo: 'http://lastbitescafe/logo.jpg', description: 'something about the cafe', location: 'Area B' },
        { name: 'Sweet Cafe', logo: 'http://sweetcafe/logo.jpg', description: 'something about the cafe', location: 'Area B' },
        { name: 'Test Cafe', logo: 'http://testcafe/logo.jpg', description: 'something about the cafe', location: 'Area A' },
        { name: 'Expresso Bar', logo: 'http://expressobar/logo.jpg', description: 'something about the cafe', location: 'Area A' },
        { name: 'Haha Cafe', logo: 'http://hahacafe/logo.jpg', description: 'something about the cafe', location: 'Area C' },
    ];

    const cafe = await Cafe.findAll({
        where: {
            name: {
                [Op.eq]: 'Sweet Savory Expresso Bar' 
            }
        }
    });

    if(cafe.length > 0) return;


    const storedCafeID = await Promise.all(cafes.map(async (cafe) => {
        const results = await Cafe.create({ id: uuidv4(), ...cafe });
        return results.dataValues.id;
    }));

    const people = [
        'Koby', 'Ryan', 'Vincent', 'John', 'Hugo', 'Dixon', 'Joey', 'Sutton', 'Brayden', 'Fraser', 'Lawrence', 'Price', 'Robert', 'Poole', 'Burke', 'Walter', 'Richardson', 'Noah', 'Barker'
    ];

    const storedEmployeeID = await Promise.all(people.map(async (ppl) => {
        const results = await Employee.create({ id: generateEmployeeId(), name: ppl, cafeId: storedCafeID[generateRandomIndex(storedCafeID.length)] });
        return results.dataValues.id;
    }));
    let updatedEmployeeList = storedEmployeeID.concat([]);


    for (let i = 0; i < 60; i++) {
        updatedEmployeeList.push(storedEmployeeID[generateRandomIndex(storedEmployeeID.length)]);
    }

    await Promise.all(updatedEmployeeList.map(async (employee) => {
        let counter = 0;
        if (generateRandomIndex(2) === 1) {
            counter++;
            const results = await WorkRecord.create({
                id: uuidv4(),
                employeeId: employee,
                date: new Date()
            })
        }
        return { ...employee, counter: counter }
    }))
}

const syncDB = () => {
    Employee.belongsTo(Cafe, { constraints: true, onDelete: 'CASCADE' });
    Cafe.hasMany(Employee);
    WorkRecord.belongsTo(Employee, { constraints: true, onDelete: 'CASCADE' });
    Employee.hasMany(WorkRecord);

    sequelize.sync().then(result => {
        // console.log('table created successfully', result)
        populateDBDate()
    }).catch(err => {
        console.log('error', err)
    });
}

module.exports = { postAddCafe, syncDB, postAddEmployee, getCafebyLocation, getEmployees, populateDBDate }