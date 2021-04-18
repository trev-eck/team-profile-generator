// require all of of the files and packets we are going to need for the project
const inquirer = require('inquirer');
const fs = require('fs');
const Employee = require("./lib/Employee");
const Engineer = require("./lib/Engineer");
const Manager = require("./lib/Manager");
const Intern = require("./lib/Intern");

//this is the base html document we will be exporting, we will add the card elements through a function when needed
let htmlData = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/5e4aa1d10e.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <title>Team Profile</title>
</head>
<body class=" bg-white">
    <div class="jumbotron jumbotron-fluid text-center bg-primary text-white">
        <div class="container">
          <h1 class="display-4">My Team</h1>
          <p class="lead">Created by Trevor Eckberg</p>
        </div>
      </div>

      <div class="d-flex flex-row justify-content-around">
`;
//this is the final bit of html we need, we will append to htmlData before exporting
const htmlEnd =  `

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js" integrity="sha384-+YQ4JLhjyBLPDQt//I+STsc9iw4uQqACwlvpslubQzn4u2UU2UFM80nGisd026JF" crossorigin="anonymous"></script>
</body>
</html>`;

//below are the four sets of questions we need, will will choose a different set depending on the current situation
const menuQuestions = [ 
    {
        type: 'list',
        message: "How would you like to continue?",
        choices: ["Add an Engineer", "Add an Intern", "Finish building your team"],
        name: 'nextStep'
    },
];
const managerQuestions = [
    {
        type: 'input',
        message: 'Please enter the Managers name: ',
        name: 'managerName'
    },
    {
        type: 'input',
        message: 'Please enter the Managers Employee ID ',
        name: 'managerId'
    },
    {
        type: 'input',
        message: 'Please enter the Managers Email Address: ',
        name: 'managerEmail'
    },
    {
        type: 'input',
        message: 'Please enter the Managers Office Number: ',
        name: 'managerOffice'
    },
];
const engineerQuestions = [
    {
        type: 'input',
        message: 'Please enter the Engineers name: ',
        name: 'engineerName'
    },
    {
        type: 'input',
        message: 'Please enter the Engineers Employee ID ',
        name: 'engineerId'
    },
    {
        type: 'input',
        message: 'Please enter the Engineers Email Address: ',
        name: 'engineerEmail'
    },
    {
        type: 'input',
        message: 'Please enter the engineers GitHub Username: ',
        name: 'engineerGithub'
    },
];
const internQuestions = [
    {
        type: 'input',
        message: 'Please enter the Interns name: ',
        name: 'internName'
    },
    {
        type: 'input',
        message: 'Please enter the Interns Employee ID ',
        name: 'internId'
    },
    {
        type: 'input',
        message: 'Please enter the Interns Email Address: ',
        name: 'internEmail'
    },
    {
        type: 'input',
        message: 'Please enter the Interns School: ',
        name: 'internSchool'
    },
];

//this is the big function that will display the appropriate questions, generate an employee based on user input, call the generateCard function, and recursively call itself to continue the program
function askQuestions(theQuestion) {
    inquirer.prompt(theQuestion)
    .then(answers => {
        //the user has given us information about an employee, create the employee, make a new card, and return to main menu
        if(answers.managerName) {
            let theManager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOffice);
            addCard(theManager);
            askQuestions(menuQuestions);
        } else if (answers.engineerName) {
            let theEngineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
            addCard(theEngineer);
            askQuestions(menuQuestions);
        }else if(answers.internName) {
            let theIntern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
            addCard(theIntern);
            askQuestions(menuQuestions);
        }
        // the user made a selection on the main menu, either ask them about the next employee or finish up
        if(answers.nextStep){
            switch (answers.nextStep) {
                case "Add an Engineer":
                    askQuestions(engineerQuestions);
                    break;
                case "Add an Intern":
                    askQuestions(internQuestions);
                    break;
                case "Finish building your team":
                    writeToFile();
                    break;
            }
        }
    })
    .catch(err => {

    });
}

//this function generates html for a card element, populates it with data about the current employee, and appends it to the htmlData variable
function addCard(employee) {
    htmlData += `<div class="card p-3" style="width: 18rem;">
    <div class="card-header bg-primary">
    <h5 class="card-title text-white ">${employee.getName()}</h5>`;
    switch (employee.getRole()) {
        case "Manager":
            htmlData += `
            <h6 class="card-subtitle mb-2 text-white "><i class="fas fa-coffee"></i> Manager</h6>
          </div>
          <div class="card-body bg-secondary">
              <ul class="list-group">
                  <li class="list-group-item">ID# : ${employee.getId()}</li>
                  <li class="list-group-item">Email: <a href="mailto:${employee.getEmail()}" target="_blank">${employee.getEmail()}</a></li>
                  <li class="list-group-item">Office Number: ${employee.getOfficeNumber()}</li>
              </ul>
          </div>
        </div>`;
            break;
        case "Engineer":
            htmlData += `
            <h6 class="card-subtitle mb-2 text-white "><i class="fas fa-glasses"></i> Engineer</h6>
          </div>
          <div class="card-body bg-secondary">
              <ul class="list-group">
                  <li class="list-group-item">ID# : ${employee.getId()}</li>
                  <li class="list-group-item">Email: <a href="mailto:${employee.getEmail()}" target="_blank">${employee.getEmail()}</a></li>
                  <li class="list-group-item">GitHub: <a href="https://github.com/${employee.getGithub()}" target="_blank">${employee.getGithub()}</a></li>
              </ul>
          </div>
        </div>`;
            break;
        case "Intern":
            htmlData += `
            <h6 class="card-subtitle mb-2 text-white "><i class="fas fa-user-graduate"></i> Intern</h6>
          </div>
          <div class="card-body bg-secondary">
              <ul class="list-group">
                  <li class="list-group-item">ID# : ${employee.getId()}</li>
                  <li class="list-group-item">Email: <a href="mailto:${employee.getEmail()}" target="_blank">${employee.getEmail()}</a></li>
                  <li class="list-group-item">School: ${employee.getSchool()}</li>
              </ul>
          </div>
        </div>`;
            break;
    }
}
//creates a new file at index.html containing all of the data in htmlData
function writeToFile() {
    htmlData += htmlEnd;
    fs.appendFile("index.html", htmlData, (error) =>
    error? console.error(error) : console.log("HTML Created!")
    );
}
//initiates the application
function runApp() {
    askQuestions(managerQuestions);
}
runApp();