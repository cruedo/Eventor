package db

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var (
	Database *sqlx.DB
	err      error
)

func Initialize() {
	dir, _ := os.Executable()
	dir = filepath.Dir(dir)
	pth := filepath.Join(dir, "test.db")
	Database, err = sqlx.Open("sqlite3", pth)
	if err != nil {
		panic(err)
	}
	stmt, _ := Database.Prepare("PRAGMA foreign_keys=on;")
	_, err := stmt.Exec()
	if err != nil {
		fmt.Println(err)
	}
}

func CleanUp() {
	Database.Close()
}
