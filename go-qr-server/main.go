package main

import (
	"fmt"
	"image"
	_ "image/jpeg" // Import for JPEG decoding
	"image/png"
	"net/http"
	"os"

	"github.com/fogleman/gg"
	"github.com/skip2/go-qrcode"
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

	qrCode, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		http.Error(w, "Failed to generate QR code", http.StatusInternalServerError)
		return
	}

	// Convert generated QR code to image.Image type
	qrImage := qrCode.Image(256)
	dc := gg.NewContextForImage(qrImage)

	// Load your logo image
	logoImage, err := loadLogoImage("./logo_small.png") // Ensure logo path is correct
	if err != nil {
		http.Error(w, "Failed to load logo", http.StatusInternalServerError)
		return
	}

	// Calculate logo position and size
	logoSize := float64(qrImage.Bounds().Dx()) * 0.2 // Logo size as 20% of QR code size
	logoX := float64(qrImage.Bounds().Dx())/2 - logoSize/2
	logoY := float64(qrImage.Bounds().Dy())/2 - logoSize/2

	// Draw the logo at the calculated position on top of the QR code image
	dc.DrawImageAnchored(logoImage, int(logoX+logoSize/2), int(logoY+logoSize/2), 0.5, 0.5)

	// Set the content type
	w.Header().Set("Content-Type", "image/png")

	// Encode and write the final image (QR code with logo) to the response
	err = png.Encode(w, dc.Image())
	if err != nil {
		http.Error(w, "Failed to encode final image", http.StatusInternalServerError)
	}
}

// loadLogoImage loads an image from the given path
func loadLogoImage(path string) (image.Image, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}

	return img, nil
}
