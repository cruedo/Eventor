package server

import (
	"fmt"
	"net/http"

	"github.com/cruedo/Eventor/routes"
	"github.com/gorilla/mux"
)

type Server struct {
	r *mux.Router
}

func fxn(hnd http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// w.Header().Set("Content-Type", "image/png")
		hnd.ServeHTTP(w, r)
	}
}

func (server *Server) Initialize() {
	server.r = mux.NewRouter()

	server.r.Use(routes.Logger, routes.AttachUser, routes.PreflightHandler, routes.CommonHeaders)
}

func (server *Server) Run() {
	server.r.NotFoundHandler = server.r.NewRoute().HandlerFunc(http.NotFound).GetHandler()
	server.r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fxn(http.FileServer(http.Dir("./static/")))))
	fmt.Println("Server is Running on port 8000...")
	http.ListenAndServe(":8000", server.r)
}
