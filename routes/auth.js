const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma.js');

const router = express.Router();

router.post('/registro', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const professor = await prisma.professor.create({
            data: { email, senha: senhaHash }
        });
        res.status(201).json({ mensagem: 'Professor cadastrado!', id: professor.id });
    } catch (erro) {
        if (erro.code === 'P2002') {
            return res.status(409).json({ mensagem: 'Email já cadastrado' });
        }
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar professor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const professor = await prisma.professor.findUnique({
        where: { email }
    });
    if (!professor) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }
    const senhaValida = await bcrypt.compare(senha, professor.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }
    const token = jwt.sign({ id: professor.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
});

module.exports = router;