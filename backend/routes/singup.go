package signup

import (
	"encoding/json"
	"fmt"
	"net/http"

	. "github.com/cruedo/Eventor/db"
	"golang.org/x/crypto/bcrypt"
)

type Msg struct {
	Message string `json:"message"`
}

func isEmpty(args ...string) bool {
	for _, v := range args {
		if v == "" {
			return true
		}
	}
	return false
}

func exists(username, email string) bool {
	// Check if the provided arguments exists as a record in the database.
	// if they exist return true.
	rows, err := Database.Query("SELECT * FROM Users WHERE Username = ? OR Email = ?", username, email)
	if err != nil {
		fmt.Println(err)
		return true
	}
	defer rows.Close()
	return rows.Next()
}

func Signup(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := r.Form.Get("username")
	password1 := r.Form.Get("password1")
	password2 := r.Form.Get("password2")
	email := r.Form.Get("email")
	city := r.Form.Get("city")
	country := r.Form.Get("country")
	phone := r.Form.Get("phone")

	message := ""
	statusCode := http.StatusBadRequest

	switch {
	// username, email, city, country should NOT be null
	case isEmpty(username, password1, password2, email, city, country):
		// Return a 400 bad request !!
		message = "Please fill up all of the details"

	case password1 != password2:
		message = "Passwords do not match"

	// username and email should be unique
	case exists(username, email):
		message = "Username or email already exists"
		// Return a 400 bad request username or email already exists.
	default:
		message = "Account successfully created"
		statusCode = http.StatusOK
	}

	w.WriteHeader(statusCode)

	fmt.Println(message)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password1), bcrypt.DefaultCost)

	// 1. Create a record for the user in the database.
	statement, _ := Database.Prepare("Insert into User (Username, Password, Email, City, Country, Phone) Values (?,?,?,?,?,?)")
	statement.Exec(username, hashedPassword, email, city, country, phone)

	// 2. Login the user (Create a Json Web Token)

	// 3. Respond with a success message
	payload, _ := json.Marshal(Msg{Message: message})
	fmt.Fprintf(w, string(payload))
}
