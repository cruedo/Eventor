package auth

import (
	"net/http"
	"time"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("jwt")
	if err != nil {
		return
	}
	cookie.Expires = time.Unix(0, 0)
	cookie.Value = ""
	http.SetCookie(w, cookie)
}
