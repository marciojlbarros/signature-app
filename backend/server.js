// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware para parsear JSON
app.use(bodyParser.json({ limit: '10mb' }));

// Middleware CORS
app.use(cors());

// Diretório onde as assinaturas serão salvas
const signaturesDir = path.join(__dirname, 'signatures');

// Criar o diretório se não existir
if (!fs.existsSync(signaturesDir)) {
  fs.mkdirSync(signaturesDir, { recursive: true });
}

// Rota para salvar os dados
app.post('/api/save', (req, res) => {
    const { name, signature } = req.body;
    
    console.log('Dados recebidos:', { name, signature }); // Log dos dados recebidos
  
    if (!name || !signature) {
      return res.status(400).send('Nome e assinatura são necessários.');
    }
  
    const timestamp = Date.now();
    const fileName = `signature_${timestamp}.png`;
    const filePath = path.join(signaturesDir, fileName);
  
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
  
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error('Erro ao salvar a assinatura:', err);
        return res.status(500).send('Erro ao salvar a assinatura.');
      }
  
      console.log('Assinatura salva como', filePath);
      res.status(200).send('Dados salvos com sucesso!');
    });
  });
