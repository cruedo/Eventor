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

func (server *Server) Initialize() {
	server.r = mux.NewRouter()
	server.r.Use(routes.Logger, routes.AttachUser, routes.CommonHeaders)
}

func (server *Server) Run() {
	fmt.Println("Server is Running on port 8000...")
	http.ListenAndServe(":8000", server.r)
}
