# Excel parser to JSON

## Installation

1. `npm i`

2. Modify settings.js in `helpers` according to your needs

3. `node index.js`


## How the parsing work

### 1. Process cities

sheets: Europe, Asia, America

Check each city from xlsx with JSON file.

- If the city is missing from JSON one of the following happens:

  - add it together with a graph object for it in the `graph` section of the JSON file

  - ignore it, in case the xlsx file has '-' symbol for sheet values in it

- If the city is found, it is updated.

### 2. Process graphs

sheets: City pop, City GDP, City retail, Country retail, Country GDP, Country pop, City age structure, Country age structure, City GDP breakdown, Country GDP breakdown, Distribution of income

A list of cities with corresponding countries is compiled from "City pop" sheet. Each graph is processed one by one for every city, country in a loop.
