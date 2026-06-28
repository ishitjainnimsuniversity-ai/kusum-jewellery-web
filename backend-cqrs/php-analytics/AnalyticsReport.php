<?php
// PHP Service: Webhook analytics receiver & metrics panel
// File: AnalyticsReport.php

header('Content-Type: application/json');
date_default_timezone_set('Asia/Kolkata');

/**
 * Kusum Imitation Jewellery
 * PHP microservice to receive order analytics webhooks and generate audit logs.
 */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read raw input stream
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (isset($data['order_id']) && isset($data['amount'])) {
        $logFile = '/var/log/kusum_sales.log';
        
        // Format log entry
        $logEntry = sprintf("[%s] Order: %s | Amount: ₹%s | Client: %s\n", 
            date('Y-m-d H:i:s'), 
            $data['order_id'], 
            number_format($data['amount'], 2),
            $data['customer_phone'] ?? 'Guest'
        );

        // Append to analytics log file
        $success = file_put_contents($logFile, $logEntry, FILE_APPEND);

        if ($success !== false) {
            echo json_encode([
                "status" => "success",
                "message" => "PHP Analytics receiver processed successfully.",
                "timestamp" => time()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to write logs to disk."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Malformed Payload - missing order_id or amount."]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Generate analytics summaries for the admin dashboard
    $logFile = '/var/log/kusum_sales.log';
    
    if (file_exists($logFile)) {
        $lines = file($logFile);
        $totalSales = 0;
        $orderCount = count($lines);
        
        foreach ($lines as $line) {
            if (preg_match('/Amount: ₹([0-9,.]+)/', $line, $matches)) {
                $amt = str_replace(',', '', $matches[1]);
                $totalSales += floatval($amt);
            }
        }

        echo json_encode([
            "total_sales_value" => $totalSales,
            "total_orders" => $orderCount,
            "last_logs" => array_slice(array_reverse($lines), 0, 10),
            "generated_at" => date('Y-m-d H:i:s')
        ]);
    } else {
        echo json_encode([
            "total_sales_value" => 0.0,
            "total_orders" => 0,
            "message" => "No sales records found on this instance."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
}
?>
