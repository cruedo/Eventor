package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
	"github.com/gorilla/mux"
)

func MakeParticipant(uid string, eid string) {
	qry := "Insert into participant values(?,?,?)"
	stmt, _ := db.Database.Prepare(qry)
	stmt.Exec(utils.GenerateUniqueId(), uid, eid)
}

func JoinEvent(w http.ResponseWriter, r *http.Request) {
	uid, eid := "", mux.Vars(r)["eventid"]
	message := "Successfully joined the event"
	if utils.IsEmpty(eid) {
		message = "No event provided"
		w.WriteHeader(http.StatusBadRequest)
	} else {
		uid = r.Context().Value("User").(*db.User).UserID
		MakeParticipant(uid, eid)
	}
	json.NewEncoder(w).Encode(utils.Response{Message: message})
}

func LeaveEvent(w http.ResponseWriter, r *http.Request) {
	qry := "Delete from Participant where UserID = ? and EventID = ?"
	stmt, _ := db.Database.Prepare(qry)
	eid := mux.Vars(r)["eventid"]
	uid := r.Context().Value("User").(*db.User).UserID
	stmt.Exec(uid, eid)
	json.NewEncoder(w).Encode(utils.Response{Message: "Success"})
}

func GetParticipants(w http.ResponseWriter, r *http.Request) {
	qry := `
	select * from User as U
	where U.UserID in
	(
		select P.UserID from Participant as P
		where P.EventID = ?
	)
	`
	eid := mux.Vars(r)["eventid"]
	rows, err := db.Database.Queryx(qry, eid)
	if err != nil {
		fmt.Println(err)
		return
	}
	var res []db.User
	for rows.Next() {
		var u db.User
		rows.StructScan(&u)
		u.HashedPassword = ""
		res = append(res, u)
	}
	json.NewEncoder(w).Encode(utils.Response{Message: "Success", Data: res})
}
