const express = require('express');
const cors = require('cors');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const CRONS = require('./utils/common/cron-jobs')

const app = express();

app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true
})); 

app.use(express.json()); //pass incoming resquest body
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server in PORT : ${ServerConfig.PORT}`);
    CRONS();
});

