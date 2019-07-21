CREATE DATABASE bancouati;

/*
Tabela para LOGIN
*/
CREATE TABLE administrators(
  id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (60) NOT NULL,
  created_on TIMESTAMP NOT NULL
);

/*
Tabela dos usuários/funcionários do Banco
*/
CREATE TABLE users(
  id serial PRIMARY KEY,
  name VARCHAR (150),
  email VARCHAR (200) UNIQUE NOT NULL, 
  position VARCHAR (200),
  created_on TIMESTAMP NOT NULL
);  

/*
Tabela de clientes do Banco
*/
CREATE TABLE clients(
  id serial PRIMARY KEY,
  name VARCHAR (150) UNIQUE NOT NULL, 
  salary DECIMAL(10,2), 
  position VARCHAR (150),
  place VARCHAR (200), 
  is_special BOOLEAN NOT NULL DEFAULT false,
  created_on TIMESTAMP NOT NULL
);

- falta tabela de notificações e importação
