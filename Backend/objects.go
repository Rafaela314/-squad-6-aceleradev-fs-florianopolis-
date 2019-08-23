package main

import (
	"os"
	"sync"
	"time"
)

//PORT port to be used
const PORT = "8080"
const hashCost = 8
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "postgres"
)

var lockAgents = 'N'

var wg sync.WaitGroup

// Nome do arquivo de log
var logFile, _ = os.OpenFile("log_"+time.Now().Format("01-02-2006")+".log", os.O_RDWR|os.O_APPEND|os.O_CREATE, 0660)

// PF struct que guarda a pessoa fisica
type PF struct {
	Nome         string `json:"nm_pessoa_fisica"`
	CPF          string `json:"CPF"`
	DtNascimento string `json:"dt_nascimento"`
}

// FuncPublico guarda o funcionario antes de importar para o banco
type FuncPublico struct {
	Name     string  `json:"name,omitempty"`
	Position string  `json:"position,omitempty"`
	Place    string  `json:"place,omitempty"`
	Salary   float64 `json:"salary,omitempty"`
}

// User guarda o usuário antes de importar para o banco
type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Position string `json:"position"`
}

// Credentials estrutura para fazer login
type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

// Users estrutura que guarda os dados da tabela users
type Users struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Position string `json:"position"`
}

// Clientes estrutura que guarda os dados da tabela clients
type Clientes struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Salary   float64 `json:"salary"`
	Position string  `json:"position"`
	Place    string  `json:"place"`
	IsClient string  `json:"isSpecial"`
}

// Events estrutura que guarda os eventos
type Events struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	QtLeads int    `json:"qtLeads"`
	DtEnvio string `json:"dtEnvio"`
	HrEnvio string `json:"hrEnvio"`
}

// Statistic estrutura que guarda as estatísticas para o dashboard
type Statistic struct {
	Month           string  `json:"month"`
	Clients         int     `json:"clients"`
	Prospects       int     `json:"prospects"`
	TotalSalProsp   float64 `json:"totalSalProsp"`
	MaxSalProsp     float64 `json:"maxSalProsp"`
	MinSalProsp     float64 `json:"minSalProsp"`
	AvgSalProsp     float64 `json:"avgSalProsp"`
	MedianSalProsp  float64 `json:"medSalProsp"`
	ModeSalProsp    float64 `json:"modSalProsp"`
	TotalSalClient  float64 `json:"totalSalClient"`
	MaxSalClient    float64 `json:"maxSalClient"`
	MinSalClient    float64 `json:"minSalClient"`
	AvgSalClient    float64 `json:"avgSalClient"`
	MedianSalClient float64 `json:"medSalClient"`
	ModeSalClient   float64 `json:"modSalClient"`
}

// Rank orgãos
type Rank struct {
	Place          string  `json:"place"`
	TotalSalProsp  float64 `json:"totalSalProsp"`
	QtdProsp       int     `json:"qtdProps"`
	TotalSalClient float64 `json:"totalSalClient"`
	QtdClients     int     `json:"qtdClient"`
}

// HeaderStats cabeçalho da rota de estatística
type HeaderStats struct {
	Stats []Statistic `json:"statistics"`
	Rs    []Rank      `json:"ranks"`
}
