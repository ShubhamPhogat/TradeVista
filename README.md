# Backend Setup Guide

## 1. Install Dependencies
```bash
cd backend-1  
npm install  
```

## 2. Setup Redis Containers
Run the following commands in **Command Prompt (cmd)**:
```bash
docker volume create redis-volume  

docker run --name redis-container-api-engine -p 6379:6379 -v redis-volume:/data -d redis  

docker run --name redis-container-engine-db -p 6380:6379 -v redis-volume:/data -d redis  
```

## 3. Setup PostgreSQL (TimescaleDB)
```bash
docker volume create postgreVolume  

docker run -d --name timescale-container-2 \  
  -e POSTGRES_USER=myuser \  
  -e POSTGRES_PASSWORD=1234567VISTA \  
  -p 5432:5432 timescale/timescaledb:latest-pg14  
```

## 4. Start Backend Services
Run the following commands in separate terminals:

### Start Services 
```bash
chmod +x  startBackends.sh
./startBackends.sh  
```

## 5. API Endpoints
### **Order Creation Route**
**URL:** `http://localhost:3000/api/v1/order`  
**Method:** `POST`

#### **Request Body Format:**
```json
{
  "market": "BTC",
  "side": "sell",
  "quantity": 4,
  "price": 22817,
  "user_id": "alsdfypq92374e-3290uejqdw",
  "quoteAsset": "USD",
  "baseAsset": "BTC",
  "ioc": false
}
```

### **Kline Data Route**
**URL:** `http://localhost:3000/api/v1/Kline`  
**Method:** `POST`

#### **Request Body Format:**
```json
{
  "interval": "1m",
  "market": "BTC"
}
```

**Note:** `market` should be **BTC** only.

------------
