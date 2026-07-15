const express = require('express');
const prisma = require('../prisma.js');
const autenticar = require('../middleware.js');

const router = express.Router();

router.get('/', autenticar, async (req, res) => {
    try {
        const alunos = await prisma.aluno.findMany();
        res.json(alunos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar alunos' });
    }
});

router.get('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    try {
        const aluno = await prisma.aluno.findUnique({
            where: { id }
        });
        if (!aluno) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado' });
        }
        res.json(aluno);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar aluno' });
    }
});

router.post('/', autenticar, async (req, res) => {
    const { nome, telefone, modalidade, vencimento } = req.body;
    try {
        const aluno = await prisma.aluno.create({
            data: {
                nome,
                telefone,
                modalidade,
                vencimento: new Date(vencimento)
            }
        });
        res.status(201).json(aluno);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar aluno' });
    }
});

router.put('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    const { nome, telefone, modalidade, vencimento, ativo } = req.body;
    try {
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
    } catch (erro) {
        if (erro.code === 'P2025') {
            return res.status(404).json({ mensagem: 'Aluno não encontrado' });
        }
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar aluno' });
    }
});

router.delete('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.aluno.delete({
            where: { id }
        });
        res.json({ mensagem: `Aluno ${id} removido!` });
    } catch (erro) {
        if (erro.code === 'P2025') {
            return res.status(404).json({ mensagem: 'Aluno não encontrado' });
        }
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao remover aluno' });
    }
});

module.exports = router;