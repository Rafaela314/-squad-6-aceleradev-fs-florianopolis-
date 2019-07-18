package main

import (
	"database/sql"
	"fmt"
	"os"
)

func initDB() {
	var dberr error

	dbuser := os.Getenv("dbuser")
	dbpassword := os.Getenv("dbpassword")
	dbname := os.Getenv("dbname")
	dbhost := os.Getenv("dbhost")

	dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", dbhost, dbuser, dbname, dbpassword)

	db, dberr = sql.Open("postgres", dbURI)

	checkError(dberr, "Não foi possível conectar com o BD.")
}

func closeDB() {
	db.Close()
}
