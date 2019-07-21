package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func handlerGin() {
	router := gin.Default()
	router.PUT("/users/:id", updateUser)
	router.DELETE("/users/:id", deleteUser)
	router.Run(":8080")
}
/*
Mudei a tabela usuarios para USERS (estava ficando nome da tabela em PT e os campos em EN)
Pegar somente o updateUser e o deleteUser
*/
func updateUser(c *gin.Context) {
	id := c.Param("id")
	var usrs Users
	err := c.BindJSON(&usrs)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados inconsistentes"})
		return
	}
	//vamos deixar alterar o email???
	if rowExists("SELECT id FROM users WHERE id <> $1 AND email=$2", id, usrs.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email já cadastrado."})
		return
	}

	res, err := db.Exec("UPDATE users SET name=$2, email=$3,position=$4 WHERE id=$1", id, usrs.Name, usrs.Email, usrs.Position)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Não foi possível conectar ao BD"})
		return
	}

	rows, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Nenhum usuário alterado."})
		return
	}
	if rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Nenhum usuário alterado."})
	} else {
		c.JSON(200, gin.H{"message": "Usuário alterado com sucesso"})
	}
}

func deleteUser(c *gin.Context) {
	id := c.Param("id")
	res, err := db.Exec("DELETE FROM users WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Não foi possível conectar ao BD"})
		return
	}

	rows, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Nenhum usuário removido."})
		return
	}
	if rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Nenhum usuário removido"})
	} else {
		c.JSON(200, gin.H{"message": "Usuário removido com sucesso"})
	}
}
