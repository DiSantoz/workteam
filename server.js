const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// dotenv npm package to hide username and password
require('dotenv').config();

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },
    console.log('Connected to company database.')
);

// view all employees
function team() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ["View all employees", "Add employee", "Remove employee", "Update Employee role", "Update Employee manager"]
        }
    ]).then(function (answer) {
        console.log(answer)

        if (answer.choice === 'View all employees') {
            db.query(`SELECT * FROM role`, function (err, results) {
                if (err) {
                    console.log(err);
                  } else {
                    console.table(results);
                  }
                  
            });
        };
    });
};



team();