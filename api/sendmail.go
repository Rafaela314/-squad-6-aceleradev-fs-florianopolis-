package main

import (
	"bytes"
	"errors"
	"fmt"
	"net/smtp"
	"runtime"
	"strings"
	"text/template"
)

/*
Precisa ser testado - achei que supre nossa necessidade mas não testei
*/
func _CatchPanic(err *error, functionName string) {

	if r := recover(); r != nil {

		fmt.Printf("%s : PANIC Defered : %v\n", functionName, r)

		// Capture the stack trace
		buf := make([]byte, 10000)
		runtime.Stack(buf, false)

		fmt.Printf("%s : Stack Trace : %s", functionName, string(buf))

		if err != nil {

			*err = errors.New(fmt.Sprintf("%v", r))
		}
	} else if err != nil && *err != nil {

		fmt.Printf("%s : ERROR : %v\n", functionName, *err)

		// Capture the stack trace
		buf := make([]byte, 10000)
		runtime.Stack(buf, false)

		fmt.Printf("%s : Stack Trace : %s", functionName, string(buf))
	}
}

func SendEmail(host string, port int, userName string, password string,
	to []string, subject string, message string) (err error) {

	defer _CatchPanic(&err, "SendEmail")

	parameters := &struct {
		From    string
		To      string
		Subject string
		Message string
	}{
		userName,
		strings.Join([]string(to), ","),
		subject,
		message,
	}

	buffer := new(bytes.Buffer)

	template := template.Must(template.New("emailTemplate").Parse(_EmailScript()))
	template.Execute(buffer, parameters)

	auth := smtp.PlainAuth("", userName, password, host)

	err = smtp.SendMail(
		fmt.Sprintf("%s:%d", host, port),
		auth,
		userName,
		to,
		buffer.Bytes())

	return err
}

// _EmailScript returns a template for the email message to be sent
func _EmailScript() (script string) {

	return `From: {{.From}}
To: {{.To}}
Subject: {{.Subject}}
MIME-version: 1.0
Content-Type: text/html; charset="UTF-8"

{{.Message}}`
}
