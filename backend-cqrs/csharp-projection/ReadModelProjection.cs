// C# .NET Service: Read-Model Projector (Kafka Listener)
// File: ReadModelProjection.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Kusum.Jewellery.Projections
{
    public class ReadModelProjection
    {
        private readonly IDatabase _redisReadDb;
        private readonly string _kafkaTopic = "orders.placed";

        public ReadModelProjection(ConnectionMultiplexer redisConnection)
        {
            _redisReadDb = redisConnection.GetDatabase();
        }

        public async Task StartListening(CancellationToken cancellationToken)
        {
            var config = new ConsumerConfig 
            { 
                BootstrapServers = "kafka:9092", 
                GroupId = "read-projectors",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe(_kafkaTopic);

            Console.WriteLine("[C# Projection Engine] Listening for Kafka events...");

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var consumeResult = consumer.Consume(cancellationToken);
                    var eventPayload = consumeResult.Message.Value;
                    
                    var orderEvent = JsonConvert.DeserializeObject<OrderPlacedEvent>(eventPayload);
                    
                    // Increment overall order metrics
                    await _redisReadDb.StringIncrementAsync("analytics:total_sales_count");
                    
                    // Update denormalized sales by design code
                    string salesHashKey = "analytics:sales:today";
                    await _redisReadDb.HashIncrementAsync(salesHashKey, orderEvent.DesignCode, orderEvent.Price * orderEvent.Quantity);
                    
                    Console.WriteLine($"[C# ReadProjector] Projecting event: Order {orderEvent.OrderId} cached. Read DB synchronized.");
                }
            }
            catch (OperationCanceledException)
            {
                consumer.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[C# Error] Exception in projection listener: {ex.Message}");
            }
        }
    }

    public class OrderPlacedEvent
    {
        public string OrderId { get; set; }
        public string DesignCode { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
