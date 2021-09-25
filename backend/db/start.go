package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var (
	Database *sql.DB
	err      error
)

func Initialize() {
	Database, err = sql.Open("sqlite3", "../test.db")
	if err != nil {
		panic(err)
	}
}
