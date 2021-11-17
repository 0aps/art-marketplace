# Order microservice

> Provides capability to manage orders.

[![Build Status](https://github.com/0aps/art-marketplace/workflows/CI%20Order/badge.svg)](https://github.com/0aps/art-marketplace/actions)

## System requirements

* Node.js 16.0+
* MongoDB 5.0+

## Instructions

1. Clone repository:

   Assuming you have `git` installed and available in your shell's path, run: `git clone <repository>`.

2. Install project requirements in the project root directory.

   ```sh
   npm install
   ```

3. Copy `.env.example` file into `.env` file. Fill the relevant fields in it. Here is an example:

    ```dotenv
    NAME=order
    PORT=3000
    ```
4. Start the web server:

   ```sh
   npm start
   ```
