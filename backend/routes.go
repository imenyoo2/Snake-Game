package main

import (
  "net/http"
)


func (app *application) routes() *http.ServeMux {
  mux := http.NewServeMux()
  mux.HandleFunc("/", app.home);
  mux.HandleFunc("/generate", app.generate);
  mux.HandleFunc("/sync/", app.syncGET);
  mux.HandleFunc("/sync", app.syncPOST);
  mux.HandleFunc("/peer/", app.peer);
  return (mux);
}
