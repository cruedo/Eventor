CREATE TABLE IF NOT EXISTS User (
    UserID text primary key,
    Username text not null unique,
    Password text not null,
    Email text not null unique,
    City text,
    Country text,
    Phone text
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Event (
    EventID text primary key,
    UserID text not null,
    Title text not null,
    Description text not null,
    City text not null,
    Country text not null,
    StartTime datetime not null,
    CreatedTime datetime not null,
    Latitude text not null,
    Longitude text not null,
    Fee integer not null,
    Capacity integer not null,
    foreign key(UserID) references User(UserID) on delete cascade
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Participant (
    PID text primary key,
    UserID text not null,
    EventID text not null,
    foreign key(UserID) references User(UserID) on Delete cascade
    foreign key(EventID) references Event(EventID) on delete cascade
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Comment (
    CommentID text primary key,
    Text text not null,
    CreatedTime datetime not null,
    UserID text not null,
    EventID text not null,
    foreign key(UserID) references User(UserID) on Delete cascade
    foreign key(EventID) references Event(EventID) on delete cascade
) WITHOUT ROWID;