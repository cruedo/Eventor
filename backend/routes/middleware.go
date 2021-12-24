package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cruedo/Eventor/auth"
	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
)

func AttachUser(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		jwtCookie, err := r.Cookie("jwt")
		user := db.User{}
		var ptr *db.User

		if err == nil {
			claim := auth.JWTclaim{}
			err := claim.ParseToken(jwtCookie.Value)
			if err == nil {
				user.UserID = claim.Uid
				ptr = &user
			}
		}
		ctx := r.Context()
		ctx = context.WithValue(ctx, "User", ptr)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fxn)
}

func AlreadyAuthorized(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		usr := ctx.Value("User")
		if usr == (*db.User)(nil) {
			next.ServeHTTP(w, r)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(utils.Response{Message: "Already Loggedin"})
	}
	return http.HandlerFunc(fxn)
}

func Logger(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		now := time.Now()

		lrw := utils.NewLoggingResponseWriter(w)
		next.ServeHTTP(lrw, r)

		statusCode := lrw.StatusCode
		log := fmt.Sprintf("%v %v %v %v", now.Format(utils.TimeLayout), r.Method, statusCode, r.URL.String())
		fmt.Println(log)
	}
	return http.HandlerFunc(fxn)
}

func Protected(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		usr := r.Context().Value("User")
		if usr == (*db.User)(nil) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(utils.Response{Message: "Please login"})
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fxn)
}

func CommonHeaders(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fxn)
}

func PreflightHandler(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "POST, PUT")
			return
		}
		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fxn)
}
