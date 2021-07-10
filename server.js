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
            return
        } else if (answer.choice === 'View all departments') {
            allDepartments();
            return
        } else if (answer.choice === 'View all roles') {
            allRoles();
            return
        } else if (answer.choice === 'Add a department') {
            newDepartment();
            return
        } else if (answer.choice === 'Add a role') {
            newRole();
            return
        } else if (answer.choice === 'Add an employee') {
            newEmployee();
            return
        } else if (answer.choice === 'Update an employee role') {
            updateRole();
            return
        } else (answer.choice === 'Nothing to change, all done!')
        console.log("See you later...");
        quit();
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
            team();
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
            team();
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
            team();
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
            const params = [answer.role, answer.salary, answer.roleID];

            db.query(sql, params, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`New role, ${answer.role} was added successfully!`)
                    team();
                }
            })
        })

}

// add new employee
function newEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'What is the first name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'role',
            message: 'What role id does this employee belong to?'
        },
        {
            type: 'input',
            name: 'manager',
            message: "What is the employees' manager's id?"
        }
    ])
        .then(function (answer) {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [answer.first, answer.last, answer.role, answer.manager];

            db.query(sql, params, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`New role, ${answer.first, answer.last} was added successfully!`)
                    team();
                }
            })
        })

}

// update  employee role
function updateRole() {
    const viewEmployees = `SELECT * FROM employee`;
    const currentEmployee = [];

    db.query(viewEmployees, function (err, result) {
        if (err)
            console.log(err);
        for (var i = 0; i < result.length; i++) {
            currentEmployee.push(result[i].first_name)
        }

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's role would you like to update?",
                choices: currentEmployee
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: "What role would you like to assign this employee?"
            }
        ])
            .then(function (answer) {
                const sql = `UPDATE employee SET role_id = ? WHERE first_name =?`;
                const params = [answer.employeeRole, answer.employee];
                console.log(answer.employee, answer.employeeRole);
                db.query(sql, params, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`New role, ${answer.employee} was added successfully!`)
                        team();
                    }
                })
            })
    })
}

// exit the app
function quit() {
    process.exit();
}