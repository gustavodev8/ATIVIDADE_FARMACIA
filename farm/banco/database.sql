
CREATE DATABASE IF NOT EXISTS atividade_farmacia;
USE atividade_farmacia;


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    recebe_promocao BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_normal DECIMAL(10, 2) NOT NULL,
    preco_desconto DECIMAL(10, 2) NOT NULL
);


INSERT INTO produtos (nome, descricao, preco_normal, preco_desconto) VALUES
('Dipirona Monoidratada 500mg', 'Analgésico e antitérmico com 10 comprimidos.', 15.50, 10.90),
('Vitamina C 1g', 'Suplemento vitamínico efervescente com 10 tabletes.', 22.00, 15.00),
('Protetor Solar FPS 60', 'Proteção alta contra raios UVA/UVB, 200ml.', 59.90, 45.00),
('Shampoo Anticaspa', 'Tratamento para couro cabeludo, 200ml.', 35.00, 28.50),
('Creme Hidratante Corporal', 'Hidratação profunda por 24h, 400ml.', 29.90, 22.90);
