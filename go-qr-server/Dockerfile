# Use an official Golang runtime as a parent image
FROM golang:latest as builder

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the local package files to the container's workspace.
COPY . .

# Download and install any required third party dependencies
RUN go mod download

# Build the Go app for linux and disable CGO
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -v -o server

# Now use a lightweight Alpine image to run the app
FROM alpine:latest

# Add ca-certificates in case you need them
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /root/

# Copy the binary from the builder stage to the production image
COPY --from=builder /go/src/app/server .
COPY . .

# Make the port 3000 available to the world outside this container
EXPOSE 8000

# Run the binary when the container starts
CMD ["./server"]
