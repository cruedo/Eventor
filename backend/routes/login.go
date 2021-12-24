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

func existsLogin(username, password string, u *db.User) bool {
	rows := db.Database.QueryRow("SELECT * FROM User WHERE Username = ?", username)
	err := rows.Scan(&u.UserID, &u.Username, &u.HashedPassword, &u.Email, &u.City, &u.Country, &u.Phone)
	if err != nil {
		fmt.Println(err)
		return false
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.HashedPassword), []byte(password)); err != nil {
		fmt.Println("Passwords did not match")
		return false
	}
	return true
}

func validateUserLogin(r *http.Request) (db.User, error) {
	// r.ParseForm()
	// username := r.Form.Get("username")
	// password := r.Form.Get("password")

	form := map[string]string{}
	json.NewDecoder(r.Body).Decode(&form)
	username := form["username"]
	password := form["password"]

	message := ""
	var user db.User

	switch {
	case utils.IsEmpty(username, password):
		message = "Please fill up all of the details"
	case (!existsLogin(username, password, &user)):
		message = "Incorrect username or password"
	}

	if message != "" {
		return db.User{}, errors.New(message)
	}
	return user, nil
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	message := "Successfully Loggedin"
	user, err := validateUserLogin(r)
	if err != nil {
		message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
	} else {
		auth.Login(w, r, user)
	}
	json.NewEncoder(w).Encode(utils.Response{Message: message})
}
