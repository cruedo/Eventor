package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/cruedo/Eventor/utils"
)

func Upload(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	r.Form.Get("fileName")
	r.Form.Get("formID")
	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode(utils.Response{Message: "error occured"})
		return
	}

	buf := make([]byte, 512)
	file.Read(buf)
	file.Seek(0, 0)
	defer file.Close()
	dst, _ := os.Create("./static/" + handler.Filename)
	defer dst.Close()
	io.Copy(dst, file)

	fmt.Println(http.DetectContentType(buf))
	json.NewEncoder(w).Encode(utils.Response{Message: "dat: " + handler.Filename})

}
