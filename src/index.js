const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { CRONS } = require('./utils/common')

const app = express();

app.use(express.json()); //pass incoming resquest body
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server in PORT : ${ServerConfig.PORT}`);
    CRONS();
});

