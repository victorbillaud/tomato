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
	logoPath       = "./logo_small.png"
	fontPath       = "./GeistVF.ttf"
	boldFontPath   = "./Geist-SemiBold.ttf"
	qrCodeSize     = 256
	bannerHeight   = 40
	titleFontSize  = 20.0
	bottomFontSize = 20.0
	margin         = 5
	bottomText     = "Scan me !"
)

func main() {
	http.HandleFunc("/generate-sticker", generateStickerHandler)
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

	url := r.URL.Query().Get("url")
	if url == "" {
		http.Error(w, "URL parameter is required", http.StatusBadRequest)
		return
	}

	// Just generate a QR code
	img, err := createQRCode(url)
	if err != nil {
		http.Error(w, "Failed to generate QR code image", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "image/png")

	// Encode and write the final image to the response
	if err := png.Encode(w, img); err != nil {
		http.Error(w, "Failed to encode final image", http.StatusInternalServerError)
	}
}

func generateStickerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	title := r.URL.Query().Get("title")
	if title == "" {
		title = "Your Title Here"
	}
	url := r.URL.Query().Get("url")
	if url == "" {
		http.Error(w, "URL parameter is required", http.StatusBadRequest)
		return
	}

	// Generate QR Code with title and logo
	img, err := generateQRCodewithOverlay(title, bottomText, url)
	if err != nil {
		http.Error(w, "Failed to generate QR code image", http.StatusInternalServerError)
		return
	}

	// Set the content type
	w.Header().Set("Content-Type", "image/png")

	// Encode and write the final image to the response
	if err := png.Encode(w, img); err != nil {
		http.Error(w, "Failed to encode final image", http.StatusInternalServerError)
	}
}

// generateQRCodewithOverlay creates a QR code and draws title, bottom text, and a logo on it
func generateQRCodewithOverlay(title, bottomText, url string) (*image.RGBA, error) {
	qrCode, err := createQRCode(url)
	if err != nil {
		return nil, err
	}

	img := image.NewRGBA(image.Rect(0, 0, qrCodeSize+(margin*2), qrCodeSize+2*bannerHeight))
	dc := gg.NewContextForRGBA(img)
	dc.SetRGB(1, 1, 1)
	dc.Clear()

	// Position QR code with banner spaces and left right margin
	draw.Draw(img, image.Rect(margin, bannerHeight, qrCodeSize+margin, qrCodeSize+bannerHeight), qrCode, image.Point{X: 0, Y: 0}, draw.Src)

	// Draw logo
	if err := drawLogo(dc, logoPath); err != nil {
		return nil, err
	}

	// Add title and bottom text
	addTextOverlay(dc, title, bottomText)

	return img, nil
}

func createQRCode(url string) (image.Image, error) {
	qrCode, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		return nil, err
	}

	qrCode.DisableBorder = true
	return qrCode.Image(qrCodeSize), nil
}

func drawLogo(dc *gg.Context, logoPath string) error {
	logoImage, err := loadLogoImage(logoPath)
	if err != nil {
		return err
	}
	logoSize := float64(qrCodeSize) * 0.2
	logoX := float64(qrCodeSize)/2 - logoSize/2
	logoY := float64(qrCodeSize)/2 - logoSize/2
	dc.DrawImageAnchored(logoImage, int(logoX+logoSize/2), int(logoY+logoSize/2)+bannerHeight, 0.5, 0.5)
	return nil
}

func addTextOverlay(dc *gg.Context, title, bottomText string) {
	// Draw the title text at the top with a foreground rectangle as background
	drawTextForeground(dc, title, titleFontSize, bannerHeight, image.Point{X: qrCodeSize / 2, Y: 0}, color.RGBA{255, 224, 224, 255}, color.RGBA{250, 57, 57, 255})

	// Draw the bottom text at the bottom
	drawText(dc, bottomText, bottomFontSize, bannerHeight/2, image.Point{X: qrCodeSize / 2, Y: qrCodeSize + bannerHeight}, color.Black)
}

func drawTextForeground(dc *gg.Context, text string, fontSize float64, height int, anchor image.Point, backgroundColor, textColor color.Color) {
	if err := dc.LoadFontFace(boldFontPath, fontSize); err != nil {
		fmt.Printf("Failed to load font face: %v\n", err)
		return
	}

	// Measure text width to calculate background size
	textWidth, textHeight := dc.MeasureString(text)
	// Define margin around the text within the background
	margin := 10.0
	padding := 7.0 // Padding inside the rectangle for the text vertical alignment

	// Set color and draw rounded rectangle for the background, radius should be perfect circle
	dc.SetColor(backgroundColor)
	dc.DrawRoundedRectangle(float64(anchor.X)-textWidth/2-margin, float64(anchor.Y+(height/2))-(textHeight/2)-padding, textWidth+2*margin, textHeight+2*padding, (textHeight+2*padding)/2)
	dc.Fill()

	// Now draw the text over the background
	dc.SetColor(textColor)
	dc.DrawStringAnchored(text, float64(anchor.X), float64(anchor.Y)+(float64(height)/2), 0.5, 0.5)
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
