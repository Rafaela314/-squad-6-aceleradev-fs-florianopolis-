package main

import (
	"fmt"
	"log"
	"net/smtp"
)

/*
Versão simples para o envio de email - com e sem autenticação
*/
func SendingMail() { //com autenticação - testei com a conta do Gmail e 'funcionou'
	send("teste GO")
}

func send(body string) {
	from := "email@gmail.com"
	pass := "password"
	to := "email@gmail.com"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Teste GO\n\n" +
		body

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return
	}

	log.Print("sent")
}

func SendingMailSEMAutenticacao() {
	// Connect to the remote SMTP server.
	c, err := smtp.Dial("mail.gmail.com:25")
	if err != nil {
		log.Fatal(err)
	}

	// Set the sender and recipient first
	if err := c.Mail("remetente@gmail.com"); err != nil {
		log.Fatal(err)
	}
	if err := c.Rcpt("destinatario@gmail.com"); err != nil {
		log.Fatal(err)
	}

	// Send the email body.
	wc, err := c.Data()
	if err != nil {
		log.Fatal(err)
	}
	_, err = fmt.Fprintf(wc, "Corpo do email de teste GO")
	if err != nil {
		log.Fatal(err)
	}
	err = wc.Close()
	if err != nil {
		log.Fatal(err)
	}

	// Send the QUIT command and close the connection.
	err = c.Quit()
	if err != nil {
		log.Fatal(err)
	}
}
