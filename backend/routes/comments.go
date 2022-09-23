package routes

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/cruedo/Eventor/db"
	"github.com/cruedo/Eventor/utils"
	"github.com/gorilla/mux"
)

func WriteComment(w http.ResponseWriter, r *http.Request) {
	uid := r.Context().Value("User").(*db.User).UserID
	eid := mux.Vars(r)["eventid"]

	form := map[string]string{}
	json.NewDecoder(r.Body).Decode(&form)

	message := "Successfully commented"
	comment := form["comment"]

	if utils.IsEmpty(comment) {
		w.WriteHeader(http.StatusBadRequest)
		message = "Error: Cant write an empty comment"
		json.NewEncoder(w).Encode(utils.Response{Message: message})
		return
	}

	qry := "Insert into Comment Values(?,?,?,?,?)"
	stmt, _ := db.Database.Prepare(qry)
	commentID := utils.GenerateUniqueId()
	currentTime := time.Now().UTC()
	currentTimeString := strconv.FormatInt(currentTime.Unix(), 10)
	stmt.Exec(commentID, comment, currentTimeString, uid, eid)
	json.NewEncoder(w).Encode(utils.Response{Message: message, Data: db.Comment{
		CommentID:   commentID,
		Text:        comment,
		CreatedTime: currentTime.Format(time.RFC3339),
		UserID:      uid,
		EventID:     eid,
	}})
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	eid := mux.Vars(r)["eventid"]
	qry := "Select * from Comment where EventID = ? order by CreatedTime asc"
	var comments []db.Comment
	rows, _ := db.Database.Queryx(qry, eid)
	for rows.Next() {
		var cmt db.Comment
		rows.StructScan(&cmt)
		comments = append(comments, cmt)
	}
	message := "Success"
	json.NewEncoder(w).Encode(utils.Response{Message: message, Data: comments})
}
