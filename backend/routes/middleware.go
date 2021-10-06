package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/cruedo/Eventor/auth"
	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
)

func AttachUser(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
}

func AlreadyAuthorized(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		usr := ctx.Value("User")
		if usr == nil {
			next.ServeHTTP(w, r)
			return
		}
		http.Redirect(w, r, "/events", http.StatusTemporaryRedirect)
	}
}

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func NewLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func Logger(next http.Handler) http.Handler {
	fxn := func(w http.ResponseWriter, r *http.Request) {
		now := time.Now()

		lrw := NewLoggingResponseWriter(w)
		next.ServeHTTP(lrw, r)

		statusCode := lrw.statusCode
		log := fmt.Sprintf("%v %v %v %v", now.Format(utils.TimeLayout), r.Method, r.URL.String(), statusCode)
		fmt.Println(log)
	}
	return http.HandlerFunc(fxn)
}
