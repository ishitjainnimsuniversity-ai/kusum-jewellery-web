# Python Query Service: FastAPI high-speed read endpoint (Reads from Cache)
# File: PriceQueryService.py
import os
import redis
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Kusum High-Performance Query API",
    description="High performance query service optimized for read models in Redis."
)

# Enable CORS for frontend React requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis Read Database cache
redis_host = os.getenv("REDIS_HOST", "redis-cache")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)

class PriceResponse(BaseModel):
    design_code: str
    base_price: float
    gst_included: float
    source: str

@app.get("/api/queries/sales-summary")
def get_sales_summary():
    """
    CQRS Query Stack: Fetches pre-projected sales metrics from Redis.
    No complex joins or locking database reads required. O(1) read latency.
    """
    try:
        total_sales = redis_client.get("analytics:total_sales_count") or 0
        design_sales = redis_client.hgetall("analytics:sales:today") or {}
        
        return {
            "total_orders": int(total_sales),
            "sales_by_design": {k: float(v) for k, v in design_sales.items()},
            "source": "Redis Read Cache (CQRS Projected)"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failure: {str(e)}")

@app.get("/api/queries/product-price/{design_code}", response_model=PriceResponse)
def get_product_price(design_code: str):
    """
    Fetches pre-calculated transparent pricing details from cache.
    """
    cache_key = f"catalog:product:{design_code}"
    cached_data = redis_client.get(cache_key)
    
    if not cached_data:
        # Fallback to query read replica database if cache misses
        raise HTTPException(status_code=404, detail="Product cache not loaded.")
        
    data = json.loads(cached_data)
    return PriceResponse(
        design_code=design_code,
        base_price=data.get("base_price", 0.0),
        gst_included=data.get("total_price", 0.0),
        source="Redis Read Cache"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
