package main

import (
	"bufio"
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/gen2brain/go-unarr"
	"github.com/scorredoira/email"
)

func initPublicAgents() error {
	log.Println("Iniciando base dos agentes publicos")
	//Abrindo conexão com o banco de dados
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco de dados")
		log.Println(err)
		return err
	}
	defer db.Close()

	if rowExists("select 1 from public_agent", db) {
		log.Println("Base já populada")
		return nil
	}

	err = baixarCSV()
	if err != nil {
		log.Println(err)
	}
	return err
}

// Função que busca o arquivo de funcionários publicos de SP
func baixarCSV() error {
	log.Println("Iniciando BaixarCSV")

	lockAgents = 'S'

	filepath := "remuneracao.rar"
	actualPath, _ := os.Getwd()

	// Monta a requisição para baixar o CSV
	body := strings.NewReader(`__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwULLTIwNDQzOTAyMzEPZBYCAgMPZBYMAgUPEA8WBh4ORGF0YVZhbHVlRmllbGQFCE9SR0FPX0lEHg1EYXRhVGV4dEZpZWxkBQpPUkdBT19ERVNDHgtfIURhdGFCb3VuZGdkEBVbBVRPRE9THUFETUlOSVNUUkFDQU8gR0VSQUwgRE8gRVNUQURPHUFHLk0uVi5QQVIuTElULk5PUlRFIEFHRU1WQUxFHEFHLlJFRy5TQU4uRU4uRVNULlNQLiBBUlNFU1AeQUcuUkVHLlNWLlAuREVMLlRSLkUuU1AgQVJURVNQHUFHRU5DSUEgTUVULkNBTVBJTkFTIEFHRU1DQU1QHkFHRU5DSUEgTUVUUk9QLkIuU0FOVElTVEEgQUdFTShBR0VOQ0lBIE1FVFJPUE9MSVRBTkEgREUgQ0FNUElOQVMgLSBBR0VNKEFHRU5DSUEgTUVUUk9QT0xJVEFOQSBERSBTT1JPQ0FCQSAtIEFHRU0eQy5FLkVELlRFQy5QQVVMQSBTT1VaQS1DRUVURVBTHUMuUC5UUkVOUyBNRVRST1BPTElUQU5PUy1DUFRNHUNBSVhBIEJFTkVGSUMuUE9MSUNJQSBNSUxJVEFSCkNBU0EgQ0lWSUwdQ0VURVNCLUNJQS5BTUJJRU5UQUwgRVNULlMuUC4aQ0lBIERFU0VOVi5BR1JJQy5TUCBDT0RBU1AdQ0lBLkRFUy5IQUIuVVJCLkVTVC5TLlAuLUNESFUeQ0lBLlBBVUxJUy5TRUNVUklUSVpBQ0FPLUNQU0VDHkNJQS5QUk9DLkRBRE9TIEVTVC5TLlAtUFJPREVTUChDSUEuU0FORUFNRU5UTyBCQVNJQ08gRVNULlMuUEFVTE8tU0FCRVNQHkNJQS5TRUdVUk9TIEVTVC5TLlBBVUxPLUNPU0VTUB1DT01QLk1FVFJPUE9MSVRBTk8gUy5QLi1NRVRSTx1DT01QQU5ISUEgRE9DQVMgU0FPIFNFQkFTVElBTyhDT01QQU5ISUEgUEFVTElTVEEgREUgT0JSQVMgRSBTRVJWSUNPUyAtBURBRVNQHURFUEFSVEFNLkVTVFJBREFTIFJPREFHRU0gREVSKERFUEFSVEFNRU5UTyBBR1VBUyBFTkVSR0lBIEVMRVRSSUNBLURBRUUoREVQQVJUQU1FTlRPIEVTVEFEVUFMIERFIFRSQU5TSVRPLURFVFJBTh5ERVBUTy4gRVNULiBUUkFOU0lUTyBERVRSQU4gU1AeREVTRU5WT0xWLlJPRE9WSUFSSU8gUy9BLURFUlNBKERFU0VOVk9MVkUgU1AgQUdFTkNJQSBERSBGT01FTlRPIERPIEVTVEEoRU1BRS1FTVBSRVNBIE1FVFJPUE9MSVRBTkEgREUgQUdVQVMgRSBFTh5FTVAuTUVUUi5UUi5VUkIuU1AuUy9BLUVNVFUtU1AoRU1QLlBBVUxJU1RBIFBMQU5FSi5NRVRST1BMSVRBTk8gUy5BLUVNUBpGQUMuTUVELlMuSi5SLlBSRVRPLUZBTUVSUBtGQUMuTUVESUNJTkEgTUFSSUxJQS1GQU1FTUEaRklURVNQLUpPU0UgR09NRVMgREEgU0lMVkEeRlVORC5BTVBBUk8gUEVTUS5FU1QuU1AtRkFQRVNQHkZVTkQuQ09OUy5QUk9ELkZMT1JFU1RBTCBFLlNQLhxGVU5ELk1FTU9SSUFMIEFNRVJJQ0EgTEFUSU5BHUZVTkQuUEFSUVVFIFpPT0xPR0lDTyBTLlBBVUxPHkZVTkQuUEUuQU5DSElFVEEtQy5QLlJBRElPIFRWLh1GVU5ELlBGLkRSLk0uUC5QSU1FTlRFTC1GVU5BUB5GVU5ELlBSRVYuQ09NUEwuRVNULlNQIFBSRVZDT00eRlVORC5QUk8tU0FOR1VFLUhFTU9DRU5UUk8gUy5QHEZVTkQuUkVNLlBPUC4gQy5ULkxJTUEgLUZVUlAeRlVORC5TSVNULkVTVC5BTkFMLkRBRE9TLVNFQURFHkZVTkQuVU4uVklSVFVBTCBFU1QuU1AgVU5JVkVTUBFGVU5EQUNBTyBDQVNBLVNQLhxGVU5EQUNBTyBERVNFTlYuRURVQ0FDQU8tRkRFHUZVTkRBQ0FPIE9OQ09DRU5UUk8gU0FPIFBBVUxPD0ZVTkRBQ0FPIFBST0NPThZHQUJJTkVURSBETyBHT1ZFUk5BRE9SGkguQy5GQUMuTUVELkJPVFVDQVRVLUhDRk1CHUhDIEZBQyBNRURJQ0lOQSBSSUIgUFJFVE8gVVNQGUhPU1AuQ0xJTi5GQUMuTUVELk1BUklMSUEdSE9TUC5DTElOLkZBQy5NRUQuVVNQLUhDRk1VU1AeSU1QUi5PRklDSUFMIEVTVEFETyBTLkEuIElNRVNQHklOU1QgTUVEIFNPQyBDUklNSU5PIFNQLSBJTUVTQx5JTlNULkFTLk1FRC5TRVJWLlAuRVNULiBJQU1TUEUeSU5TVC5QQUdUT1MuRVNQRUNJQUlTIFNQLUlQRVNQHklOU1QuUEVTT1MgTUVESUQuRS5TLlAtSVBFTS9TUB5JTlNULlBFU1EuVEVDTk9MT0dJQ0FTIEVTVC5TLlAdSlVOVEEgQ09NRVJDLkUuUy5QQVVMTy1KVUNFU1AeUEFVTElTVFVSIFNBLkVNUFIuVFVSLkVTVC5TLlAuGVBPTElDSUEgTUlMSVRBUiBTQU8gUEFVTE8cUFJPQ1VSQURPUklBIEdFUkFMIERPIEVTVEFETx5TQU8gUEFVTE8gUFJFVklERU5DSUEgLSBTUFBSRVYeU0VDLlRSQU5TUE9SVEVTIE1FVFJPUE9MSVRBTk9THlNFQ1IuQUdSSUNVTFRVUkEgQUJBU1RFQ0lNRU5UTx5TRUNSLkNVTFRVUkEgRUNPTk9NSUEgQ1JJQVRJVkEeU0VDUi5ERVNFTlZPTFZJTUVOVE8gRUNPTk9NSUNPHlNFQ1IuRVNULkRJUi5QRVMuQy9ERUZJQ0lFTkNJQR5TRUNSRVQgREUgUkVMQUNPRVMgRE8gVFJBQkFMSE8eU0VDUkVULkFETUlOSVNUUi5QRU5JVEVOQ0lBUklBHlNFQ1JFVC5TQU5FQU1FTlRPIFJFQy5ISURSSUNPUx1TRUNSRVRBUi5GQVpFTkRBIFBMQU5FSkFNRU5UTxZTRUNSRVRBUklBIERBIEVEVUNBQ0FPF1NFQ1JFVEFSSUEgREEgSEFCSVRBQ0FPE1NFQ1JFVEFSSUEgREEgU0FVREUdU0VDUkVUQVJJQSBERSBERVNFTlZPTFZJTUVOVE8WU0VDUkVUQVJJQSBERSBFU1BPUlRFUxVTRUNSRVRBUklBIERFIEdPVkVSTk8eU0VDUkVUQVJJQSBERSBMT0dJU1RJQ0EgRSBUUkFOFVNFQ1JFVEFSSUEgREUgVFVSSVNNTxtTRUNSRVRBUklBIERFU0VOVi4gUkVHSU9OQUweU0VDUkVUQVJJQSBFTkVSR0lBIEUgTUlORVJBQ0FPHVNFQ1JFVEFSSUEgSU5GLiBNRUlPIEFNQklFTlRFHlNFQ1JFVEFSSUEgSlVTVElDQSBFIENJREFEQU5JQRxTRUNSRVRBUklBIFNFR1VSQU5DQSBQVUJMSUNBHVNVUEVSSU5ULkNPTlRSLkVOREVNSUFTLVNVQ0VOKFNVUEVSSU5URU5ERU5DSUEgREUgQ09OVFJPTEUgREUgRU5ERU1JQVMVWwItMQExATIBMwE0ATUBNgE3ATgBOQIxMAIxMQIxMgIxMwIxNAIxNQIxNgIxNwIxOAIxOQIyMAIyMQIyMgIyMwIyNAIyNQIyNgIyNwIyOAIyOQIzMAIzMQIzMgIzMwIzNAIzNQIzNgIzNwIzOAIzOQI0MAI0MQI0MgI0MwI0NAI0NQI0NgI0NwI0OAI0OQI1MAI1MQI1MgI1MwI1NAI1NQI1NgI1NwI1OAI1OQI2MAI2MQI2MgI2MwI2NAI2NQI2NgI2NwI2OAI2OQI3MAI3MQI3MgI3MwI3NAI3NQI3NgI3NwI3OAI3OQI4MAI4MQI4MgI4MwI4NAI4NQI4NgI4NwI4OAI4OQI5MBQrA1tnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnFgFmZAIHDxBkEBUBBVRPRE9TFQECLTEUKwMBZxYBZmQCCQ8QDxYGHwAFC1NJVFVBQ0FPX0lEHwEFDVNJVFVBQ0FPX0RFU0MfAmdkEBUEBVRPRE9TC0FQT1NFTlRBRE9TBkFUSVZPUwxQRU5TSU9OSVNUQVMVBAItMQExATIBMxQrAwRnZ2dnFgFmZAILDw9kFgIeCm9uS2V5UHJlc3MFJ3JldHVybiBNYXNjYXJhTW9lZGEodGhpcywnLicsJywnLGV2ZW50KWQCDQ8PZBYCHwMFJ3JldHVybiBNYXNjYXJhTW9lZGEodGhpcywnLicsJywnLGV2ZW50KWQCFQ9kFgJmD2QWBAIBDxYCHgdWaXNpYmxlaGQCAw8PFgIfBGhkFgICAw88KwARAgEQFgAWABYADBQrAABkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQxpbWdFeHBvcnRUeHQFBGdyaWQPZ2RQPxWdkKW2N7k2sc3cRkrsKaN6oX%2FYV5km4LhQ5LBTcA%3D%3D&__VIEWSTATEGENERATOR=E42B1F40&__EVENTVALIDATION=%2FwEdAG7zLJ4CWjEZheF5kVSEbhUBha8fMqpdVfgdiIcywQp19AS0oC9%2BkRn5wokBQj%2BYmSdj%2FRE4%2FVY2xVooDbyNylWSFXsupcqZ9EYohXUHrvyuvszqcPgWZLCNPbx1As5K6XI8YfiXwzc6jdd6doCEWNMhfUq2YkY3rbVwieJI30sGRBiYwU43rbtypsxax6Lexvr9tn%2FppXosAOoaLiPglbLZDQ4AHCggkRiV1y9R5Jk3hxzIBiDVeBd4ex%2FDPERS7Y3hxS83fVJEzO6I%2BsKPdRPTZbKZKzZ%2FiI%2Fo2LERffiPWbY0qpjFHBt23vPUuehVkAOA1ngNB93rbK%2Bu0E54XcLAmWLN%2Fl%2Bz5m0ApRDNS4L3FwTfILDr1aT4Crd1%2F2X2tGTSlHv5v4gI%2B%2F4UxQdVOOXcJIWT3hhEHPLkfTczdhS%2BJPFzCLQyhLlM%2FTIkVLdCEWiXz8XDG1%2BqV0wHjm1sFCkHt5aLy6yjxTyv1FFML9B%2Fo0JBJO%2By%2B74vfDQlvwQWQHtswD%2Bjri2Ja0FbYTVaHetzL3nIpMtKnzHrJejZWNnngPadPS2744kvbqzTJQaAdqOeYy%2FXyO581zGaQB16a5HkpT5jddxT22MOtOJS9%2BOuUHRXp8dj268DwFDqeWohT0vm1b0FOlCVjyi8V9MKHPYPpHgZ%2F2GzcT5zaEXX3Wa7dGMCaXmo3KMrfSTIEMtzpixzPEyfillVBjlMq8fiaJmavKW63uZc65AHMJEgzJBWOOnY33pftn93IOwZzZWV8DBA7v%2F9aPpqFJWx65SrmQqSjTKR9Q8znWzwmOcZE4%2FSuTP7i%2BXb7NoOWr4anBMJ9L8iQIpPyUdRVhTh0dqpW9mg677VkTJzeFDr78YgZsAwP%2FX%2BdTV%2FINjSEi5I3GKGi7myZ7%2BjeKd7PDtAjn8O4hLTJfL4LFg4Nvwdmd%2F53R8Jw4b9e%2FlLobx4zXIq3GAuywAjOQvHY8AEnfNd%2FlXdKYxyzc%2FwfpCNJupjNVpUse2VJD4oS1BuBPCBdQ5aaErF4JFlItPtLQCYFzs0jfHra3vGXa5DUmVxUHX61STePVHIx%2Bb2IzWzaVJbMWnr0ySeyyy%2FZ1AEi%2FGyAY4VRi7gupaG4KIpRnL0PqiHkB0m%2BFOAGOzlYyAzkRO1hwDnOQf3fkyzTk8GPsW4ORs6zPd%2BeDosaOUhW1MEtWA%2BSqsohtmqkoKbjumKVbQvus3TM3adBbzpeRPEjnLNywu7OwRAhFtyU0gmtXU9am1kuUbvzTaW93G%2FXW5pJhxIEGLJ46ijUCocW5ypp1AUfwUVaLtxxktia9eKFUCg16rKs9CfE8mQS1sJL8sXrl1kCYgl357rWaG95jfZ509s%2Bm2fA%2BOt0aP8OyaOU4R1ht8FAaoUaukJi9ac%2B52YAhiIATqgCuAVAUaz6iVZ30v9i3l79pG%2FQjT0yzItrPhgpeaj5FDDRNwFWQfE5v7dhuWXa0fqNuT0%2F3rHd8yAI%2FR31smXtVMpuDg4uNPHIl%2B2FxKOozxg%2Fv%2B%2BE9d%2FZoPPgEhC0wqwEcy5cuqQMsS7I2iwe1Xfp9TBV2uBNFpR3V1ws1NcSb0O892YPaDPsxrja2GQM7SzAShZDNlCOSW7Tt%2Fu0g%2BeirEQ%2FlwLvd%2FyO3h%2FPXkp4oZAfoeCSWuKxs7UkSXX7piPjdZRkxS8%2B1Tv52TtsW%2F%2FarETeAIdqgWD21SCG%2F%2BSG%2FyFJtRwUalOOSCKwgXmjHLagrrOpyOVvrzcda9t4I8AvfZJNBX4HCyHl%2F8v7zlaXsN6v3xdx7SBYcgTu1GewkDpUJSUGbiJpTFb9FwFesoo5ATV8LN38tAuINPU8rfSikTUmdlp8CARYKFn95WsBdjs1x8c6lK59jnQ%2FQHi2nKDMKfdQRVhcvnFwvt6SokCFQDX7AEtmU9OC%2Fkwe5SIcBU04jVZdwLiKogB2pPql%2FnA4CHA7mEf3AIr0wLOnRAQ0xjhC3PXHrIjjpV2suu3zMJ7LscXSxIToHr95TxJTzSEj9C7XyN%2FGMISH%2FTKb%2FPRxrbwGTEZF3x922wvTvFKuuxNUJFB79U3ZPxLws5iIazIlee0zV3InWYYPP26JIa5R0Em8ORb%2B%2FoUDlJKcdv6NoWV%2F5WtCyREa2Rxke5ZukLmT7xiWinv8jrwbnAz1AUaMm8xKsc4G6dNWu2jHrgAaNFlmOLZIeG0OTsyPhh%2B%2F0WQdOTAD9zAblcx6VvMEe43r2g9sGn75bO7ZW6nZ7hGBjKUqSH4S7Qy5ngR%2FiduIfdzD0oNgNO6zlZmgx%2BPVHfpxvG%2B1lXBZBLAe6JyY9%2FwY3j6%2BMGuruxn5MX0jsPeyBXK401Kwjl8g4KbJ6y3JnlYwpVFE%2BxaAvUaNHQI16ZHBEZs26yaBXQzbLC2jFI6XXFnHVbAsVbJ&txtNome=&Place=-1&Position=-1&situacao=-1&txtDe=&txtAte=&hdInicio=&hdFinal=&hdPaginaAtual=&hdTotal=&imgExportTxt.x=15&imgExportTxt.y=22`)
	req, err := http.NewRequest("POST", "http://www.transparencia.sp.gov.br/PortalTransparencia-Report/Remuneracao.aspx", body)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.5")
	req.Header.Set("Referer", "http://www.transparencia.sp.gov.br/PortalTransparencia-Report/Remuneracao.aspx")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Cookie", "ASP.NET_SessionId=jq2ser3k5kslyjkore4fvplw")
	req.Header.Set("Upgrade-Insecure-Requests", "1")

	log.Println("Iniciando download")

	//Faz a requisição
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	log.Println("Download finalizado")

	// Cria arquivo
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}

	log.Println("Salvando localmente")
	// Escreve o CSV no arquivo
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	// Descompacta
	newFile, err := Unrar(filepath, actualPath)
	if err != nil {
		return err
	}

	// Importa para o banco
	err = importCSVMultiThread(newFile)
	if err != nil {
		return err
	}

	log.Println(newFile, filepath)
	// Remove arquivos
	err = os.Remove(newFile) //
	if err != nil {
		return err
	}
	out.Close()
	err = os.Remove(filepath)
	if err != nil {
		return err
	}

	log.Println("Finalizando BaixarCSV")
	lockAgents = 'N'
	return err
}

// Unrar will decompress a zip archive, moving all files and folders
// within the rar file (parameter 1) to an output directory (parameter 2).
func Unrar(src string, dest string) (string, error) {
	log.Println("Descompactando arquivo " + src)
	r, err := unarr.NewArchive(src)
	if err != nil {
		return "", err
	}
	defer r.Close()

	err = r.Extract(dest)
	if err != nil {
		panic(err)
	}

	err = r.Extract("")
	if err != nil {
		panic(err)
	}

	err = os.Rename("remuneracao.txt", "remuneracao.csv")

	return "remuneracao.csv", err
}

// Importa CSV de funcionários publicos para dentro do banco de dados
func importCSV(src string) error {

	log.Println("Abrindo conexão com o banco para importar")
	db, err := initDB()
	if err != nil {
		return err
	}
	defer db.Close()

	log.Println("Limpando tabela public_agent")

	// Limpa a tabela
	sql := "delete from public_agent"
	_, err = db.Exec(sql)
	if err != nil {
		return err
	}

	seq, err := nextSeqSequence(db, "lote_agent")
	if err != nil {
		return err
	}
	// Abrindo arquivo
	f, err := os.Open(src)
	if err != nil {
		return err
	}
	defer f.Close()

	log.Println("Iniciando leitura do arquivo")
	// Inicia leitura do CSV
	r := csv.NewReader(bufio.NewReader(f))

	r.Read()      //retira cabeçalho
	r.Comma = ';' //altera separador

	// apenas alfa-numericos e espaços
	reg, err := regexp.Compile("[^a-zA-Z0-9 ]+")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Iniciando transação")
	// Abre transação
	trc, _ := db.Begin()

	// Iteração pelo arquivo
	for {
		record, err := r.Read()

		if err == io.EOF {
			break
		}

		// Ajustando o separador de valor
		s := strings.Replace(record[3], ",", ".", -1)
		salario, err := strconv.ParseFloat(s, 64) //converte pra float

		// Objeto temporario
		fTemp := FuncPublico{
			Name:     reg.ReplaceAllString(record[0], ""),
			Position: reg.ReplaceAllString(record[1], ""),
			Place:    reg.ReplaceAllString(record[2], ""),
			Salary:   salario}

		// Insert na tabela, se tiver conflito não faz nada
		sql := "insert into public_agent as v (name, position, place, salary, id_lote) values ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT public_agent_pkey DO nothing"
		_, err = trc.Exec(sql, fTemp.Name, fTemp.Position, fTemp.Place, fTemp.Salary, seq)
		if err != nil {
			trc.Rollback()
			return err
		}

		updateSQL := `UPDATE clients 
			set salary = $1,
				position = $2,
				place = $3,
				is_special = true,
				lote_id = (case when is_special = false then $4 else lote_id end)
			where name = $5`

		_, err = trc.Exec(updateSQL, fTemp.Salary, fTemp.Position, fTemp.Place, seq, fTemp.Name)
		if err != nil {
			trc.Rollback()
			return err
		}

	}
	err = trc.Commit()
	log.Println("Commit efetuado")

	return err
}

// Importa CSV multithread
func importCSVMultiThread(src string) error {

	log.Println("Abrindo conexão com o banco para importar")
	db, err := initDB()
	if err != nil {
		return err
	}
	defer db.Close()

	log.Println("Limpando tabela public_agent")

	// Limpa a tabela
	sql := "delete from public_agent"
	_, err = db.Exec(sql)
	if err != nil {
		return err
	}

	seq, err := nextSeqSequence(db, "lote_agent")
	if err != nil {
		return err
	}

	// Abrindo arquivo
	f, err := os.Open(src)
	if err != nil {
		return err
	}
	defer f.Close()

	log.Println("Iniciando leitura do arquivo")
	// Inicia leitura do CSV
	r := csv.NewReader(bufio.NewReader(f))
	r.Comma = ';' //altera separador

	r.Read() //retira cabeçalho

	result, _ := r.ReadAll()

	log.Println(len(result))

	for i := 0; i < len(result); i += 100000 {
		resultSplit := result[i:min(i+100000, len(result))]
		wg.Add(1)
		go insertMultiThread(db, resultSplit, seq)
	}

	log.Println("Aguardando")
	wg.Wait()

	log.Println("Finalizado")
	return nil
}

func min(a, b int) int {
	if a <= b {
		return a
	}
	return b
}

func insertMultiThread(db *sql.DB, file [][]string, seq int) {
	// apenas alfa-numericos e espaços
	reg, err := regexp.Compile("[^a-zA-Z0-9 ]+")
	if err != nil {
		handleError(err)
	}

	log.Println("Iniciando transação")
	// Abre transação
	trc, _ := db.Begin()

	// Iteração pelo arquivo
	for i := 0; i < len(file); i++ {
		record := file[i]

		// Ajustando o separador de valor
		s := strings.Replace(record[3], ",", ".", -1)
		salario, err := strconv.ParseFloat(s, 64) //converte pra float

		// Objeto temporario
		fTemp := FuncPublico{
			Name:     reg.ReplaceAllString(record[0], ""),
			Position: reg.ReplaceAllString(record[1], ""),
			Place:    reg.ReplaceAllString(record[2], ""),
			Salary:   salario}

		// Insert na tabela, se tiver conflito não faz nada
		sql := "insert into public_agent as v (name, position, place, salary, id_lote) values ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT public_agent_pkey DO nothing"
		_, err = trc.Exec(sql, fTemp.Name, fTemp.Position, fTemp.Place, fTemp.Salary, seq)
		if err != nil {
			trc.Rollback()
			handleError(err)
		}

	}
	updateSQL := `UPDATE clients b
				set salary = (select c.salary from public_agent c where b.name = c.name),
					position = (select c.position from public_agent c where b.name = c.name),
					place = (select c.place from public_agent c where b.name = c.name),
					is_special = (select case when c.salary >= 20000  then true else false end  from public_agent c where b.name = c.name),
					lote_id = (case when is_special = false then $1 else lote_id end)
			where exists (select 1 from public_agent c where b.name = c.name)`

	_, err = trc.Exec(updateSQL, seq)
	if err != nil {
		trc.Rollback()
		handleError(err)
	}
	err = trc.Commit()
	log.Println("Commit efetuado")

	wg.Done()

	return
}

// Função responsável pelo envio de e-mail/notificação dos Leads
// Cria um arquivo CSV com os funcionários publicos que recebem
// mais de 20mil e não são clientes do banco.
// Envia o e-mail para todos os Users
func createEvents(option string) error {
	log.Println("Iniciando createEvents")

	fileName := "Leads.csv"

	log.Println("Abrindo conexão com o banco")
	db, err := initDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// Cria arquivo CSV com os leads
	qtdLeads, err := createCSVLeads(db, fileName, option)

	// Abre transação
	trc, _ := db.Begin()
	log.Println("Abrindo transação")

	// Pega o id do novo evento
	seq, err := nextSeq(db, "events", "id")
	if err != nil {
		trc.Rollback()
		return err
	}

	log.Println("Registrando evento")

	// Cria evento
	sql := `insert into events (id, qt_leads, created_on) values ($1, $2, now())`

	_, err = trc.Exec(sql, seq, qtdLeads)
	if err != nil {
		trc.Rollback()
		return err
	}

	log.Println("Registrando leads")

	// Registra os leads no evento
	sql = `insert into events_leads (id, name, event_id, created_on)
			select nextval(pg_get_serial_sequence('events_leads', 'id')),
				a.name,
				$1,
				now()
			from public_agent a
			where a.salary >= 20000 and not exists (select 1 from clients b where b.name = a.name)`

	_, err = trc.Exec(sql, seq)
	if err != nil {
		trc.Rollback()
		return err
	}

	log.Println("Commitando transação")
	trc.Commit()

	// Envia e-mail para os usuários registrados, com o arquivo em anexo
	err = sentEmailUsers(db, fileName)
	handleError(err)

	log.Println("Apagando arquivo")
	err = os.Remove(fileName)
	handleError(err)

	sql = `Insert into events_to (id, events_id, user_id, sent_at)
			select nextval(pg_get_serial_sequence('events_to', 'id')),
				$1,
				a.id,
				now()
			from users a`
	_, err = db.Exec(sql, seq)
	handleError(err)

	return err
}

func schedulerAgents() error {
	err := baixarCSV()
	if err != nil {
		return err
	}
	err = createEvents("full")
	return err
}

// Função auxiliar que envia o e-mail
func sentEmailUsers(db *sql.DB, attachment string) error {
	log.Println("Montando e-mail")
	m := email.NewMessage("Leads", "Prezados, segue em anexo os leads da semana")
	m.From = mail.Address{Name: "From Banco Uati", Address: "vani.gabr@gmail.com"}

	emails, err := emailUsers(db)
	//emails = append(emails, "gabriel.vani@hospitalbaiasul.com.br")
	//emails = append(emails, "rafa.pgcavalcante@gmail.com")
	m.To = emails

	log.Println("Anexando arquivo")
	// add attachments
	if err = m.Attach(attachment); err != nil {
		return err
	}

	log.Println("Enviando e-mail")
	// send it
	auth := smtp.PlainAuth("", os.Getenv("email"), os.Getenv("senha"), os.Getenv("host"))
	if err := email.Send(os.Getenv("hostfull"), auth, m); err != nil {
		return err
	}
	log.Println("E-mail enviado com sucesso")

	return nil
}

// Função auxiliar que cria CSV, caso option seja igual à not_full, ele só vai enviar os leads
// que não tiveram e-mail enviado na ultima semana
func createCSVLeads(db *sql.DB, fileName string, option string) (int, error) {

	sql := `select a.name, a.position, coalesce(a.place, 'N/I'), a.salary
	from public_agent a
	where a.salary >= 20000 and not exists (select 1 from clients b where b.name = a.name)`

	if option == "not_full" {
		sql = sql + `and not exists (select 1 from events_to c where c.name = a.name and c.created_on between (now() - interval '7 DAY') and now())`
	}
	//and $1 = '' or`

	rows, err := db.Query(sql)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	log.Println("Criando cSV")
	// Cria CSV
	csvfile, err := os.Create(fileName)
	if err != nil {
		return 0, err
	}
	defer csvfile.Close()

	csvwriter := csv.NewWriter(csvfile)
	csvwriter.Comma = ';' //altera separador
	// Cabeçalho
	_ = csvwriter.Write([]string{"Name", "Position", "Plane", "Salary"})

	qtdLeads := 0

	log.Println("Registrando leads no arquivo")
	// Recupera dados do banco e cria CSV
	for rows.Next() {
		//Qtd de linhas
		qtdLeads++

		var funcp FuncPublico

		rows.Scan(&funcp.Name, &funcp.Position, &funcp.Place, &funcp.Salary)

		// Cria linha
		row := []string{funcp.Name, funcp.Position, funcp.Place, fmt.Sprintf("R$%.2f", funcp.Salary)}
		_ = csvwriter.Write(row)

	}
	// Finzaliza arquivo
	csvwriter.Flush()
	return qtdLeads, nil
}

// Função para lidar com o erro
func handleError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// Função auxiliar que retorna os e-mails dos users
func emailUsers(db *sql.DB) ([]string, error) {
	var emails []string

	sql := `select email from users where is_active IS DISTINCT FROM 'N' and email is not null and email <> '' and email like '%@%'`

	rows, err := db.Query(sql)
	if err != nil {
		return emails, err
	}
	for rows.Next() {
		var email string
		rows.Scan(&email)
		emails = append(emails, email)
	}

	return emails, nil
}

// Função auxiliar que retorna verdadeiro ou falso para o select enviado
func rowExists(query string, db *sql.DB, args ...interface{}) bool {
	var exists bool
	query = fmt.Sprintf("SELECT exists (%s)", query)
	err := db.QueryRow(query, args...).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		fmt.Printf("ERRO checando se existe '%s' %v", args, err)
	}
	return exists
}

// Função auxiliar que pega o próximo valor de ID da tabela <table>
func nextSeq(db *sql.DB, table string, column string) (int, error) {
	// Pega o próximo ID da tabela, recebe a conexão do banco, a tabela e o campo que é a ID
	sql := `SELECT nextval(pg_get_serial_sequence('` + table + `', '` + column + `'));`

	row, err := db.Query(sql)
	if err != nil {
		return 0, err
	}
	var seq int
	row.Next()

	row.Scan(&seq)

	return seq, nil

}

// Função auxiliar que pega o próximo valor de ID da tabela <table>
func nextSeqSequence(db *sql.DB, sequence string) (int, error) {
	// Pega o próximo ID da sequence
	sql := `SELECT nextval('` + sequence + `');`

	row, err := db.Query(sql)
	if err != nil {
		return 0, err
	}
	var seq int
	row.Next()

	row.Scan(&seq)

	return seq, nil

}

// Importa CSV multithread
func importCSVMultiThreadAntigo(src string, mes string) error {

	log.Println("Abrindo conexão com o banco para importar")
	db, err := initDB()
	if err != nil {
		return err
	}
	defer db.Close()

	seq, err := nextSeqSequence(db, "lote_agent")
	if err != nil {
		return err
	}

	// Abrindo arquivo
	f, err := os.Open(src)
	if err != nil {
		return err
	}
	defer f.Close()

	log.Println("Iniciando leitura do arquivo")
	// Inicia leitura do CSV
	r := csv.NewReader(bufio.NewReader(f))
	r.Comma = ';' //altera separador

	r.Read() //retira cabeçalho

	result, _ := r.ReadAll()

	log.Println(len(result))

	for i := 0; i < len(result); i += 100000 {
		resultSplit := result[i:min(i+100000, len(result))]
		wg.Add(1)
		go insertMultiThreadAntigo(db, resultSplit, seq, mes)
	}

	log.Println("Aguardando")
	wg.Wait()

	log.Println("Finalizado")
	return nil
}

func insertMultiThreadAntigo(db *sql.DB, file [][]string, seq int, mes string) {
	// apenas alfa-numericos e espaços
	reg, err := regexp.Compile("[^a-zA-Z0-9 ]+")
	if err != nil {
		handleError(err)
	}

	log.Println("Iniciando transação")
	// Abre transação
	trc, _ := db.Begin()

	// Iteração pelo arquivo
	for i := 0; i < len(file); i++ {
		record := file[i]

		// Ajustando o separador de valor
		s := strings.Replace(record[3], ",", ".", -1)
		salario, err := strconv.ParseFloat(s, 64) //converte pra float

		// Objeto temporario
		fTemp := FuncPublico{
			Name:     reg.ReplaceAllString(record[0], ""),
			Position: reg.ReplaceAllString(record[1], ""),
			Place:    reg.ReplaceAllString(record[2], ""),
			Salary:   salario}

		// Insert na tabela, se tiver conflito não faz nada
		sql := "insert into public_agent_antigo as v (name, position, place, salary, id_lote, mes_ref) values ($1, $2, $3, $4, $5, $6) ON CONFLICT ON CONSTRAINT public_agent_antigo_un DO nothing"
		_, err = trc.Exec(sql, fTemp.Name, fTemp.Position, fTemp.Place, fTemp.Salary, seq, mes)
		if err != nil {
			trc.Rollback()
			handleError(err)
		}

	}
	err = trc.Commit()
	log.Println("Commit efetuado")

	wg.Done()

	return
}
