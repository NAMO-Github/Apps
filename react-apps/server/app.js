const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const appConfig = require('./config/env');
const routerApp = require('./config/router.config');

app.use(morgan('tiny'));
app.use(helmet());
app.use(compression());
app.use(routerApp);

app.listen(appConfig.port, appConfig.host, function () {
  console.log(
    `App running port: ${appConfig.port} in ${process.env.NODE_ENV} environment.`
  );
});
module.exports = app;
