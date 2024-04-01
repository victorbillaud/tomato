package main

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"net/http"
	"os"

	"github.com/fogleman/gg"
	"github.com/skip2/go-qrcode"
)

const (
	fontPath       = "./GeistVF.ttf"
	qrCodeSize     = 256
	bannerHeight   = 50
	titleFontSize  = 20.0
	bottomFontSize = 20.0
	margin         = 10
)

func main() {
	http.HandleFunc("/generate", generateHandler)

	fmt.Println("Server is starting on port 3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

func generateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	title := r.URL.Query().Get("title")
	if title == "" {
		title = "Your Title Here"
	}

	bottomText := "Scan me !"

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

	qrCode.DisableBorder = true

	// Create a new image with bannerHeight added to the height for the title and bottom text
	img := image.NewRGBA(image.Rect(0, 0, qrCodeSize, qrCodeSize+2*bannerHeight))

	dc := gg.NewContextForRGBA(img)
	// dc.SetRGB(1, 1, 1)
	dc.Clear()

	qrImage := qrCode.Image(qrCodeSize)

	draw.Draw(img, qrImage.Bounds().Add(image.Pt(0, bannerHeight)), qrImage, image.ZP, draw.Over)

	// Load and draw the logo
	logoImage, err := loadLogoImage("./logo_small.png")
	if err != nil {
		http.Error(w, "Failed to load logo", http.StatusInternalServerError)
		return
	}
	logoSize := float64(qrCodeSize) * 0.2
	logoX := float64(qrCodeSize)/2 - logoSize/2
	logoY := float64(qrCodeSize)/2 - logoSize/2
	dc.DrawImageAnchored(logoImage, int(logoX+logoSize/2), int(logoY+logoSize/2)+bannerHeight, 0.5, 0.5)

	// Draw the title text at the top
	drawText(dc, title, titleFontSize, bannerHeight/2, image.Point{X: qrCodeSize / 2, Y: 0}, color.Black)

	// Draw the bottom text at the bottom
	if bottomText != "" {
		drawText(dc, bottomText, bottomFontSize, bannerHeight/2, image.Point{X: qrCodeSize / 2, Y: qrCodeSize + bannerHeight}, color.Black)
	}

	// Set the content type
	w.Header().Set("Content-Type", "image/png")

	// Encode and write the final image to the response
	err = png.Encode(w, img)
	if err != nil {
		http.Error(w, "Failed to encode final image", http.StatusInternalServerError)
	}
}

// drawText draws text on the image
func drawText(dc *gg.Context, text string, fontSize float64, height int, anchor image.Point, color color.Color) {
	if err := dc.LoadFontFace(fontPath, fontSize); err != nil {
		fmt.Printf("Failed to load font face: %v\n", err)
		return
	}

	dc.SetColor(color)
	dc.DrawStringAnchored(text, float64(anchor.X), float64(anchor.Y+height), 0.5, 0.5)
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
