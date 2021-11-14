FROM golang:1.17-alpine AS build
RUN apk add --update --no-cache gcc make musl-dev

WORKDIR /app/backend
COPY ./backend/go.mod ./
COPY ./backend/go.sum ./
RUN go mod download -x

WORKDIR /app
COPY . .

WORKDIR /app/backend
RUN go build -o main.out .

EXPOSE 8000
CMD ["./main.out"]
