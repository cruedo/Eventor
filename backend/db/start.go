package db

import (
	"os"
	"path/filepath"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var (
	Database *sqlx.DB
	err      error
)

const (
	createDatabase = `
		CREATE TABLE IF NOT EXISTS User (
			UserID text primary key,
			Username text not null unique,
			Password text not null,
			Email text not null unique,
			City text,
			Country text,
			Phone text
		) WITHOUT ROWID;

		CREATE TABLE IF NOT EXISTS Event (
			EventID text primary key,
			UserID text not null,
			Title text not null,
			Description text not null,
			City text not null,
			Country text not null,
			StartTime datetime not null,
			CreatedTime datetime not null,
			Latitude text not null,
			Longitude text not null,
			Fee integer not null,
			Capacity integer not null,
			foreign key(UserID) references User(UserID)
		) WITHOUT ROWID;

		CREATE TABLE IF NOT EXISTS Participant (
			PID text primary key,
			UserID text not null,
			EventID text not null
			foreign key(UserID) references User(UserID)
			foreign key(EventID) references Event(EventID)
		) WITHOUT ROWID
	`
)

func Initialize() {
	dir, _ := os.Getwd()
	pth := filepath.Join(dir, "test.db")
	Database, err = sqlx.Open("sqlite3", pth)
	if err != nil {
		panic(err)
	}
}

func CleanUp() {
	Database.Close()
}
