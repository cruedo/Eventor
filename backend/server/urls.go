package server

import (
	"github.com/cruedo/Eventor/routes"
)

func (server *Server) Start() {
	server.r.HandleFunc("/signup", routes.Signup).Methods("POST")
	server.r.HandleFunc("/login", routes.Login).Methods("POST")
	server.r.HandleFunc("/logout", routes.Logout).Methods("POST")
}
