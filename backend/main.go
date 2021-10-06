package main

import (
	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/server"
)

func main() {
	srv := server.Server{}
	db.Initialize()
	defer db.CleanUp()
	srv.Initialize()
	srv.Start()
	srv.Run()
}
