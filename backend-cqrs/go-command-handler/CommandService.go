// Go Service: Command API Gateway (gRPC & HTTP Rest Router)
// File: services/commands/CommandService.go
package main

import (
    "context"
    "errors"
    "log"
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

// PlaceOrderCommand defines the payload for placing an order
type PlaceOrderCommand struct {
    OrderID    string    `json:"order_id"`
    DesignCode string    `json:"design_code"`
    Price      float64   `json:"price"`
    Quantity   int       `json:"quantity"`
    Timestamp  time.Time `json:"timestamp"`
}

// AdjustRatesCommand defines the payload for adjusting live rates
type AdjustRatesCommand struct {
    MetalType string    `json:"metal_type"`
    NewRate   float64   `json:"new_rate"`
    Timestamp time.Time `json:"timestamp"`
}

// DispatchCommand simulates routing the command to the Write database stack (Java layer)
func DispatchCommand(ctx context.Context, cmd interface{}) error {
    log.Printf("[Go Command Router] Dispatching command: %T to Message Queue", cmd)
    // Simulating message broker routing
    time.Sleep(100 * time.Millisecond)
    return nil
}

func main() {
    r := gin.Default()
    
    // Command Endpoint: Place Order
    r.POST("/api/commands/place-order", func(c *gin.Context) {
        var cmd PlaceOrderCommand
        if err := c.ShouldBindJSON(&cmd); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"status": "Error", "message": err.Error()})
            return
        }
        cmd.OrderID = uuid.New().String()
        cmd.Timestamp = time.Now()
        
        // Dispatch to Write Stack
        if err := DispatchCommand(context.Background(), cmd); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "Failed", "error": err.Error()})
            return
        }
        
        c.JSON(http.StatusAccepted, gin.H{
            "status": "Accepted", 
            "message": "PlaceOrderCommand successfully accepted by Go routing engine.", 
            "order_id": cmd.OrderID,
        })
    })

    // Command Endpoint: Update Live Rates
    r.POST("/api/commands/adjust-rates", func(c *gin.Context) {
        var cmd AdjustRatesCommand
        if err := c.ShouldBindJSON(&cmd); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"status": "Error", "message": err.Error()})
            return
        }
        cmd.Timestamp = time.Now()

        if err := DispatchCommand(context.Background(), cmd); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "Failed", "error": err.Error()})
            return
        }

        c.JSON(http.StatusAccepted, gin.H{
            "status": "Accepted",
            "message": "AdjustRatesCommand accepted and event projection started.",
        })
    })

    log.Printf("[Go Engine] Starting Command API Gateway on Port :8080")
    log.Fatal(r.Run(":8080"))
}
