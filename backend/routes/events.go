package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
	"github.com/gorilla/mux"
)

func GetEvents(w http.ResponseWriter, r *http.Request) {
	// w.Header().Set("Content-Type", "application/json")
	qry := `
	Select Event.*, Count(*) as Attendees from
	Participant, Event
	where Participant.EventID = Event.EventID
	group by Participant.EventID;
	`
	rows, err := db.Database.Queryx(qry)
	if err != nil {
		fmt.Println(err)
	}

	var events []db.Event

	for rows.Next() {
		var e db.Event
		err := rows.StructScan(&e)
		if err != nil {
			fmt.Println(err)
		} else {
			events = append(events, e)
		}
	}
	json.NewEncoder(w).Encode(utils.Response{Message: "Success", Data: events})
}

func validateEvent(r *http.Request) (db.Event, error) {
	r.ParseForm()
	var e db.Event
	e.Title = r.Form.Get("title")
	e.Description = r.Form.Get("description")
	e.City = r.Form.Get("city")
	e.Country = r.Form.Get("country")
	e.StartTime = r.Form.Get("starttime")
	e.Latitude = r.Form.Get("latitude")
	e.Longitude = r.Form.Get("longitude")
	e.Fee, _ = strconv.Atoi(r.Form.Get("fee"))
	e.Capacity, _ = strconv.Atoi(r.Form.Get("capacity"))
	e.CreatedTime = strconv.FormatInt(time.Now().Unix(), 10)

	message := ""

	switch {
	case utils.IsEmpty(e.Title, e.Description, e.City, e.Country, e.StartTime):
		message = "Please fill up all of the details"
	}

	if message != "" {
		return db.Event{}, errors.New(message)
	}

	return e, nil
}

func InsertEvent(e *db.Event) {
	stmt, _ := db.Database.Prepare("INSERT INTO Event VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
	stmt.Exec(e.EventID, e.UserID, e.Title, e.Description, e.City, e.Country, e.StartTime, e.CreatedTime, e.Latitude, e.Longitude, e.Fee, e.Capacity)
}

func PostEvent(w http.ResponseWriter, r *http.Request) {
	message := "Successfully created event"

	e, err := validateEvent(r)

	if err != nil {
		message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
	} else {
		e.EventID = utils.GenerateUniqueId()
		e.UserID = r.Context().Value("User").(*db.User).UserID
		// stmt, _ := db.Database.Prepare("INSERT INTO Event VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
		// stmt.Exec(e.EventID, e.UserID, e.Title, e.Description, e.City, e.Country, e.StartTime, e.CreatedTime, e.Latitude, e.Longitude, e.Fee, e.Capacity)
		InsertEvent(&e)
		MakeParticipant(e.UserID, e.EventID)
	}

	json.NewEncoder(w).Encode(utils.Response{Message: message})
}

func GetEvent(w http.ResponseWriter, r *http.Request) {
	v := mux.Vars(r)
	qry := `
	Select Event.*, Count(*) as Attendees from
	Participant, Event
	where Participant.EventID = Event.EventID and Event.EventID = ?
	group by Participant.EventID;
	`
	var E db.Event
	message := "Success"
	err := db.Database.QueryRowx(qry, v["eventid"]).StructScan(&E)
	if err != nil {
		message = "No event found"
		w.WriteHeader(http.StatusNotFound)
	}
	json.NewEncoder(w).Encode(utils.Response{Message: message, Data: E})
}

func CancelEvent(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("User").(*db.User).UserID
	eid := mux.Vars(r)["eventid"]

	var event_userid string
	err := db.Database.QueryRow("select E.UserID from Event as E where E.EventID = ?", eid).Scan(&event_userid)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		fmt.Println(err)
		json.NewEncoder(w).Encode(utils.Response{Message: "Event does not exist"})
		return
	}
	if event_userid != uid {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(utils.Response{Message: "You are not authorized for this request"})
		return
	}

	var participants []string
	rows, err := db.Database.Queryx("select P.UserID from Participant as P where P.EventID = ? and P.UserID != ?", eid, uid)

	for rows.Next() {
		var id string
		rows.Scan(&id)
		participants = append(participants, id)
	}

	stmt, _ := db.Database.Prepare("Delete from Event as E where E.EventID = ?")
	stmt.Exec(eid)
	json.NewEncoder(w).Encode(utils.Response{Message: "Successfully deleted event"})
}

func UpdateEventinDB(event_id, uid string, body *url.Values) error {
	qry := `
	Select * from Event
	where EventID = ?
	`
	var e db.Event
	var err error
	row := db.Database.QueryRow(qry, event_id)
	row.Scan(&e.EventID, &e.UserID, &e.Title, &e.Description, &e.City, &e.Country, &e.StartTime, &e.CreatedTime, &e.Latitude, &e.Longitude, &e.Fee, &e.Capacity)
	if e.UserID != uid {
		return errors.New("Not Authorized")
	}
	qry = `
	Update Event set
	Title = ?,
	Description = ?,
	City = ?,
	Country = ?,
	StartTime = ?,
	Latitude = ?,
	Longitude = ?,
	Fee = ?,
	Capacity = ?
	`
	stmt, _ := db.Database.Prepare(qry)
	if body.Has("title") {
		e.Title = body.Get("title")
	}
	if body.Has("description") {
		e.Description = body.Get("description")
	}
	if body.Has("city") {
		e.City = body.Get("city")
	}
	if body.Has("country") {
		e.Country = body.Get("country")
	}
	if body.Has("starttime") {
		e.StartTime = body.Get("starttime")
	}
	if body.Has("latitude") {
		e.Latitude = body.Get("latitude")
	}
	if body.Has("longitude") {
		e.Longitude = body.Get("longitude")
	}
	if body.Has("fee") {
		e.Fee, err = strconv.Atoi(body.Get("fee"))
		if err != nil {
			return errors.New("Incorrect input fee")
		}
	}
	if body.Has("capacity") {
		e.Capacity, err = strconv.Atoi(body.Get("capacity"))
		if err != nil {
			return errors.New("Incorrect input capacity")
		}
	}
	stmt.Exec(e.Title, e.Description, e.City, e.Country, e.StartTime, e.Latitude, e.Longitude, e.Fee, e.Capacity)
	return nil
}

func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("User").(*db.User).UserID
	message := "Successfully updated event"
	r.ParseForm()
	err := UpdateEventinDB(mux.Vars(r)["eventid"], uid, &r.Form)
	if err != nil {
		message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
	}
	json.NewEncoder(w).Encode(utils.Response{Message: message})
}
