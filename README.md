# CTM-Release-Tracker
A small Node/Angular/Express web app created during my internship. 

### The Problem
------
- Manual method of tracking releases within the team.
- Method is time consuming and the team had to always remember to write the release numbers down to keep track of them. 
- In a Continuous Delivery environment this can be quite frustrating. 
- We have a screen that monitors site performance which continually scrolls through tabs on chrome.
- Can we have a web app that displays our release numbers?
- Can that web app be automated so we don't have the manually keep track of the release numbers anymore? 

### Tools used 
------
- Angular 
- Node
- Express
- [GoCD API] (https://api.go.cd/current/)

### Run
------
- Clone into the repo
- Download the appropriate NPM packages 

```shell
$ npm install
```

- Create a config.json file in the parent folder (i.e where app.js is located) under this syntax:

```javascript
{
    "loginDetails": 
    {
        "username": "[Your GO Username]",
        "password": "[Your GO Password]",
        "ctmGoServer": "[Your GO Server Address]"
    }
}
```

- Start the application

```shell
$ npm start

Example app listening on port: 3000
```

Visit [localhost:3000](http://localhost:3000).