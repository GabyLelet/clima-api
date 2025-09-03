const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const API_KEY = 'd2dee8e6b8cf4fd77ac0b4d6de844fe9'; // Substitua pela sua chave real
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Cidades corretas para a API
const cidades = [
  { nome: 'São Paulo', codigo: 'Sao Paulo,BR' },
  { nome: 'Damasco', codigo: 'Damascus,SY' },
  { nome: 'Bangladesh', codigo: 'Dhaka,BD' }
];

// Função para buscar clima
async function buscarClima(cidade) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade.codigo}&units=metric&appid=${API_KEY}`;
    const resposta = await axios.get(url);
    const data = resposta.data;
    return {
      cidade: cidade.nome,
      temperatura: data.main.temp,
      vento: data.wind.speed,
      maxima: data.main.temp_max,
      minima: data.main.temp_min
    };
  } catch (erro) {
    return { cidade: cidade.nome, erro: 'Não foi possível obter os dados' };
  }
}

// Rota do servidor para a API de clima
app.get('/clima', async (req, res) => {
  const resultados = await Promise.all(cidades.map(buscarClima));
  res.json(resultados);
});

// Rota para servir o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
