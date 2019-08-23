
/*
Tabela para LOGIN
*/
-- name: create-administrators-table
CREATE TABLE administrators(
  id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (60) NOT NULL,
  created_on TIMESTAMP NOT NULL
);;

/* Insere admin padrão */
-- name: create administrators
INSERT INTO administrators
(id, username, "password", created_on)
VALUES(1, 'admin', '$2a$08$4Xg/k7P21dAbKe.1zL4n0.gW.urUXm1yoSPAcsFfF7vP/LA.4bwbu', '2019-07-24 09:04:19.831');;


/*
Tabela dos usuários/funcionários do Banco
*/
-- name: create-users-table
CREATE TABLE users (
	id serial NOT NULL,
	"name" varchar(150) NULL,
	email varchar(200) NOT NULL,
	"position" varchar(200) NULL,
	created_on timestamp NOT NULL,
	is_active varchar NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);;

/*
Tabela de clientes do Banco
*/
CREATE TABLE clients (
	id serial NOT NULL,
	"name" varchar(150) NOT NULL,
	salary numeric(10,2) NULL,
	"position" varchar(150) NULL,
	place varchar(200) NULL,
	is_special bool NOT NULL DEFAULT false,
	created_on timestamp NOT NULL,
	lote_id int4 NULL,
	CONSTRAINT clients_name_key UNIQUE (name),
	CONSTRAINT clients_pkey PRIMARY KEY (id)
);;
CREATE INDEX clients_lote_id_idx ON clients USING btree (lote_id);;

/*
Tabela onde fica os funcionários publicos
*/
CREATE TABLE public_agent (
	name varchar(150) NOT NULL,
	position varchar(150) NULL,
	place varchar NULL,
	salary numeric NULL,
	id_lote int4 NULL,
	CONSTRAINT public_agent_pkey PRIMARY KEY (name)
);;
CREATE INDEX public_agent_id_lote_idx ON public_agent USING btree (id_lote);;



/* 
 Tabela de eventos/notificações
*/
CREATE TABLE events (
	id serial NOT NULL,
	qt_leads int4 NULL,
	created_on timestamp NULL,
	CONSTRAINT events_pkey PRIMARY KEY (id)
);;

/*
Leads vinculados ao evento
*/
CREATE TABLE events_leads (
	id serial NOT NULL,
	name varchar(150) NOT NULL,
	event_id int4 NULL,
	created_on timestamp NOT NULL,
	CONSTRAINT events_leads_pkey PRIMARY KEY (id),
	CONSTRAINT events_leads_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id)
);;


/*
Usuários que receberam os eventos
*/
CREATE TABLE events_to (
	id serial NOT NULL,
	events_id int4 NULL,
	user_id int4 NULL,
	sent_at timestamp NULL,
	CONSTRAINT events_to_pkey PRIMARY KEY (id),
	CONSTRAINT events_to_events_id_fkey FOREIGN KEY (events_id) REFERENCES events(id),
	CONSTRAINT events_to_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);;



CREATE SEQUENCE lote_agent
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1;;



CREATE OR REPLACE FUNCTION _final_median(NUMERIC[])
   RETURNS NUMERIC AS
$$
   SELECT AVG(val)
   FROM (
     SELECT val
     FROM unnest($1) val
     ORDER BY 1
     LIMIT  2 - MOD(array_upper($1, 1), 2)
     OFFSET CEIL(array_upper($1, 1) / 2.0) - 1
   ) sub;
$$
LANGUAGE 'sql' IMMUTABLE;;
 
CREATE AGGREGATE median(NUMERIC) (
  SFUNC=array_append,
  STYPE=NUMERIC[],
  FINALFUNC=_final_median,
  INITCOND='{}'
);;