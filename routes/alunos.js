const express = require('express');
const prisma = require('../prisma.js');
const autenticar = require('../middleware.js');

const router = express.Router();

router.get('/', autenticar, async (req, res) => {
    const alunos = await prisma.aluno.findMany();
    res.json(alunos);
});

router.post('/', autenticar, async (req, res) => {
    const { nome, telefone, modalidade, vencimento } = req.body;
    const aluno = await prisma.aluno.create({
        data: {
            nome,
            telefone,
            modalidade,
            vencimento: new Date(vencimento)
        }
    });
    res.status(201).json(aluno);
});

router.get('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    const aluno = await prisma.aluno.findUnique({
        where: { id }
    });
    if (!aluno) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado' });
    }
    res.json(aluno);
});

router.put('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    const { nome, telefone, modalidade, vencimento, ativo } = req.body;
    const aluno = await prisma.aluno.update({
        where: { id },
        data: {
            nome,
            telefone,
            modalidade,
            vencimento: new Date(vencimento),
            ativo
        }
    });
    res.json(aluno);
});

router.delete('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    await prisma.aluno.delete({
        where: { id }
    });
    res.json({ mensagem: `Aluno ${id} removido!` });
});

module.exports = router;