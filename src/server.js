const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializa o Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Caminho para o banco de dados SQLite
});

// Sincroniza os modelos com o banco de dados
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');
    await sequelize.sync({ force: true }); 
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();

// Importa e inicializa os modelos
const Product = require('./models/Product')(sequelize);

// Configuração do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve arquivos da pasta /uploads

// Rotas
const productRoutes = require('./routes/products')({ Product });
app.use('/api/products', productRoutes);

// Rota para Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Credenciais fixas para o admin
  const adminEmail = 'admin@example.com';
  const adminPassword = 'senha123'; 

  // Verifica as credenciais
  if (email === adminEmail && password === adminPassword) {
    return res.json({ message: 'Login bem-sucedido!', user: { email } });
  }

  return res.status(401).json({ message: 'Credenciais inválidas.' });
});

// Rotas para páginas estáticas
app.get('/vender', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/vender.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para Listar Produtos Aprovados (Home)
app.get('/api/products/approved', async (req, res) => {
  try {
    const approvedProducts = await Product.findAll({ where: { approved: true } }); // Busca produtos aprovados
    res.json(approvedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos aprovados' });
  }
});