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
	"github.com/nfnt/resize"
	"github.com/skip2/go-qrcode"
)

const (
	logoPath       = "./logo_small.png"
	fontPath       = "./GeistVF.ttf"
	boldFontPath   = "./Geist-SemiBold.ttf"
	qrCodeSize     = 512
	bannerHeight   = 40
	titleFontSize  = 20.0
	bottomFontSize = 20.0
	margin         = 10
	bottomText     = "If found, please scan the QR code to return to owner"
	padding        = 20 // Padding for the QR code
	outerPadding   = 15 // Padding for the whole sticker
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

func generateQRCodewithOverlay(title, bottomText, url string) (*image.RGBA, error) {
	qrCode, err := createQRCode(url)
	if err != nil {
		return nil, err
	}

	// Adjust calculations for the sticker dimensions to include the outer padding
	stickerWidth := qrCodeSize + 2*padding + 2*outerPadding
	stickerHeight := qrCodeSize + 2*padding + bannerHeight + 2*titleFontSize + 3*margin + 2*outerPadding

	img := image.NewRGBA(image.Rect(0, 0, stickerWidth, int(stickerHeight)))
	dc := gg.NewContextForRGBA(img)

	// Draw a full red background for the sticker
	redBackgroundRadius := 25.0               // This sets the radius for the rounded corners
	dc.SetColor(color.RGBA{238, 30, 19, 255}) // Set the color for the rounded rectangle
	dc.DrawRoundedRectangle(0, 0, float64(stickerWidth), float64(stickerHeight), redBackgroundRadius)
	dc.Fill()

	// Calculate the position to center the QR code within the sticker, considering the outer padding
	qrCodeX := (stickerWidth - qrCodeSize) / 2
	qrCodeY := (stickerHeight - qrCodeSize - bannerHeight - 2*padding - 2*outerPadding) / 2

	// Draw a white rectangle as the background for the QR code with padding
	whiteRectX := qrCodeX - padding
	whiteRectY := qrCodeY - padding
	whiteRectWidth := qrCodeSize + 2*padding
	whiteRectHeight := qrCodeSize + 2*padding
	drawRoundedRectangle(dc, image.Rect(whiteRectX, int(whiteRectY), whiteRectX+whiteRectWidth, int(whiteRectY)+whiteRectHeight), 20, color.White)

	// Draw QR code onto the white rectangle with padding
	draw.Draw(img, image.Rect(qrCodeX, int(qrCodeY), qrCodeX+qrCodeSize, int(qrCodeY)+qrCodeSize), qrCode, image.Point{X: 0, Y: 0}, draw.Src)

	// Draw logo
	if err := drawLogo(dc, logoPath, 125, 125, stickerWidth); err != nil {
		return nil, err
	}

	// Add title and bottom text below the QR code, adjusted for outer padding
	addTextOverlay(dc, title, bottomText, stickerWidth, int(stickerHeight))

	return img, nil
}

// drawRoundedRectangle draws a rounded rectangle with the specified parameters
func drawRoundedRectangle(dc *gg.Context, rect image.Rectangle, radius float64, color color.Color) {
	dc.SetColor(color)
	dc.DrawRoundedRectangle(float64(rect.Min.X), float64(rect.Min.Y), float64(rect.Dx()), float64(rect.Dy()), radius)
	dc.Fill()
}

func createQRCode(url string) (image.Image, error) {
	qrCode, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		return nil, err
	}

	qrCode.DisableBorder = true
	return qrCode.Image(qrCodeSize), nil
}

func drawLogo(dc *gg.Context, logoPath string, width, height int, stickerWidth int) error {
	logoImage, err := loadLogoImage(logoPath)
	if err != nil {
		return err
	}

	logoWidth := float64(stickerWidth) * 0.2
	logoX := (float64(stickerWidth) - logoWidth) / 2
	dc.DrawImage(Resize(logoImage, width, height), int(logoX), qrCodeSize/2-height/2+bannerHeight)
	return nil
}

// Resize resizes an image to the specified width and height
func Resize(img image.Image, width, height int) image.Image {
	return resize.Resize(uint(width), uint(height), img, resize.Lanczos3)
}

func addTextOverlay(dc *gg.Context, title, bottomText string, width, height int) {
	// Draw a rectangle as the banner background with the width of the sitcker minus the outer padding
	dc.SetColor(color.RGBA{249, 172, 168, 255})
	dc.DrawRoundedRectangle(outerPadding, qrCodeSize+padding+bannerHeight+margin-5, float64(width-2*outerPadding), bannerHeight, 10)
	dc.Fill()

	// Draw the title text in the center of the banner
	// Calculate the position to center the text within the banner
	// The text is centered horizontally and vertically

	drawText(dc, title, titleFontSize, float64(width)/2, float64(qrCodeSize+padding+bannerHeight+25), color.RGBA{238, 30, 19, 255}, fontPath)

	// Draw the "Scan me" text below the title aligned to the center
	drawText(dc, bottomText, bottomFontSize, float64(width)/2, float64(qrCodeSize+padding+bannerHeight+2*titleFontSize+margin+25), color.White, boldFontPath)

}

// drawText draws text on the image
func drawText(dc *gg.Context, text string, fontSize float64, x, y float64, color color.Color, fontPath string) {
	if err := dc.LoadFontFace(fontPath, fontSize); err != nil {
		fmt.Printf("Failed to load font face: %v\n", err)
		return
	}

	dc.SetColor(color)
	dc.DrawStringAnchored(text, x, y, 0.5, 0.5)
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
