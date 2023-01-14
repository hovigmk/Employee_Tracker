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
  const sql = ` SELECT employee.first_name AS Name, employee.last_name AS Surname, role.title AS Title, manager_id FROM employee JOIN role ON employee.role_id = role.id;`;

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
promptMenu();
