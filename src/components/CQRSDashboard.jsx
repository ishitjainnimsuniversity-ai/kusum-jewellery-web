import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Cpu, Database, RefreshCw, Send, Play } from 'lucide-react';

export default function CQRSDashboard() {
  const [activeTab, setActiveTab] = useState('go');
  const [activeFlow, setActiveFlow] = useState(null); // 'command' or 'query'
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), tag: 'info', msg: 'System initialized. CQRS CQRS Engine ready.' },
    { time: new Date().toLocaleTimeString(), tag: 'info', msg: 'Read models synced with PostgreSQL primary.' }
  ]);
  
  const consoleEndRef = useRef(null);

  const addLog = (tag, msg) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), tag, msg }]);
  };

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollTop = consoleEndRef.current.scrollHeight;
    }
  }, [logs]);

  // Code snippets for each language implementing CQRS microservices
  const codeSnippets = {
    go: `// Go Service: Command API Gateway (gRPC & HTTP Rest Router)
// File: services/commands/main.go
package main

import (
    "context"
    "log"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

type PlaceOrderCommand struct {
    OrderID    string  \`json:"order_id"\`
    DesignCode string  \`json:"design_code"\`
    Price      float64 \`json:"price"\`
    Quantity   int     \`json:"quantity"\`
}

func main() {
    r := gin.Default()
    r.POST("/api/commands/place-order", func(c *gin.Context) {
        var cmd PlaceOrderCommand
        if err := c.ShouldBindJSON(&cmd); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        cmd.OrderID = uuid.New().String()
        
        // Dispatch to Command Handler (writes to OLTP DB)
        err := DispatchCommand(context.Background(), cmd)
        if err != nil {
            c.JSON(500, gin.H{"status": "Failed", "error": err.Error()})
            return
        }
        
        c.JSON(202, gin.H{
            "status": "Accepted", 
            "message": "PlaceOrderCommand queued.", 
            "id": cmd.OrderID,
        })
    })
    log.Fatal(r.Run(":8080"))
}`,
    java: `// Java Service: Write-Model Sync & ACID Transactions (Spring Boot)
// File: services/write-model/WriteModelSync.java
package com.kusum.jewellery.writemodel;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Service
public class WriteModelSync {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void executeOrderCommand(OrderCommand cmd) {
        // Enforce strong consistency constraints on the write model
        System.out.println("Processing ACID transaction for order " + cmd.getOrderId());
        
        // Insert into highly-normalized SQL Write Database (OLTP)
        entityManager.createNativeQuery(
            "INSERT INTO orders (id, design_code, amount, qty, created_at) VALUES (?, ?, ?, ?, NOW())")
            .setParameter(1, cmd.getOrderId())
            .setParameter(2, cmd.getDesignCode())
            .setParameter(3, cmd.getPrice())
            .setParameter(4, cmd.getQuantity())
            .executeUpdate();

        // Dispatch OrderPlacedEvent to Kafka/RabbitMQ Message Bus
        EventBus.publish("orders.placed", new OrderPlacedEvent(
            cmd.getOrderId(), cmd.getDesignCode(), cmd.getPrice()
        ));
        
        System.out.println("Event orders.placed dispatched successfully.");
    }
}`,
    csharp: `// C# .NET Service: Read-Model Projector (Kafka Listener)
// File: services/projections/OrderProjector.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
import Newtonsoft.Json;
import StackExchange.Redis;

namespace Kusum.Jewellery.Projections
{
    public class OrderProjector
    {
        private readonly IDatabase _redisReadDb;
        private readonly string _kafkaTopic = "orders.placed";

        public OrderProjector(ConnectionMultiplexer redisConnection)
        {
            _redisReadDb = redisConnection.GetDatabase();
        }

        public async Task StartListening(CancellationToken cancellationToken)
        {
            var config = new ConsumerConfig { BootstrapServers = "kafka:9092", GroupId = "read-projectors" };
            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe(_kafkaTopic);

            while (!cancellationToken.IsCancellationRequested)
            {
                var consumeResult = consumer.Consume(cancellationToken);
                var orderEvent = JsonConvert.DeserializeObject<OrderPlacedEvent>(consumeResult.Message.Value);
                
                // Update Read DB (denormalized read cache / OLAP view in Redis)
                string cacheKey = $"analytics:sales:today";
                await _redisReadDb.HashIncrementAsync(cacheKey, orderEvent.DesignCode, orderEvent.Price);
                await _redisReadDb.StringIncrementAsync("analytics:total_sales_count");
                
                Console.WriteLine($"[C# ReadProjector] Projecting event: Order {orderEvent.OrderId} cached.");
            }
        }
    }
}`,
    python: `# Python Query Service: FastAPI high-speed read endpoint (Reads from Cache)
# File: services/query-api/main.py
from fastapi import FastAPI, HTTPException
import redis
import json

app = FastAPI(title="Kusum High-Performance Query API")
redis_client = redis.Redis(host='redis-cache', port=6379, db=0, decode_responses=True)

@app.get("/api/queries/sales-summary")
def get_sales_summary():
    # Read models are pre-projected and ready to query instantly! O(1) performance.
    try:
        total_sales = redis_client.get("analytics:total_sales_count") or 0
        design_sales = redis_client.hgetall("analytics:sales:today") or {}
        
        return {
            "total_orders": int(total_sales),
            "sales_by_design": {k: float(v) for k, v in design_sales.items()},
            "source": "Redis Read Cache (CQRS Projected)"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`,
    ruby: `# Ruby Worker: Order Webhooks & Notification Worker
# File: services/notifications/webhook_worker.rb
require 'sidekiq'
require 'net/http'
require 'uri'

class NotificationWorker
  include Sidekiq::Worker

  def perform(order_id, amount, customer_phone)
    puts "Processing outbound webhook notifications for order: #{order_id}"
    
    # Trigger CRM webhook notification in PHP portal or external API
    uri = URI.parse("http://kusum-analytics/webhooks/order-received")
    header = {'Content-Type': 'application/json'}
    payload = { order_id: order_id, amount: amount, timestamp: Time.now.to_i }

    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = payload.to_json

    response = http.request(request)
    puts "Notification webhook response status: #{response.code}"
  end
end
`,
    php: `<?php
// PHP Service: Webhook analytics receiver & metrics panel
// File: services/analytics/webhook.php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (isset($data['order_id']) && isset($data['amount'])) {
        // Save to analytics logs for audit reporting
        $logFile = '/var/log/kusum_sales.log';
        $logEntry = sprintf("[%s] Order %s received for value ₹%s\\n", 
            date('Y-m-d H:i:s'), 
            $data['order_id'], 
            $data['amount']
        );
        file_put_contents($logFile, $logEntry, FILE_APPEND);

        echo json_encode(["status" => "success", "message" => "PHP Analytics synchronized."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid Payload"]);
    }
}
?>`,
    sql: `-- SQL database schema showing segregation
-- File: database/schema.sql

-- 1. WRITE DATABASE SCHEMA (PostgreSQL - Highly Normalized, ACID Compliant)
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    design_code VARCHAR(30) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    qty INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory (
    design_code VARCHAR(30) PRIMARY KEY,
    stock_count INTEGER NOT NULL,
    reserved_count INTEGER DEFAULT 0
);

-- 2. READ DATABASE SCHEMA (NoSQL Cache representation / Materialized View)
-- Materialized view read-model updated asynchronously via event stream:
CREATE TABLE view_catalog_cache (
    design_code VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calculated_price NUMERIC(12,2),
    weight_grams NUMERIC(6,2),
    stock_status VARCHAR(20)
);
`
  };

  const handleCommand = (cmdType) => {
    if (activeFlow) return;
    setActiveFlow('command');
    
    // Command Pipeline simulation
    addLog('command', `DISPATCH: ${cmdType}Command initiated.`);
    
    setTimeout(() => {
      addLog('info', `Go Router: Accepted command and routed to Java ACID Write controller.`);
    }, 600);

    setTimeout(() => {
      addLog('event', `Java DB Sync: SQL transaction committed successfully. Dispatching Event to Bus.`);
    }, 1200);

    setTimeout(() => {
      addLog('event', `Kafka: Event published. C# Projection listener triggered.`);
    }, 1800);

    setTimeout(() => {
      addLog('info', `C# ReadModel: Projecting updates to Redis cache.`);
      addLog('info', `Ruby Webhook: Triggered notification queue.`);
    }, 2400);

    setTimeout(() => {
      addLog('info', `PHP Analytics: Webhook processed and cached data synchronized.`);
      setActiveFlow(null);
    }, 3000);
  };

  const handleQuery = (queryType) => {
    if (activeFlow) return;
    setActiveFlow('query');

    addLog('query', `QUERY: Fetching read-model: ${queryType}Query.`);

    setTimeout(() => {
      addLog('info', `Python Query API: Requesting pre-projected view from Redis cluster (High Performance).`);
    }, 500);

    setTimeout(() => {
      addLog('info', `Redis: Found cache entry. Return value in 1.4ms. O(1) complexity.`);
      addLog('info', `Result: Operation completed.`);
      setActiveFlow(null);
    }, 1200);
  };

  return (
    <div className="cqrs-section" id="cqrs">
      <div className="section-container" style={{ paddingBottom: '80px' }}>
        <div className="section-header">
          <span className="section-subtitle">System Architecture</span>
          <h2 className="section-title">CQRS & Microservices Dashboard</h2>
        </div>

        <div className="cqrs-grid">
          {/* Interactive CQRS Pipeline Visualizer */}
          <div className="cqrs-map-container">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--light-gold)', marginBottom: '15px' }}>
              Real-time Pipeline Segregation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Click actions below to watch commands update the Write DB (SQL) and queries pull directly from high-speed Read DB (NoSQL/Redis).
            </p>

            <div className="cqrs-map-visual">
              {/* Connector lines overlay */}
              <svg className="cqrs-svg-overlay">
                {/* Client to gates */}
                <path d="M 50 160 Q 100 100 200 95" className={activeFlow === 'command' ? 'active-flow' : ''} />
                <path d="M 50 160 Q 100 220 200 225" className={activeFlow === 'query' ? 'active-flow' : ''} />
                
                {/* Command gate to SQL database */}
                <path d="M 290 95 H 410" className={activeFlow === 'command' ? 'active-flow' : ''} />
                
                {/* SQL db to Event Broker */}
                <path d="M 490 95 Q 540 120 580 150" className={activeFlow === 'command' ? 'active-flow' : ''} />
                
                {/* Event broker to projection */}
                <path d="M 580 150 Q 520 180 490 225" className={activeFlow === 'command' ? 'active-flow' : ''} />
                
                {/* Query gate to Cache */}
                <path d="M 290 225 H 410" className={activeFlow === 'query' ? 'active-flow' : ''} />
              </svg>

              {/* Nodes */}
              <div className={`cqrs-interactive-node node-client ${activeFlow ? 'active' : ''}`}>
                <Cpu size={16} />
                <span>Web Client</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>React App</span>
              </div>

              <div className={`cqrs-interactive-node node-command-gate ${activeFlow === 'command' ? 'active' : ''}`} style={{ borderColor: '#ff9800' }}>
                <Send size={16} />
                <span>Command Router</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Go (Port 8080)</span>
              </div>

              <div className={`cqrs-interactive-node node-query-gate ${activeFlow === 'query' ? 'active' : ''}`} style={{ borderColor: '#00bcd4' }}>
                <Terminal size={16} />
                <span>Query API</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Python (FastAPI)</span>
              </div>

              <div className={`cqrs-interactive-node node-write-db ${activeFlow === 'command' ? 'active' : ''}`} style={{ borderColor: '#e91e63' }}>
                <Database size={16} />
                <span>Write DB (OLTP)</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Java + PostgreSQL</span>
              </div>

              <div className={`cqrs-interactive-node node-read-db ${activeFlow === 'query' ? 'active' : ''}`} style={{ borderColor: '#4caf50' }}>
                <Database size={16} />
                <span>Read Cache</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>C# + Redis DB</span>
              </div>

              <div className={`cqrs-interactive-node node-event-handler ${activeFlow === 'command' ? 'active' : ''}`} style={{ borderColor: '#9c27b0' }}>
                <RefreshCw size={16} />
                <span>Event Bus</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Ruby / Kafka</span>
              </div>
            </div>

            <div className="cqrs-actions-panel">
              <span style={{ fontSize: '0.8rem', color: 'var(--light-gold)', fontWeight: 600 }}>Command Pipeline Simulator:</span>
              <div className="cqrs-trigger-buttons">
                <button className="btn-cqrs-trigger command-btn" onClick={() => handleCommand('PlaceOrder')}>
                  <Play size={12} style={{ color: '#ff9800' }} />
                  <span>PlaceOrder</span>
                </button>
                <button className="btn-cqrs-trigger command-btn" onClick={() => handleCommand('AdjustRates')}>
                  <Play size={12} style={{ color: '#ff9800' }} />
                  <span>UpdateRates</span>
                </button>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--light-gold)', fontWeight: 600, marginTop: '8px' }}>Query Pipeline Simulator:</span>
              <div className="cqrs-trigger-buttons">
                <button className="btn-cqrs-trigger query-btn" onClick={() => handleQuery('GetCatalog')}>
                  <Play size={12} style={{ color: '#00bcd4' }} />
                  <span>FetchCatalog</span>
                </button>
                <button className="btn-cqrs-trigger query-btn" onClick={() => handleQuery('GetAnalytics')}>
                  <Play size={12} style={{ color: '#00bcd4' }} />
                  <span>FetchMetrics</span>
                </button>
              </div>
            </div>

            <div className="event-console" style={{ marginTop: '20px' }} ref={consoleEndRef}>
              {logs.map((log, idx) => (
                <div key={idx} className="console-line">
                  <span className="console-time">[{log.time}]</span>
                  <span className={`console-tag ${log.tag}`}>{log.tag.toUpperCase()}</span>
                  <span className="console-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Source Code Viewer */}
          <div className="code-viewer-container">
            <div className="code-viewer-tabs">
              <button className={`code-tab ${activeTab === 'go' ? 'active' : ''}`} onClick={() => setActiveTab('go')}>
                Go Command API
              </button>
              <button className={`code-tab ${activeTab === 'java' ? 'active' : ''}`} onClick={() => setActiveTab('java')}>
                Java Write DB
              </button>
              <button className={`code-tab ${activeTab === 'csharp' ? 'active' : ''}`} onClick={() => setActiveTab('csharp')}>
                C# Projection
              </button>
              <button className={`code-tab ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>
                Python Query API
              </button>
              <button className={`code-tab ${activeTab === 'ruby' ? 'active' : ''}`} onClick={() => setActiveTab('ruby')}>
                Ruby Queue Worker
              </button>
              <button className={`code-tab ${activeTab === 'php' ? 'active' : ''}`} onClick={() => setActiveTab('php')}>
                PHP Analytics
              </button>
              <button className={`code-tab ${activeTab === 'sql' ? 'active' : ''}`} onClick={() => setActiveTab('sql')}>
                SQL Schema
              </button>
            </div>
            
            <div className="code-display-panel">
              <pre>
                <code>{codeSnippets[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
