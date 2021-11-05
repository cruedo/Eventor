package auth

import (
	"net/http"
	"time"

	"github.com/cruedo/Eventor/db"
	"github.com/golang-jwt/jwt"
)

func Login(w http.ResponseWriter, r *http.Request, user db.User) {
	currentTime := time.Now()
	expiryTime := currentTime.Add(tokenLife * time.Minute)
	// 1. Create a JWT token
	claim := JWTclaim{
		user.UserID,
		user.Email,
		user.Country,
		user.City,
		jwt.StandardClaims{
			ExpiresAt: expiryTime.Unix(),
		},
	}
	token := claim.GenerateToken()

	// 2. Set the Cookie
	cookie := http.Cookie{
		Name:     jwtTokenName,
		Value:    token,
		HttpOnly: true,
		Secure:   true,
		Expires:  expiryTime,
	}
	http.SetCookie(w, &cookie)
}
