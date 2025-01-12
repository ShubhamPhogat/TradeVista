cd backend -1  
run npm i  
open cmd and run  
  1. docker volume create redis-volume  
  2. docker run --name redis-container-api-engine -p 6379:6379 -v redis-volume:/data -d redis
  3. docker run --name redis-container-engine-db -p 6380:6379 -v redis-volume:/data -d redis   
  4. docker volume create postgreVolume  
  4.docker run -d --name timescale-container-2 -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=1234567V
ISTA -p 5432:5432 timescale/timescaledb:latest-pg14    
nodemon index  
cd ..  
cd engine  
nodemon index  
order create route -http://localhost:3000/api/v1/order  (post req)  
order format  
  {"market":"BTC",
  "side":"sell",
  "quantity":4,
  "price":22817,
  "user_id":"alsdfypq92374e-3290uejqdw",
  "quoteAsset":"USD",
  "baseAsset":"BTC",
  "ioc":false
    
  }     
  kline data route  http://localhost:3000/api/v1/Kline   (post req)  

  format    
  {
    "interval":"1m",
    "market":"BTC"
}    
market should be BTC only 
