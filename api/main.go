package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

type Users struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type user struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func init() {
	err := godotenv.Load() //Load environmenatal variables
	checkError(err, "Não foi possível carregar o arquivo .env")
	jwtKey = []byte(os.Getenv("jwt_key"))
	port = os.Getenv("port")
}

func main() {
	log.Println("Server started on: http://localhost:" + port)
	initDB()
	defer closeDB()
	handlerRequests()
}

func handlerRequests() {
	router := mux.NewRouter()
	router.HandleFunc("/login", Login)
	router.HandleFunc("/clientsup", uploadCliente)
	router.Handle("/users", middleware(http.HandlerFunc(registerUser))).Methods("POST")
	router.Handle("/users", middleware(http.HandlerFunc(getUsers))).Methods("GET")
	http.ListenAndServe(":"+port, router)
}

func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), " ")

		if len(authHeader) < 2 {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte("Forbidden"))
			return
		}

		tknStr := authHeader[1]
		claims := &Claims{}

		tkn, _ := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if !tkn.Valid {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte("Forbidden"))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Login(w http.ResponseWriter, r *http.Request) {
	creds := &Credentials{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		fmt.Println("ERRO 400: dados inconsistentes.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if creds.Username == "" || creds.Password == "" {
		fmt.Println("ERRO 400: dados obrigatórios não recebidos.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	row := db.QueryRow("SELECT password FROM administradores WHERE username=$1", creds.Username)
	if err != nil {
		fmt.Println("ERRO 500: não foi possível conectar ao BD.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	storedCreds := &Credentials{}
	err = row.Scan(&storedCreds.Password) // guardando a passw para comparar
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("ERRO 401: usuário não encontrado.")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		fmt.Println("ERRO 500: não foi possível conectar ao BD.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password)); err != nil {
		fmt.Println("ERRO 401: senha incorreta.")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	//se passou, geramos o token
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Username: creds.Username,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		fmt.Println("ERRO 500: não foi possível gerar token.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write([]byte(tokenString))
}

func registerAdministrator(w http.ResponseWriter, r *http.Request) {
	creds := &Credentials{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		fmt.Println("ERRO 400: dados inconsistentes.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	hashpwd, err := bcrypt.GenerateFromPassword([]byte(creds.Password), hashCost)
	if err != nil {
		fmt.Println("ERRO 500: Problemas para criptografar a senha.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	_, err = db.Exec("INSERT INTO administradores (username, password, created_on) VALUES ($1, $2, now())", creds.Username, string(hashpwd))
	if err != nil {
		fmt.Println("ERRO 500: não foi possível conectar ao BD.", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func registerUser(w http.ResponseWriter, r *http.Request) {
	usrs := &Users{}
	err := json.NewDecoder(r.Body).Decode(usrs)
	if err != nil {
		fmt.Println("ERRO 400: dados inconsistentes.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if usrs.Email == "" {
		fmt.Println("ERRO 400: dados obrigatórios não recebidos.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if rowExists("SELECT id FROM usuarios WHERE email=$1", usrs.Email) {
		fmt.Println("ERRO 400: email já cadastrado.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err = db.Exec("INSERT INTO usuarios (name, email, created_on) VALUES ($1, $2, now())", usrs.Name, usrs.Email)
	if err != nil {
		fmt.Println("ERRO 500: não foi possível conectar ao BD.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, email FROM usuarios ORDER BY name LIMIT $1", 10)
	defer rows.Close()

	if err != nil {
		fmt.Println("ERRO 500: não foi possível conectar ao BD.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	usrs := []user{}

	for rows.Next() {
		usr := new(user)
		rows.Scan(&usr.ID, &usr.Name, &usr.Email)
		usrs = append(usrs, *usr)
	}
	response, _ := json.Marshal(usrs)
	w.Write(response)
}

func uploadCliente(w http.ResponseWriter, r *http.Request) {
	fmt.Println("POST")
	file, _, err := r.FormFile("clienteCSV")//aqui será um parametro
	if err != nil {
		fmt.Println("ERRO 400: nenhum arquivo encontrado.")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	defer file.Close()
	var resultsja [][]string
	reader := csv.NewReader(bufio.NewReader(file))
	t := 0
	j := 0
	i := 0
	record, err := reader.ReadAll()
	if err != nil {
		fmt.Println("ERRO 500: não foi possível ler o arquivo.")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	for _, line := range record {
		if rowExists("SELECT id FROM clientes WHERE name=$1", line[0]) {
			fmt.Println("Cliente já cadastrado.")
			resultsja = append(resultsja, line)
			j++
		} else {
			_, err = db.Exec("INSERT INTO clientes (name, created_on) VALUES ($1, now())", line[0])
			if err != nil {
				fmt.Println("ERRO 500: não foi possível conectar ao BD.")
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			i++
		}
		t++
	}
	fmt.Println("Total importado", t)
	fmt.Println("Já cadastrados", j)
	fmt.Println("Novos", i)
	//return resulsja
	//return OK???
}

func rowExists(query string, args ...interface{}) bool {
	var exists bool
	query = fmt.Sprintf("SELECT exists (%s)", query)
	err := db.QueryRow(query, args...).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		fmt.Printf("ERRO checando se existe '%s' %v", args, err)
	}
	return exists
}
