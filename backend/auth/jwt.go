package auth

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt"
)

const (
	jwtTokenName = "jwt"
)

type JWTclaim struct {
	Uid     string `json:"uid"`
	Email   string `json:"email"`
	Country string `json:"country"`
	City    string `json:"city"`
	jwt.StandardClaims
}

var mySecret = "UseYourSecretKeyHere"

func (jwtInfo *JWTclaim) GenerateToken() string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, *jwtInfo)
	ss, _ := token.SignedString([]byte(mySecret)) // User your secret key here
	return ss
}

func (jwtInfo *JWTclaim) ParseToken(tokenString string) error {
	token, err := jwt.ParseWithClaims(tokenString, jwtInfo, func(tok *jwt.Token) (interface{}, error) {
		return []byte(mySecret), nil
	})

	if err != nil {
		return err
	}

	var ok bool
	jwtInfo, ok = token.Claims.(*JWTclaim)

	if ok && token.Valid {
		fmt.Println(jwtInfo)
		return nil
	}

	return errors.New("Not Authorized")
}
