const express = require('express');
require('dotenv').config();
require('./db/db')
const port = process.env.PORT || 9000;
const app = express();

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
