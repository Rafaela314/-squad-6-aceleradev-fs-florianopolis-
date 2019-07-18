package main

import (
	"database/sql"
	"log"
)

const hashCost = 8

var port = ""
var jwtKey = []byte("")
var db *sql.DB

func checkError(err error, msg string) {
	if err != nil {
		log.Fatal(msg)
	}
}
