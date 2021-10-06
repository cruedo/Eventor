package routes

import (
	"context"
	"net/http"

	"github.com/cruedo/Eventor/auth"
	"github.com/cruedo/Eventor/db"
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
