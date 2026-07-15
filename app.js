require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/auth.js');
const alunosRouter = require('./routes/alunos.js');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.use('/alunos', alunosRouter);

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

module.exports = app;