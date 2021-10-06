package db

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

var (
	Database *sql.DB
	err      error
)

func Initialize() {
	dir, _ := os.Getwd()
	pth := filepath.Join(dir, "test.db")
	Database, err = sql.Open("sqlite3", pth)
	if err != nil {
		panic(err)
	}
}

func CleanUp() {
	Database.Close()
}
