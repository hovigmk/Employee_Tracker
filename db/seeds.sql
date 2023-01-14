INSERT INTO department (name)
VALUES ("Finance"),
       ("Legal Services"),
       ("Human Resources");
      

INSERT INTO role (title, salary, department_id)
VALUES  ("Lawyer", 80000.500, 2),
("Analyst", 60000.100, 1),
("HR Assistant", 50000.400, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Charlie", "Gibson", 1, NULL),
("Sarah", "Johnson", 3, NULL),
("Jack", "Ryan", 2, 1),
("John", "McCassi", 2, NULL);
