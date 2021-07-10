INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Legal'),
    ('Finance')
;

INSERT INTO role (title, salary, department_id)
VALUES
    ("Salesperson", 30000.00, 1),
    ("Software Engineer", 60000.00, 2),
    ("Lawyer", 80000.00, 3),
    ("Accountant", 40000.00, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Amy", "Jones", 1, null),
    ("Mark", "Jackson", 1, 1),
    ("Bob", "Builder", 2, null),
    ("Ashley", "Zion", 3, null),
    ("Jaxon", "Five", 4, null)
;