// Java Service: Write-Model Sync & ACID Transactions (Spring Boot)
// File: WriteDatabaseSync.java
package com.kusum.jewellery.writemodel;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.time.LocalDateTime;

@Service
public class WriteDatabaseSync {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Executes the Order command. By utilizing Spring's Transactional annotation,
     * we guarantee that any insertion in PostgreSQL Write Database follows strict
     * ACID principles.
     */
    @Transactional
    public void executeOrderCommand(OrderCommand cmd) throws Exception {
        System.out.println("[Java Write-Stack] Processing ACID transaction for order " + cmd.getOrderId());
        
        // 1. Enforce business rules/invariants (e.g. check stock)
        Integer stock = (Integer) entityManager.createNativeQuery(
            "SELECT stock_count FROM inventory WHERE design_code = ? FOR UPDATE")
            .setParameter(1, cmd.getDesignCode())
            .getSingleResult();
            
        if (stock == null || stock < cmd.getQuantity()) {
            throw new Exception("Inventory stock check failed. Out of stock!");
        }

        // 2. Insert order record into relational tables (3NF schema)
        entityManager.createNativeQuery(
            "INSERT INTO orders (id, design_code, amount, qty, created_at) VALUES (?, ?, ?, ?, NOW())")
            .setParameter(1, cmd.getOrderId())
            .setParameter(2, cmd.getDesignCode())
            .setParameter(3, cmd.getPrice())
            .setParameter(4, cmd.getQuantity())
            .executeUpdate();

        // 3. Update stock levels in inventory table
        entityManager.createNativeQuery(
            "UPDATE inventory SET stock_count = stock_count - ? WHERE design_code = ?")
            .setParameter(1, cmd.getQuantity())
            .setParameter(2, cmd.getDesignCode())
            .executeUpdate();

        // 4. Dispatch OrderPlacedEvent to Message Broker (RabbitMQ / Kafka)
        OrderPlacedEvent event = new OrderPlacedEvent(
            cmd.getOrderId(), cmd.getDesignCode(), cmd.getPrice(), cmd.getQuantity(), LocalDateTime.now()
        );
        EventBus.publish("orders.placed", event);
        
        System.out.println("[Java Write-Stack] ACID transaction committed. Event published to bus.");
    }
}

class OrderCommand implements Serializable {
    private String orderId;
    private String designCode;
    private double price;
    private int quantity;

    public String getOrderId() { return orderId; }
    public String getDesignCode() { return designCode; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
}

class OrderPlacedEvent implements Serializable {
    private String orderId;
    private String designCode;
    private double price;
    private int quantity;
    private LocalDateTime timestamp;

    public OrderPlacedEvent(String orderId, String designCode, double price, int quantity, LocalDateTime timestamp) {
        this.orderId = orderId;
        this.designCode = designCode;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }
}

class EventBus {
    public static void publish(String topic, Object event) {
        // System simulation of sending to Kafka broker
        System.out.println("Kafka Producer: Message sent to topic " + topic);
    }
}
