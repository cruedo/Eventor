package server

import (
	"github.com/cruedo/Eventor/routes"
	"github.com/justinas/alice"
)

func (server *Server) Start() {
	server.r.Handle("/signup", alice.New(routes.AlreadyAuthorized).ThenFunc(routes.Signup)).Methods("POST")
	server.r.Handle("/login", alice.New(routes.AlreadyAuthorized).ThenFunc(routes.Login)).Methods("POST")
	server.r.HandleFunc("/logout", routes.Logout).Methods("POST")

	server.r.HandleFunc("/events", routes.GetEvents).Methods("GET")
	server.r.Handle("/events", alice.New(routes.Protected).ThenFunc(routes.PostEvent)).Methods("POST")
	server.r.HandleFunc("/events/{eventid}", routes.GetEvent).Methods("GET")
	server.r.Handle("/events/{eventid}", alice.New(routes.Protected).ThenFunc(routes.CancelEvent)).Methods("DELETE")

	server.r.Handle("/events/{eventid}/participants", alice.New(routes.Protected).ThenFunc(routes.JoinEvent)).Methods("POST")
	server.r.Handle("/events/{eventid}/participants", alice.New(routes.Protected).ThenFunc(routes.LeaveEvent)).Methods("DELETE")
	server.r.HandleFunc("/events/{eventid}/participants", routes.GetParticipants).Methods("GET")
}
