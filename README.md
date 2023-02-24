# Glänzend Backend

Glänzend Backend is a backend RESTful APIs server that provides API endpoints for [Glänzend](https://glanzend.netlify.app), a client-side website from the repository [Glänzend Frontend](https://github.com/KritapasSuwannawin/Glanzend-Frontend)

## Tech Stack

Key libraries that this project uses include:

- ExpressJS, a framework for building RESTful APIs server in NodeJS.
- Json Web Token, a module for signing and verifying Json Web Token (JWT).
- Node Postgres, a JavaScript library that provides an interface for Node.js applications to interact with PostgreSQL databases.

## Status

Glänzend Backend is currently up and running; however, there are several areas for improvement as stated in the [Roadmap](#roadmap) below.

## Roadmap

Future plan for this project are divided into 2 aspects: enforcing security measures of current APIs and development of new API endpoints.

Here are the things that I plan to do for each aspect:

**Enforcing security measures**

- Implement middleware to verify that users are really logged in before sending the request to restricted routes (routes that only accessible to logged-in users) by verifying the Json Web Token (JWT) included in the request header.
- Perform server-side validation on information sent with requests, particularly user inputs.
- Implement data sanitization to prevent PostgreSQL query injection and cross-site scripting (XSS) attacks.
- Set up security HTTP headers.

**Development of new API endpoints**

- Modify **_`/api/account/register`_** and **_`/api/account/login`_** routes to allow for social sign-up and login.
- Implement an API endpoint for retrieving and sending back Stripe's checkout session to enable online payment through Stripe.
- Implement an API endpoint for resetting user passwords.
