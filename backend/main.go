package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type application struct{
  DB *sql.DB
  toWait bool;
}

func openDB(dsn string) (*sql.DB, error) {
  db, err := sql.Open("mysql", dsn)
  if err != nil {
    return nil, err
  }
  if err = db.Ping(); err != nil {
    return nil, err
  }
  return db, nil
}

func main() {
  addr := flag.String("addr", ":4000", "HTTP network address")
  dsn := flag.String("dsn", "player:1234@/snakegame?parseTime=true", "MySQL data source name")

  flag.Parse();

  db, err := openDB(*dsn)
  if err != nil {
    log.Fatal(err);
  }

  app := &application{
    DB: db,
    toWait: true,
  };

  server := &http.Server{
    Addr: *addr,
    //ErrorLog: errorLog,
    Handler: app.routes(),
    //TLSConfig: tlsConfig,
    IdleTimeout: time.Minute,
    ReadTimeout: 5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  fmt.Println("starting server at ", *addr);
  err = server.ListenAndServe();
  if err != nil {
    log.Fatal(err);
  }

}

/*
discription of the backend:

app struct: holds data to be passed to handlers

routes:
+-------------+--------------------+--------------------------------+
| path        |      method        |       description              |
+-------------+--------------------+--------------------------------+
| /generate   |       GET          | generate the token used to     |
|             |                    | identify a multiplayer session |
+-------------+--------------------+--------------------------------+
| /sync/token |       POST         | send player moves to the server|
+-------------+--------------------+--------------------------------+
| /sync/token |       GET          | get other player moves         |
+-------------+--------------------+--------------------------------+
NOTE: this is not the way to go if you want to build a multiplayer game
      there is so many flase with using http for this, like performance 
      and sync issues, since there is no estableshment of a connection
      instead the client need to send and recive data by it self.

Database:
+---------+---------------------------------+
| columns | description                     |
+---------+---------------------------------+
| token   | token of the current user       |
+---------+---------------------------------+
| move    | the move of the the peered user |
+---------+---------------------------------+
| peered  | the token of the peered user    |
+---------+---------------------------------+

*/
