# Collapedia

Collapedia is a full-stack app that allows users to create, collaborate, and share wikis. Users can perform CRUD operations based on their account types. If visiting as a guest, you can view public wikis. Upon signing up for a standard account, you can create wikis, and if the account is upgraded, you can view and create private wikis, as well as add collaborators to the wikis.

## Getting Started

If you would like to get this app up and running on your local machine for development and testing purposes, run the following:

```
$ git clone https://github.com/sansae/collapedia.git
$ cd collapedia
$ npm install
$ npm start
```

### Prerequisites

Make sure you have node and npm installed in your system. For instructions on how, visit [nodejs docs](https://nodejs.org/en/download/package-manager/).

Finally, navigate to localhost:3000 in your browser.

If you prefer to just see and test the app live without installing anything, click  [here](http://collapedia.herokuapp.com).

## Running Tests

To run both integration and unit tests:

```
$ npm test
```

To run integration or unit tests individually:

```
$ npm test spec/integration/<name-of-spec-test>
```

```
$ npm test spec/integration/<name-of-spec-test>
```

## Built With

* [Express.js](https://expressjs.com/) and [PostgreSQL](https://www.postgresql.org/) - for the back-end
* [Stripe](https://stripe.com/) - for payment processing
* [Passport.js](http://www.passportjs.org/) - for login/logout
* [Sendgrid](https://sendgrid.com/) - for sending email notifications

## Authors

* **Kent Saeteurn** - [sansae](https://github.com/sansae)
