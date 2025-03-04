const express = require('express');
const multer = require('multer');

// Cria uma instância do Router
const router = express.Router();

// Configuração do Multer para salvar imagens na pasta /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage });

// Função para inicializar as rotas com o modelo Product
module.exports = ({ Product }) => {
  // Rota para Cadastrar Produto
  router.post('/', upload.array('images', 8), async (req, res) => { 
    try {
      const { 
        name, 
        description, 
        suggestedPrice, 
        category, 
        sellerName, 
        sellerPhone, 
        sellerCPF, 
        address 
      } = req.body;

      // Verifica se há arquivos enviados
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Você deve enviar pelo menos 1 imagem.' });
      }

      // Converte as imagens para um array de nomes
      const images = req.files.map(file => file.filename);

      // Validação básica dos dados do vendedor
      if (!sellerName || !sellerPhone || !sellerCPF || !address) {
        return res.status(400).json({ message: 'Dados do vendedor incompletos.' });
      }

      // Cria o produto no banco de dados
      const product = await Product.create({
        name,
        description,
        suggestedPrice: parseFloat(suggestedPrice),
        price: null,
        category,
        images,
        sellerName,
        sellerPhone,
        sellerCPF,
        address,
        approved: false, // Inicializa como não aprovado
      });

      res.status(201).json({ message: 'Produto cadastrado com sucesso!', product });
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      res.status(500).json({ message: 'Erro interno ao cadastrar produto.' });
    }
  });

  // Rota para Listar Produtos Pendentes
  router.get('/pending', async (req, res) => {
    try {
      const pendingProducts = await Product.findAll({ 
        where: { approved: false }, // Busca apenas produtos não aprovados
        attributes: [
          'id',
          'name',
          'description',
          'suggestedPrice',
          'category',
          'images',
          'sellerName',
          'sellerPhone',
          'address',
        ],
      });

      res.json(pendingProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar produtos pendentes.' });
    }
  });

  // Rota para Aprovar e Precificar Anúncio
  router.post('/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
      const product = await Product.findByPk(id); // Busca o produto pelo ID
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      // Atualiza o status e o preço do produto
      product.price = parseFloat(price);
      product.approved = true;
      await product.save();

      res.json({ message: 'Anúncio aprovado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao aprovar anúncio.' });
    }
  });

  // Rota para Listar Produtos Aprovados
  router.get('/approved', async (req, res) => {
    try {
      const approvedProducts = await Product.findAll({ 
        where: { approved: true }, // Busca apenas produtos aprovados
        attributes: [
          'id',
          'name',
          'description',
          'price',
          'category',
          'images',
          'sellerName',
          'sellerPhone',
          'address',
        ],
      });

      res.json(approvedProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar produtos aprovados.' });
    }
  });

  return router;
};