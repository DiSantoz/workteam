const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

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

// Ask user what they would like to do
function team() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ["View all employees", "View all departments", "View all roles", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
        }
    ]).then(function (answer) {
        if (answer.choice === 'View all employees') {
            allEmployees();
        } else if (answer.choice === 'View all departments') {
            allDepartments();
        } else if (answer.choice === 'View all roles')
            allRoles();
    });
};

// view all employees
function allEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id 
            FROM ((role
            INNER JOIN department ON role.department_id = department.id)
            INNER JOIN employee ON role.id = employee.role_id)`, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.table(results);
        }
    });
}

// view all departments
function allDepartments() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.table(results);
        }
    });
}

// view all roles
function allRoles() {
    db.query(`SELECT role.title, role.id, department.name , role.salary
            FROM role
            INNER JOIN department ON role.department_id = department.id;`, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.table(results);
        }
    });
}

team();