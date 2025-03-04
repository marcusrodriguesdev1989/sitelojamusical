module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    suggestedPrice: { type: DataTypes.FLOAT, allowNull: true }, // Preço sugerido pelo vendedor
    price: { type: DataTypes.FLOAT, allowNull: true }, // Preço aprovado pelo admin
    category: { type: DataTypes.STRING, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false }, // Array de nomes de arquivos de imagem
    sellerName: { type: DataTypes.STRING, allowNull: false }, // Nome do vendedor
    sellerPhone: { type: DataTypes.STRING, allowNull: false }, // Telefone do vendedor
    sellerCPF: { type: DataTypes.STRING, allowNull: false }, // CPF do vendedor
    address: { type: DataTypes.STRING, allowNull: false }, // Endereço do vendedor
    approved: { type: DataTypes.BOOLEAN, defaultValue: false }, // Status de aprovação
  });
};