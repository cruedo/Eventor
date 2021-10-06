package utils

import (
	"net/http"
	"strconv"

	"github.com/sony/sonyflake"
)

type Response struct {
	Message string `json:"message"`
}

const (
	TimeLayout = "[02/01/2006 15:04:05 -07:00]"
)

func GenerateUniqueId() string {
	sf := sonyflake.NewSonyflake(sonyflake.Settings{})
	id, _ := sf.NextID()
	return strconv.FormatUint(id, 10)
}

func IsEmpty(args ...string) bool {
	for _, v := range args {
		if v == "" {
			return true
		}
	}
	return false
}

// Custom ResponseWriter to log statusCodes
type loggingResponseWriter struct {
	http.ResponseWriter
	StatusCode int
}

func NewLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.StatusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}
