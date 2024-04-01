package main

import (
	"fmt"
	"net/http"

	qrcode "github.com/skip2/go-qrcode"
)

func main() {
	http.HandleFunc("/generate", generateHandler) // Setting the route

	fmt.Println("Server is starting on port 3000...")
	err := http.ListenAndServe(":3000", nil) // Start the server on port 3000
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

func generateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" { // Ensure that the request method is GET
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	url := r.URL.Query().Get("url")

	if url == "" {
		http.Error(w, "URL parameter is required", http.StatusBadRequest)
		return
	}

	var png []byte
	png, err := qrcode.Encode(url, qrcode.Medium, 256)
	if err != nil {
		fmt.Println("Error generating QR code")
		return
	}

	w.Header().Set("Content-Type", "image/png")                   // Set the content type to image/png
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(png))) // Set the content length
	w.Write(png)                                                  // Write the image to the response
}
