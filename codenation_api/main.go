package main

import (
	"bufio"
	"database/sql"
	"encoding/csv"

	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jasonlvhit/gocron"
	"github.com/joho/godotenv"

	"github.com/gin-contrib/cors"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/lib/pq"
)

func setupRouter() *gin.Engine {

	// Loga para arquivo
	gin.DefaultWriter = io.MultiWriter(logFile, os.Stdout)

	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	r.Use(cors.Default())

	r.POST("/login", Login) // Requisição do login inicial

	// Para acessar esse grupo, precisa enviar na requisição o user: admin e pass: admin, modelo basic auth
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"admin": "admin",
	}))

	// Usuários
	authorized.GET("users", getUsers)              // Recupera usuários
	authorized.POST("users", registerUser)         // Registra usuário
	authorized.PUT("users/:user", updateUser)      // Atualiza usuário :id
	authorized.DELETE("users/:user", inactiveUser) // Inativa usuário :id

	// Clientes
	authorized.POST("clients", uploadCliente) // Carrega clientes do arquivo
	authorized.GET("clients", getClientes)    // Get Clientes

	authorized.POST("publicagents", updatePublicAgents) //Atualiza funcionários publicos
	authorized.POST("events", sentEmail)                // Cria evento e envia e-mail

	authorized.GET("events", getEvents)       // Get notificações
	authorized.GET("events/:id", getEventsID) // Get notificação ID específica
	authorized.GET("leads/:id", getLeadsID)   // get leads da notificação ID
	authorized.GET("leads", getLeads)         // Get actual leads
	authorized.GET("fastleads", getLeadsFast) // Just first 50 leads

	authorized.GET("dashboard", getStatistic) // Get statistics to dashboard
	// add qtd total clientes 20k+

	// Verificar Docker

	// Rota para criar administrador
	authorized.POST("admin", registerAdministrator)

	return r
}

func main() {

	handleError(godotenv.Load()) // Load env variables

	// Configura log para arquivo
	wrt := io.MultiWriter(os.Stdout, logFile)
	log.SetOutput(wrt)
	defer logFile.Close()

	err := createDB()
	handleError(err)

	go initPublicAgents()

	s := gocron.NewScheduler()
	// Toda segunda às 07:30 ele vai disparar a função que baixa e importa o CSV dos funcionários publicos de SP
	s.Every(1).Monday().At("07:30").Do(schedulerAgents)
	s.Start()

	r := setupRouter()

	r.Run(":" + os.Getenv("port"))

	//err = importCSVMultiThread("remuneracao.csv")
	//handleError(err)

}

func getEvents(c *gin.Context) {
	log.Println("Iniciando getEvents")

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	sql := `select 
			et.events_id,
			u."name",
			u.email,
			e.qt_leads,
			to_char(DATE(et.sent_at), 'DD/MM/YYYY') dt_send,
			extract(hour from et.sent_at)||':'||rpad(to_char(et.sent_at, 'MI'),2,'0') hr_send
		from events_to et 
		join events e on e.id = et.events_id
		join users u on u.id = et.user_id
		order by et.events_id desc, u.name asc`

	log.Println("Verificando se existe algum evento")
	// Valida se já existe usuário ativo com esse email
	if !rowExists(sql, db) {
		log.Println("Nenhum evento encontrado")
		c.JSON(http.StatusNoContent, gin.H{"message": "Nenhum evento encontrado"})
		return
	}

	log.Println("Recuperando eventos")

	rows, err := db.Query(sql)
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	var Evts []Events

	for rows.Next() {
		evt := new(Events)
		rows.Scan(&evt.ID, &evt.Name, &evt.Email, &evt.QtLeads, &evt.DtEnvio, &evt.HrEnvio)
		Evts = append(Evts, *evt)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, Evts)
}

func getEventsID(c *gin.Context) {
	log.Println("Iniciando getEventsId")

	id := c.Param("id")
	log.Println("Carregando ID")

	if len(id) == 0 {
		log.Println("ID não localizado")
		c.JSON(http.StatusBadRequest, gin.H{"message": "ID não informado"})
		return
	}

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	sql := `select 
			et.events_id,
			u."name",
			u.email,
			e.qt_leads
		from events_to et 
		join events e on e.id = et.events_id
		join users u on u.id = et.user_id
		where et.events_id = $1
		order by et.events_id desc, u.name asc`

	log.Println("Verificando se existe algum evento")
	// Valida se já existe usuário ativo com esse email
	if !rowExists(sql, db, id) {
		log.Println("Nenhum evento encontrado")
		c.JSON(http.StatusNoContent, gin.H{"message": "Nenhum evento encontrado"})
		return
	}

	log.Println("Recuperando eventos")

	rows, err := db.Query(sql, id)
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	var Evts []Events

	for rows.Next() {
		evt := new(Events)
		rows.Scan(&evt.ID, &evt.Name, &evt.Email, &evt.QtLeads)
		Evts = append(Evts, *evt)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, Evts)
}

func getLeadsID(c *gin.Context) {
	log.Println("Iniciando getLeadsId")

	id := c.Param("id")
	log.Println("Carregando ID")

	if len(id) == 0 {
		log.Println("ID não localizado")
		c.JSON(http.StatusBadRequest, gin.H{"message": "ID não informado"})
		return
	}

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	sql := `select 
				f."name",
				f."position",
				f.place,
				f.salary
			from events e 
			join events_leads el on el.event_id = e.id
			join public_agent f on f."name" = el."name"
			where e.id = $1
			order by f.name asc`

	log.Println("Verificando se existe algum lead")
	// Valida se já existe usuário ativo com esse email
	if !rowExists(sql, db, id) {
		log.Println("Nenhum lead encontrado")
		c.JSON(http.StatusNoContent, gin.H{"message": "Nenhum lead encontrado"})
		return
	}

	log.Println("Recuperando Leads")

	rows, err := db.Query(sql, id)
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	var FPs []FuncPublico

	for rows.Next() {
		fp := new(FuncPublico)
		rows.Scan(&fp.Name, &fp.Position, &fp.Place, &fp.Salary)
		FPs = append(FPs, *fp)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, FPs)
}

func getLeads(c *gin.Context) {
	log.Println("Iniciando getLeads")

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	sql := `select 
				f."name",
				f."position",
				f.place,
				f.salary
			from  public_agent f 
			where not exists (select 1 from clients c where c.name = f.name)
			and f.salary > 20000
			order by f.name asc`

	log.Println("Verificando se existe algum lead")
	// Valida se já existe usuário ativo com esse email
	if !rowExists(sql, db) {
		log.Println("Nenhum lead encontrado")
		c.JSON(http.StatusNoContent, gin.H{"message": "Nenhum lead encontrado"})
		return
	}

	log.Println("Recuperando Leads")

	rows, err := db.Query(sql)
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	var FPs []FuncPublico

	for rows.Next() {
		fp := new(FuncPublico)
		rows.Scan(&fp.Name, &fp.Position, &fp.Place, &fp.Salary)
		FPs = append(FPs, *fp)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, FPs)
}

func getLeadsFast(c *gin.Context) {
	log.Println("Iniciando getLeadsFast")

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	sql := `select 
				f."name",
				f."position",
				f.place,
				f.salary
			from  public_agent f 
			where not exists (select 1 from clients c where c.name = f.name)
			and f.salary > 20000
			order by f.name asc
			limit 50`

	log.Println("Verificando se existe algum lead")
	// Valida se já existe usuário ativo com esse email
	if !rowExists(sql, db) {
		log.Println("Nenhum lead encontrado")
		c.JSON(http.StatusNoContent, gin.H{"message": "Nenhum lead encontrado"})
		return
	}

	log.Println("Recuperando Leads")

	rows, err := db.Query(sql)
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	var FPs []FuncPublico

	for rows.Next() {
		fp := new(FuncPublico)
		rows.Scan(&fp.Name, &fp.Position, &fp.Place, &fp.Salary)
		FPs = append(FPs, *fp)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, FPs)
}

// Registra usuário no banco (que irá receber o alerta)
func registerUser(c *gin.Context) {
	log.Println("Registrando usuário")
	usrs := &Users{}
	// Junta JSON com a struct
	c.BindJSON(&usrs)

	log.Println("Validando se o e-mail foi recebido")
	// Valida e-mail
	if usrs.Email == "" {
		log.Println("tag email não recebido no json")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados obrigatórios não recebidos"})
		return
	}

	log.Println("Abrindo conexão com o banco")
	// Abre conexão com o banco
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	log.Println("Verificando se existe outro usuário ativo com esse e-mail")
	// Valida se já existe usuário ativo com esse email
	if rowExists("SELECT id FROM users WHERE email=$1 and is_active IS DISTINCT FROM 'N'", db, usrs.Email) {
		log.Println("Email já cadastrado")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Email já cadastrado"})
		return
	}

	log.Println("Inserindo usuário")
	// Insere
	_, err = db.Exec("INSERT INTO users (name, email,position, created_on) VALUES ($1, $2,$3, now())", usrs.Name, usrs.Email, usrs.Position)
	if err != nil {
		log.Println("Erro ao inserir usuário")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	log.Println("Usuário inserido com sucesso")
	// Retorna OK
	c.JSON(http.StatusCreated, gin.H{"message": "Usuário inserido"})
}

// Login recebe um JSON com o usuario e senha do banco e valida os mesmos
func Login(c *gin.Context) {
	log.Println("Iniciando login")
	creds := &Credentials{}
	c.BindJSON(&creds)

	// Valida se a msg está correta
	if creds.Username == "" || creds.Password == "" {
		log.Println("Dados obrigatórios não recebidos")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Dados obrigatórios não recebidos"})
		return
	}

	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	log.Println("Consulta no banco de dados")
	// Recupera senha
	row := db.QueryRow("SELECT password FROM administrators WHERE username=$1", creds.Username)

	storedCreds := &Credentials{}
	err = row.Scan(&storedCreds.Password) // guardando a passw para comparar
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Usuário não encontrado")
			c.JSON(http.StatusUnauthorized, gin.H{"message": "usuário não encontrado."})
			return
		}
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	log.Println("Comparando senha")
	// Criptografa a senha informada e compara com a do banco
	err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password))

	if err != nil {
		log.Println("Senha incorreta")
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Senha incorreta"})
		return
	}

	log.Println("Autenticado")
	//se passou, passamos o usuario e senha
	c.JSON(http.StatusOK, gin.H{"user": "admin", "pass": "admin"})
}

// Registra administrador
func registerAdministrator(c *gin.Context) {
	log.Println("Iniciando registerAdministrator")

	creds := &Credentials{}
	c.BindJSON(&creds)

	hashpwd, err := bcrypt.GenerateFromPassword([]byte(creds.Password), hashCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Problemas para criptografar a senha."})
		return
	}

	db, err := initDB()
	_, err = db.Exec("INSERT INTO administrators (username, password, created_on) VALUES ($1, $2, now())", creds.Username, string(hashpwd))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "administrator created"})
}

// Recupera usuários que receberão os e-mails
func getUsers(c *gin.Context) {
	log.Println("Iniciando getUsers")

	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco de dados")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	log.Println("Consultando usuários")
	rows, err := db.Query("SELECT id, name, email, position FROM users where is_active IS DISTINCT FROM 'N' ORDER BY name")
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	usrs := []User{}

	for rows.Next() {
		usr := new(User)
		rows.Scan(&usr.ID, &usr.Name, &usr.Email, &usr.Position)
		usrs = append(usrs, *usr)
	}

	log.Println("Consulta finalizando, retornando")

	c.JSON(http.StatusOK, usrs)
}

// Recupera os clientes
func getClientes(c *gin.Context) {
	log.Println("Iniciando getClients")

	db, err := initDB()
	if err != nil {
		log.Println("Erro ao abrir conexão com o banco de dados")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	log.Println("Consultando clientes")

	rows, err := db.Query("SELECT id, name, salary, position, place, case when is_special = True then 'yes' else 'no' end as is_special FROM clients ORDER BY name")
	if err != nil {
		log.Println("Erro ao consultar")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer rows.Close()

	clients := []Clientes{}

	for rows.Next() {
		client := new(Clientes)
		rows.Scan(&client.ID, &client.Name, &client.Salary, &client.Position, &client.Place, &client.IsClient)
		clients = append(clients, *client)
	}

	log.Println("Retornando clientes")

	c.JSON(http.StatusOK, clients)
}

// Faz upload dos clientes (arquivo csv)
func uploadCliente(c *gin.Context) {
	log.Println("Iniciando uploadCliente")

	log.Println("Capturando arquivo 'file'")
	// Capturando arquivo com o ID file
	file, err := c.FormFile("file")
	if err != nil {
		log.Println("Arquivo não localizado")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "file not informed"})
		return
	}

	log.Println("Salvando arquivo localmento uploadClients.csv")
	// Salvando arquivo localmente
	err = c.SaveUploadedFile(file, "uploadClientes.csv")
	if err != nil {
		log.Println("Erro ao salvar arquivo")
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	log.Println("Carregando arquivo salvo")
	// Abrindo arquivo salvo
	f, err := os.Open("uploadClientes.csv")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer f.Close()

	//Abrindo conexão com o banco de dados
	db, err := initDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	// Abre transação
	trc, _ := db.Begin()

	log.Println("Iniciando leitura CSV")
	// Inicia leitura do CSV
	r := csv.NewReader(bufio.NewReader(f))

	log.Println("Inserindo clientes")
	//Iterando pelo arquivo
	for {
		record, err := r.Read()

		// Se fim de arquivo
		if err == io.EOF {
			break
		}

		// Se já existe aquele cliente, não faz nada
		if rowExists("SELECT id FROM clients WHERE name=$1", db, record[0]) {
			continue
		}

		sql := `INSERT INTO clients (name, position, place, salary, lote_id, is_special, created_on)
					select 
					$1,
					b.position,
					b.place,
					b.salary,
					b.id_lote,
					case when b.salary >= 20000  then true 
					else false
					end,
					now()
				from now()
				left join public_agent b on b.name = $2`
		// Insere cliente
		_, err = trc.Exec(sql, record[0], record[0])
		if err != nil {
			trc.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"message": err})
			return
		}
	}

	// Commit transação
	err = trc.Commit()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	log.Println("Clientes inseridos")
	c.JSON(http.StatusCreated, gin.H{"message": "Clientes inseridos."})
}

func updateUser(c *gin.Context) {
	log.Println("Iniciando updateUsers")
	id := c.Param("user")
	log.Println("Carregando ID")
	if len(id) == 0 {
		log.Println("ID não localizado")
		c.JSON(http.StatusBadRequest, gin.H{"message": "ID não informado"})
		return
	}
	var usrs User
	err := c.BindJSON(&usrs)
	if err != nil {
		log.Println("Erro ao dar o bind no Json")
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Erro ao decodificar JSON, verifique documentação dos tipos."})
		return
	}

	//Abrindo conexão com o banco de dados
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco de dados")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	log.Println("Realizando Update")
	res, err := db.Exec("UPDATE users SET name=$1, email=$2,position=$3 WHERE id=$4", usrs.Name, usrs.Email, usrs.Position, id)
	if err != nil {
		log.Println("Erro ao realizar o update")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.Println("Erro ao realizar update")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	if rows == 0 {
		log.Println("Nenhum usuário alterado com o ID informado")
		c.JSON(http.StatusOK, gin.H{"message": "Nenhum usuário alterado com o ID informado."})
		return
	}

	log.Println("Usuário alterado com sucesso")
	c.JSON(200, gin.H{"message": "Usuário alterado com sucesso"})

}

// Inativa usuário
func inactiveUser(c *gin.Context) {
	id := c.Param("user")

	//Abrindo conexão com o banco de dados
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco de dados")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	res, err := db.Exec("update users set is_active = 'N' WHERE id=$1", id)
	if err != nil {
		log.Println("Erro ao realizar update")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	rows, err := res.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	if rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Nenhum usuário inativado"})
		return
	}

	c.JSON(200, gin.H{"message": "Usuário inativado com sucesso"})

}

func updatePublicAgents(c *gin.Context) {
	log.Println("Iniciando rotina de atualização dos funcionários publicos")
	if lockAgents != 'S' {
		go func() {
			err := baixarCSV()
			if err != nil {
				log.Println(err)
				return
			}

		}()

		c.JSON(http.StatusOK, gin.H{"message": "Rotina iniciada em segundo plano"})
		return
	}
	log.Println("Rotina já em execução, abortado")
	c.JSON(http.StatusBadRequest, gin.H{"message": "Rotina já está executando em segundo plano, favor aguarde"})

}

func sentEmail(c *gin.Context) {
	log.Println("Iniciando rotina para criação e envio de eventos")

	go func() {
		err := createEvents("full")
		handleError(err)
		log.Println("Rotina finalizada")
	}()

	c.JSON(http.StatusCreated, gin.H{"message": "Rotina iniciada em segundo plano"})
}

func getStatistic(c *gin.Context) {
	log.Println("Iniciando getStatistic")

	Statistics := []Statistic{
		Statistic{
			Month:           "JAN",
			Clients:         98,
			Prospects:       15735,
			TotalSalProsp:   473809912.74,
			MaxSalProsp:     183947.11,
			MinSalProsp:     20001.14,
			AvgSalProsp:     30109.93,
			MedianSalProsp:  27512.12,
			ModeSalProsp:    23048.59,
			TotalSalClient:  454545.67,
			MaxSalClient:    20765.18,
			MinSalClient:    0,
			AvgSalClient:    4638.22,
			MedianSalClient: 3560.17,
			ModeSalClient:   2968.7,
		},
		Statistic{
			Month:           "FEV",
			Clients:         100,
			Prospects:       15720,
			TotalSalProsp:   472050828.03,
			MaxSalProsp:     201171.87,
			MinSalProsp:     20001.11,
			AvgSalProsp:     30024.85,
			MedianSalProsp:  27416.11,
			ModeSalProsp:    23048.59,
			TotalSalClient:  478221.47,
			MaxSalClient:    21899.52,
			MinSalClient:    440.56,
			AvgSalClient:    4782.21,
			MedianSalClient: 3616.62,
			ModeSalClient:   2968.7,
		},
		Statistic{
			Month:           "MAR",
			Clients:         99,
			Prospects:       15728,
			TotalSalProsp:   470930347.39,
			MaxSalProsp:     143402.74,
			MinSalProsp:     20000.06,
			AvgSalProsp:     29940.25,
			MedianSalProsp:  27357.55,
			ModeSalProsp:    23048.59,
			TotalSalClient:  456214.52,
			MaxSalClient:    20765.18,
			MinSalClient:    445.42,
			AvgSalClient:    4608.22,
			MedianSalClient: 3619.59,
			ModeSalClient:   2968.7,
		},
		Statistic{
			Month:           "ABR",
			Clients:         97,
			Prospects:       15797,
			TotalSalProsp:   471729657.37,
			MaxSalProsp:     143402.74,
			MinSalProsp:     20000.06,
			AvgSalProsp:     29860.08,
			MedianSalProsp:  27239.64,
			ModeSalProsp:    23048.59,
			TotalSalClient:  453071.01,
			MaxSalClient:    20765.18,
			MinSalClient:    445.42,
			AvgSalClient:    4670.83,
			MedianSalClient: 3619.59,
			ModeSalClient:   2968.7,
		},
		Statistic{
			Month:           "MAI",
			Clients:         98,
			Prospects:       16099,
			TotalSalProsp:   481586971.03,
			MaxSalProsp:     179844.96,
			MinSalProsp:     20000.06,
			AvgSalProsp:     29912.23,
			MedianSalProsp:  27156.56,
			ModeSalProsp:    23048.59,
			TotalSalClient:  454522.10,
			MaxSalClient:    20765.18,
			MinSalClient:    425.95,
			AvgSalClient:    4637.98,
			MedianSalClient: 3627.90,
			ModeSalClient:   2968.7,
		},
	}

	//Abrindo conexão com o banco de dados
	db, err := initDB()
	if err != nil {
		log.Println("Erro ao iniciar o banco de dados")
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}
	defer db.Close()

	if !rowExists("select 1 from clients", db) {
		log.Println("Sem informações para o dashboard")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Sem clientes para comparar."})
		return
	}

	log.Println("Trazendo statistics dos Prospects")
	// Statisticas dos Prospects
	sqlS := `select 
			count(a.name) qtd_pessoas,
			sum(coalesce(a.salary,0)) salario_total,
			max(coalesce(a.salary,0)) salario_maior,
			min(coalesce(a.salary,0)) salario_menor,
			round(avg(a.salary),2) salario_media,
			round(coalesce(median(a.salary),0),2) salario_mediana,
			round(mode() WITHIN GROUP (ORDER BY a.salary),2) salario_moda,
			'JUL' mes_ref
			from public_agent a
			where a.salary > 20000 and not exists( select 1 from clients b where b."name" = a."name")`

	row := db.QueryRow(sqlS)

	var tempStat Statistic

	err = row.Scan(&tempStat.Prospects, &tempStat.TotalSalProsp, &tempStat.MaxSalProsp, &tempStat.MinSalProsp, &tempStat.AvgSalProsp, &tempStat.MedianSalProsp, &tempStat.ModeSalProsp, &tempStat.Month)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	log.Println("Trazendo statistics dos Clientes")
	//Statistica dos clientes
	sqlS = `select 
		count(a.name) qtd_pessoas,
		sum(coalesce(a.salary,0)) salario_total,
		max(coalesce(a.salary,0)) salario_maior,
		min(coalesce(a.salary,0)) salario_menor,
		round(avg(coalesce(a.salary,0)),2) salario_media,
		round(median(coalesce(a.salary,0)),2) salario_mediana,
		round(mode() WITHIN GROUP (ORDER BY a.salary),2) salario_moda
		from public_agent a
		where exists( select 1 from clients b where b."name" = a."name")`

	row = db.QueryRow(sqlS)

	err = row.Scan(&tempStat.Clients, &tempStat.TotalSalClient, &tempStat.MaxSalClient, &tempStat.MinSalClient, &tempStat.AvgSalClient, &tempStat.MedianSalClient, &tempStat.ModeSalClient)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	Statistics = append(Statistics, tempStat)
	log.Println("Trazendo ranks")
	sqlS = `select
				coalesce(x.qtd_pessoas, 0) qtd_pessoas,
				COALESCE(x.salario_total, 0) salario_total,
				x.place,
				count(*) qtd_clientes,
				sum(coalesce(w.salary,0)) salario_clientes
			from(select	count(a.name) qtd_pessoas,
					sum(coalesce(a.salary,0)) salario_total,
					a.place
				from	public_agent a
				where	a.salary > 20000 and not exists(select	1 from	clients b	where	b."name" = a."name")
				group by	a.place
				order by 1 desc ,	2 desc
				limit 15 ) x
			join public_agent w on w.place = x.place
			where exists (	select 1	from	clients q where	q.name = w."name")
			group by x.qtd_pessoas,x.salario_total,x.place
			order by 1 desc ,	2 desc`

	var Ranks []Rank

	rows, err := db.Query(sqlS)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		return
	}

	for rows.Next() {
		var r Rank
		rows.Scan(&r.QtdProsp, &r.TotalSalProsp, &r.Place, &r.QtdClients, &r.TotalSalClient)
		Ranks = append(Ranks, r)
	}

	var HS = HeaderStats{Statistics, Ranks}

	log.Println("Finalizando")
	c.JSON(http.StatusOK, HS)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
