const express = require('express');
require('dotenv').config();
require('./db/db');


const port = process.env.APP_PORT || 9000;
const app = express();
const apiRouter = require('./routers/api')
const passport = require('passport');
require('./config/passport')(passport);

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(apiRouter)
app.use(passport.initialize());
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
