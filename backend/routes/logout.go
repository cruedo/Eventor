package routes

import (
	"encoding/json"
	"net/http"

	"github.com/cruedo/Eventor/auth"
	"github.com/cruedo/Eventor/utils"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	auth.Logout(w, r)
	json.NewEncoder(w).Encode(utils.Response{Message: "Successfully logged out"})
}
