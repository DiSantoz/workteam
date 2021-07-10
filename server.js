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
    }
);

db.connect(function (err) {
    if (err) throw err
    else console.log('Connected to the company database.')
    team();
})

// Ask user what they would like to do
function team() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ["View all employees", "View all departments", "View all roles", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Nothing to change, all done!"]
        }
    ]).then(function (answer) {
        if (answer.choice === 'View all employees') {
            allEmployees();
        } else if (answer.choice === 'View all departments') {
            allDepartments();
        } else if (answer.choice === 'View all roles') {
            allRoles();
        } else if (answer.choice === 'Add a department') {
            newDepartment();
        } else if (answer.choice === 'Add a role')
            newRole();
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

// add a department
function newDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
    ])
        .then(function (answer) {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, answer.department, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`New department, ${answer.department} was added successfully!`)
                    team();
                }
            })
        })

}
// add a role
function newRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role you would like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the role you would like to add?'
        },
        {
            type: 'input',
            name: 'roleID',
            message: 'What is the department id  for the role you would like to add?'
        }
    ])
        .then(function (answer) {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            db.query(sql, answer.role, answer.salary, answer.roleID, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`New role, ${answer.role} was added successfully!`)
                    team();
                }
            })
        })

}
// async function removeEmployee() {
//      const employees = await db.findAllEmployees();

//      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//        name: `${first_name} ${last_name}`,
//        value: id
//      }));

//      const { employeeId } = await prompt([
//        {
//          type: "list",
//          name: "employeeId",
//          message: "Which employee do you want to remove?",
//          choices: employeeChoices
//        }
//      ]);

//      await db.removeEmployee(employeeId);

//      console.log("Removed employee from the database");

//      team();
//    }
// team();