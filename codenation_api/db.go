package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
)

func initDB() (*sql.DB, error) {
	var dberr error

	dbuser := os.Getenv("dbuser")
	dbpassword := os.Getenv("dbpassword")
	dbname := os.Getenv("dbname")
	dbhost := os.Getenv("dbhost")

	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", dbhost, dbuser, dbname, dbpassword)

	db, dberr := sql.Open("postgres", dbURI)

	return db, dberr
}

func createDB() error {
	log.Println("Validando schema DB")
	db, err := initDB()
	if err != nil {
		log.Println(err)
		return err
	}
	defer db.Close()

	sql := `	SELECT 1 
				FROM   pg_tables
				WHERE  schemaname = 'public'
				AND    tablename = 'administrators'`

	// Se já existe a tabela administratores
	if rowExists(sql, db) {
		return nil
	}

	log.Println("Schema inexistente, criando")

	trc, _ := db.Begin()

	log.Println("Abrindo arquivo")
	file, err := ioutil.ReadFile("db.sql")
	if err != nil {
		return err
	}

	log.Println("Separando")
	requests := strings.Split(string(file), ";;")

	for _, request := range requests {
		log.Println("Executanto")
		request := strings.Replace(request, ";;", ";", -1)
		_, err := trc.Exec(request)
		if err != nil {
			trc.Rollback()
			log.Println(err)
			return err
		}
	}

	err = trc.Commit()
	log.Println("Schema criado")


	return err
}

func closeDB(db *sql.DB) {
	db.Close()
}
