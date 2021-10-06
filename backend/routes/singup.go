package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/cruedo/Eventor/auth"
	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
	"golang.org/x/crypto/bcrypt"
)

func exists(username, email string) bool {
	// Check if the provided arguments exists as a record in the database.
	// if they exist return true.
	rows, err := db.Database.Query("SELECT * FROM User WHERE Username = ? OR Email = ?", username, email)
	if err != nil {
		fmt.Println(err)
		return true
	}
	defer rows.Close()
	return rows.Next()
}

func validateUser(r *http.Request) (db.User, error) {
	r.ParseForm()
	username := r.Form.Get("username")
	password1 := r.Form.Get("password1")
	password2 := r.Form.Get("password2")
	email := r.Form.Get("email")
	city := r.Form.Get("city")
	country := r.Form.Get("country")
	phone := r.Form.Get("phone")

	message := ""

	switch {
	// username, email, city, country should NOT be null
	case utils.IsEmpty(username, password1, password2, email, city, country):
		// Return a 400 bad request !!
		message = "Please fill up all of the details"

	case password1 != password2:
		message = "Passwords do not match"

		// username and email should be unique
	case exists(username, email):
		message = "Username or email already exists"
		// Return a 400 bad request username or email already exists.
	}

	if message != "" {
		return db.User{}, errors.New(message)
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password1), bcrypt.DefaultCost)
	user := db.User{
		UserID:         utils.GenerateUniqueId(),
		Username:       username,
		HashedPassword: string(hashedPassword),
		Email:          email,
		City:           city,
		Country:        country,
		Phone:          phone,
	}
	return user, nil
}

func insertUser(u db.User) {
	statement, err := db.Database.Prepare("Insert into User (UserID, Username, Password, Email, City, Country, Phone) Values (?,?,?,?,?,?,?)")
	if err != nil {
		fmt.Println(err)
		return
	}
	_, err = statement.Exec(u.UserID, u.Username, u.HashedPassword, u.Email, u.City, u.Country, u.Phone)
}

func Signup(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	user, err := validateUser(r)
	var message string

	// WARNING : DO NOT CREATE A DATABASE RECORD  AND LOGIN (steps 1 & 2)
	// IF THERE IS AN ERROR IN FORM VALUES.
	if err != nil {
		message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
	} else {
		message = "Successfully signed up"

		// 1. Create a record for the user in the database.
		insertUser(user)

		// 2. Login the user (Create a Json Web Token)
		auth.Login(w, r, user)
	}

	// 3. Respond with a success message
	payload, _ := json.Marshal(utils.Response{Message: message})
	fmt.Fprint(w, string(payload))
}
