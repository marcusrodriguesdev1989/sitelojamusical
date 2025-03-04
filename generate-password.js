const bcrypt = require('bcryptjs');

const password = 'senha_do_admin'; // Altere para a senha desejada
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log('Senha criptografada:', hashedPassword);