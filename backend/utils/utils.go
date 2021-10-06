package utils

import (
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
