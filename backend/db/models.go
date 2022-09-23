package db

type User struct {
	UserID         string `json:"userID,omitempty" db:"UserID"`
	Username       string `json:"username,omitempty" db:"Username"`
	HashedPassword string `json:"pd,omitempty" db:"Password"`
	Email          string `json:"email,omitempty" db:"Email"`
	City           string `json:"city,omitempty" db:"City"`
	Country        string `json:"country,omitempty" db:"Country"`
	Phone          string `json:"phone,omitempty" db:"Phone"`
}

type Event struct {
	EventID     string `json:"eventID,omitempty" db:"EventID"`
	UserID      string `json:"userID,omitempty" db:"UserID"`
	Title       string `json:"title,omitempty" db:"Title"`
	Description string `json:"description,omitempty" db:"Description"`
	City        string `json:"city,omitempty" db:"City"`
	Country     string `json:"country,omitempty" db:"Country"`
	StartTime   string `json:"startTime,omitempty" db:"StartTime"`     // Time ?
	CreatedTime string `json:"createdTime,omitempty" db:"CreatedTime"` // Time ?
	Latitude    string `json:"latitude,omitempty" db:"Latitude"`       // Float ?
	Longitude   string `json:"longitude,omitempty" db:"Longitude"`     // Float ?
	Fee         int    `json:"fee,omitempty" db:"Fee"`
	Capacity    int    `json:"capacity,omitempty" db:"Capacity"`
	Attendees   int    `json:"attendees,omitempty" db:"Attendees"`
	Registered  bool   `json:"registered" db:"Registered"`
}

type Participant struct {
	PID     string `json:"pid" db:"PID"`
	UserID  string `json:"userid" db:"UserID"`
	EventID string `json:"eventid" db:"EventID"`
}

type Comment struct {
	CommentID   string `json:"commentid" db:"CommentID"`
	Text        string `json:"text" db:"Text"`
	CreatedTime string `json:"createdTime" db:"CreatedTime"` // Float ?
	UserID      string `json:"userid" db:"UserID"`
	EventID     string `json:"eventid" db:"EventID"`
}
