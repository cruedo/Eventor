package db

type User struct {
	UserID         string
	Username       string
	HashedPassword string
	Email          string
	City           string
	Country        string
	Phone          string
}

type Event struct {
	EventID     string
	UserID      string
	Title       string
	Description string
	City        string
	Country     string
	StartTime   string // Time ?
	Latitude    string // Float ?
	Longitude   string // Float ?
	Fee         int
	Capacity    int
	Attendees   int
}
