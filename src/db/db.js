const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/oren?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
