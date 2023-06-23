package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
  "encoding/json"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
  w.Write([]byte("hello woeld"));
}

func (app *application) sync(w http.ResponseWriter, r *http.Request) {
  fmt.Println("got a request to sync");
  if r.Method == "GET" {
    fmt.Println("GET sync");
    app.syncGET(w, r);
  } else if r.Method == "POST" {
    fmt.Println("POST sync");
    app.syncPOST(w, r);
  } else {
    w.Write([]byte("Wrong HTTP method"))
  }
}

func (app *application) syncGET(w http.ResponseWriter, r *http.Request) {
  var dir string
  token := strings.Replace(r.URL.Path, "/sync/", "", 1)
  fmt.Printf("GET request from %s\n", token);
  row := app.DB.QueryRow("SELECT move FROM sessions WHERE token = ?", token)
  row.Scan(&dir)

  w.Header().Set("Content-Type", "application/json")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Write([]byte(fmt.Sprintf("{\"dir\": \"%s\"}", dir)));
}

type syncData struct {
  Token   int         `json:"token"`
  Move    string      `json:"move"`
  Peered    int       `json:"peered"`
}

type returnedData struct {
  Move    string      `json:"dir"`
}
func (app *application) syncPOST(w http.ResponseWriter, r *http.Request) {
  fmt.Println("syncPOST");
  var data syncData
  var rawdata []byte
  var peerMove string
  updateStmt := `UPDATE sessions SET move = ? WHERE token = ?`
  qeuryStmt := `SELECT move FROM sessions WHERE peered = ?`
  buffer := make([]byte, 100)
  n, err := r.Body.Read(buffer);
  for  n > 0 {
    rawdata = append(rawdata, buffer[:n]...)
    n, err = r.Body.Read(buffer);
  }
  err = json.Unmarshal(rawdata, &data);
  check(err);
  app.DB.Exec(updateStmt, data.Move, data.Token);
  err = app.DB.QueryRow(qeuryStmt, data.Peered).Scan(&peerMove);
  check(err);

  // successful sync
  returnData, err := json.Marshal(returnedData{Move: peerMove});
  check(err);
  w.WriteHeader(http.StatusOK)
  w.Header().Set("Content-Type", "application/json")
  w.Write(returnData);
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
  } else {
    fmt.Printf("%s: already a peer is waiting for me\n", token);
    _, err := app.DB.Exec("UPDATE sessions SET peered = ? WHERE peered = 0 and token != ?", token, token);
    if (err != nil) {
      w.Write([]byte("internal server error"));
    }
    app.toWait = true;
  }
  http.Redirect(w, r, fmt.Sprintf("/sync/%s", token), http.StatusSeeOther);
}
