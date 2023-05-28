package main

import (
  "net/http"
  "log"
)

func writeto(w http.ResponseWriter, data []byte) {
  count, err := w.Write(data)
  check(err)
  if count != len(data) {
    for {
      count, err = w.Write(data[count:])
      if err != nil {
        check(err)
      }
      if count == 0 {
        return
      }
    }
  }
}

func check(err error) {
  if err != nil {
    log.Fatal(err)
  }
}
