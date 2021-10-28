package routes

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
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

func PostEvent(w http.ResponseWriter, r *http.Request) {
	message := "Successfully created event"

	e, err := validateEvent(r)

	if err != nil {
		message = err.Error()
		w.WriteHeader(http.StatusBadRequest)
	} else {
		e.EventID = utils.GenerateUniqueId()
		e.UserID = r.Context().Value("User").(*db.User).UserID
		stmt, _ := db.Database.Prepare("INSERT INTO Event VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
		stmt.Exec(e.EventID, e.UserID, e.Title, e.Description, e.City, e.Country, e.StartTime, e.CreatedTime, e.Latitude, e.Longitude, e.Fee, e.Capacity)
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
