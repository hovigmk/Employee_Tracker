const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");
// Connect to database

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
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(rows);
      managers = [];
      // console.log("\n");
      // console.table(rows);
      for (let i = 0; i < rows.length; i++) {
        // console.log(rows);
        // console.log(rows[i].first_name);
        const firstName = rows[i].first_name;
        const lastName = rows[i].last_name;
        const manager_id = rows[i].id;
        var newManager = {
          name: `${firstName} ${lastName}`,
          value: manager_id,
        };
        managers.push(newManager);
      }
      return managers;
      // console.log(managers);
      // inquirer.prompt([
      //   {
      //     type: "list",
      //     name: "managers",
      //     message: "Pick a manager",
      //     choices: managers,
      //   },
      // ]);
    }
  });
};

const addanemployee = () => {
  managers.push = "none";
  inquirer.prompt([
    {
      type: "input",
      name: "name",
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
      name: "manager",
      message: "Do you have a manager",
      choices: managers,
    },
  ]);
};
promptMenu();
