package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
  w.Write([]byte("hello woeld"));
}

func (app *application) sync(w http.ResponseWriter, r *http.Request) {
  if r.Method == "GET" {
    app.syncGET(w, r);
  } else if r.Method == "POST" {
    app.syncPOST(w, r);
  } else {
    w.Write([]byte("Wrong HTTP method"))
  }
}

func (app *application) syncGET(w http.ResponseWriter, r *http.Request) {
  var dir int
  token := strings.Replace(r.URL.Path, "/sync/", "", 1)
  row := app.DB.QueryRow("SELECT direction FROM sessions WHERE token = ?", token)
  row.Scan(&dir)

}

func (app *application) syncPOST(w http.ResponseWriter, r *http.Request) {
  // TODO
}

// generate generate a random token, insert it into the db
// and redirect to /find
func (app *application) generate(w http.ResponseWriter, r *http.Request) {
  var token int = rand.Intn(999999 - 100000 + 1) + 100000
  move := "r";
  peered := 0;
  _, err := app.DB.Exec("INSERT INTO sessions VALUES (?, ?, ?)", token, move, peered);
  if err != nil {
    fmt.Println(err);
    http.Error(w, "couldn't generate token", http.StatusInternalServerError);
  }

  // redirecting to /peer
  http.Redirect(w, r, fmt.Sprintf("/peer/%d", token), http.StatusSeeOther);
}

// peer peers player with provided token with other player
func (app *application) peer(w http.ResponseWriter, r *http.Request) {
  token := strings.Replace(r.URL.Path, "/peer/", "", 1);
  // finding peer or waiting to get peered
  if (app.toWait) {
    fmt.Printf("%s: waiting for a peer\n", token);
    //w.Write([]byte("waiting for a peer"));
    app.toWait = false;
    
    for (!app.toWait) {
      time.Sleep(1 * time.Second);
    }
    fmt.Printf("%s: found a peer\n", token);
    var peerToken int;

    row := app.DB.QueryRow("SELECT peered FROM sessions WHERE token = ?", token);
    row.Scan(&peerToken);
    fmt.Printf("%s: peer token is %d\n", token, peerToken);

    _, err := app.DB.Exec("UPDATE sessions SET peered = ? WHERE token = ?", token, peerToken);
    if (err != nil) {
      fmt.Println(err);
      w.Write([]byte("internal server error"));
    }
    w.WriteHeader(http.StatusOK);
    w.Write([]byte("found a peer"));

  } else {
    fmt.Printf("%s: already a peer is waiting for me\n", token);
    _, err := app.DB.Exec("UPDATE sessions SET peered = ? WHERE peered = 0 and token != ?", token, token);
    if (err != nil) {
      w.Write([]byte("internal server error"));
    }
    app.toWait = true;
  }
}
