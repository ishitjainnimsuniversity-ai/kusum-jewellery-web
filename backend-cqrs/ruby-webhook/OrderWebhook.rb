# Ruby Worker: Order Webhooks & Notification Worker
# File: OrderWebhook.rb
require 'sidekiq'
require 'net/http'
require 'uri'
require 'json'

class OrderWebhook
  include Sidekiq::Worker
  sidekiq_options queue: 'notifications', retry: 3

  # Asynchronous background job triggered by Write event projections
  def perform(order_id, amount, customer_phone)
    puts "[Ruby NotificationWorker] Dispatching order webhook notification for order ID: #{order_id}"
    
    # 1. Target URL representing the PHP admin integration
    uri = URI.parse("http://kusum-analytics/webhooks/order-received")
    header = { 'Content-Type': 'application/json' }
    
    payload = {
      order_id: order_id,
      amount: amount,
      customer_phone: customer_phone,
      dispatch_time: Time.now.to_i
    }

    # 2. Execute POST request
    begin
      http = Net::HTTP.new(uri.host, uri.port)
      http.read_timeout = 5 # 5 seconds limit
      http.open_timeout = 5
      
      request = Net::HTTP::Post.new(uri.request_uri, header)
      request.body = payload.to_json

      response = http.request(request)
      
      if response.code == "200"
        puts "[Ruby Worker] Webhook processed successfully by PHP server: #{response.body}"
      else
        puts "[Ruby Worker] Webhook failed. HTTP Status: #{response.code}"
        raise "PHP Analytics server error: #{response.code}"
      end
    rescue => e
      puts "[Ruby Worker] Webhook execution exception: #{e.message}"
      # Let Sidekiq retry mechanism handle exponential backoff
      raise e
    end
  end
end
