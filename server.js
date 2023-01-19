const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");
//const department = require("./lib/department");
// Connect to database

//department();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: `${process.env.sqlpass}`,
    database: "Employee_db",
  },
  console.log(`Connected to the Employee_db database.`)
);
db.connect(function (err) {
  if (err) {
    throw err;
  }
});

const promptMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Please select an option",
        choices: [
          "View all departments",
          "View all employees",
          "View all roles",
          "Add a Department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((userChoice) => {
      switch (userChoice.menu) {
        case "View all departments":
          viewalldepartments();
          break;
        case "View all employees":
          viewallemployees();
          break;
        case "View all roles":
          viewallroles();
          break;
        case "Add a Department":
          addingDepartment();
          break;
        case "Add a role":
          addarole();
          break;
        case "Add an employee":
          addanemployee();
          break;
        case "Update an employee role":
          updateanemployee();
          break;
        case "Exit":
          process.exit();
      }
    });
};
const viewalldepartments = () => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\n");
      console.table(rows);
      promptMenu();
    }
  });
};

const viewallroles = () => {
  const sql = `SELECT role.id, role.title, role.salary, department.name AS Department FROM role JOIN department ON role.department_id=department.id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\n");
      console.table(rows);
      promptMenu();
    }
  });
};

const viewallemployees = () => {
  const sql = ` SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
  LEFT JOIN role on employee.role_id = role.id 
  LEFT JOIN department on role.department_id = department.id 
  LEFT JOIN employee manager on manager.id = employee.manager_id;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log("\n");
      console.table(rows);
      promptMenu();
    }
  });
};

const viewmanagers = () => {
  const sql = ` SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
  LEFT JOIN role on employee.role_id = role.id 
  LEFT JOIN department on role.department_id = department.id 
  LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  let managers = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < rows.length; i++) {
        const firstName = rows[i].first_name;
        const lastName = rows[i].last_name;
        const manager_id = rows[i].id;
        var newManager = {
          name: `${firstName} ${lastName}`,
          value: manager_id,
        };
        managers.push(newManager);
      }
    }
  });
  return managers;
};

const viewroles = () => {
  const sql = `SELECT * FROM role;`;
  let roles = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < rows.length; i++) {
        const role = rows[i].title;
        //  const lastName = rows[i].last_name;
        const role_id = rows[i].id;
        var selectrole = {
          name: `${role}`,
          value: role_id,
        };

        roles.push(selectrole);
        // console.log(roles);
      }
    }
  });
  return roles;
};

const viewdepartments = () => {
  const sql = `SELECT * FROM department;`;
  let departments = [];
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < rows.length; i++) {
        const department = rows[i].name;
        //  const lastName = rows[i].last_name;
        const department_id = rows[i].id;
        var selectdepartment = {
          name: `${department}`,
          value: department_id,
        };

        departments.push(selectdepartment);
        // console.log(roles);
      }
    }
  });
  return departments;
};

const addingEmployeeSQL = (first_Name, last_Name, role_Id, manager_Id) => {
  const sql =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [first_Name, last_Name, role_Id, manager_Id], (err, rows) => {
    if (err) throw err;
  });
};

const addanemployee = () => {
  const managers = viewmanagers();
  const roles = viewroles();
  // console.log(managers);
  // console.log(roles);
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "What is your firstname?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter your firstname");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastname",
        message: "Enter your lastname?",
        validate: (lastinput) => {
          if (lastinput) {
            return true;
          } else {
            console.log("Please enter your lastname");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "roles",
        message: "What is your role",
        choices: roles,
      },
      {
        type: "list",
        name: "managers",
        message: "Do you have a manager",
        choices: managers,
      },
    ])
    .then((answers) => {
      console.log(roles);
      let roleId = answers.roles;
      let managerId = answers.managers;
      let firstname = answers.firstname;
      let lastname = answers.lastname;
      addingEmployeeSQL(firstname, lastname, roleId, managerId);
      console.log("Employee added to the table");
    });
};

const addingDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Please enter the new department's name?",
        validate: (departmentInput) => {
          if (departmentInput) {
            return true;
          } else {
            console.log("Please enter a department name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES ('${answer.department}');`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          console.log("department added");
          promptMenu();
        }
      });
    });
};

const addarole = () => {
  const departments = viewdepartments();
  inquirer
    .prompt([
      {
        type: "input",
        name: "rolename",
        message: "What is the role's name?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a role name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "How much is the role's salary?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter a salary");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "department",
        message: "What is the role's department?",
        choices: departments,
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO role(title, salary, department_id ) VALUES ('${answer.rolename}', '${answer.salary}', '${answer.department}');`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          console.log("role added");
          promptMenu();
        }
      });
    });
};
promptMenu();
