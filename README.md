languagemodel-slavic-service
============================
[![Build Status](https://api.travis-ci.org/intersystems-ru/languagemodel-slavic-service.png?branch=master)](https://travis-ci.org/intersystems-ru/languagemodel-slavic-service)

Simple HTTP service which accepts text in Russian and/or Ukrainian and returns morphological analysis results as JSON.

## Setting up
Once you've checked out the source code you can type at the command prompt:

```
mvn jetty:run
```

or

```
mvn jetty:run-war
```

Then point your prowser at `http://localhost:8080/`.

## Screenshots

![](http://intersystems-ru.github.io/languagemodel-slavic-service/analyzer.png)

