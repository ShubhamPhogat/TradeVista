cd backend -1  
run npm i  
open cmd and run  
  1. docker volume create redis-volume  
  2. docker run --name redis-container -p 6379:6379 -v redis-volume:/data -d redis   
  3. docker volume create postgreVolume  
  4. docker run --name postgresContainer -e POSTGRES_PASSWORD=1234567VISTA -e POSTGRES_USER=myuser -p 5432:5432 -v postgresVolume:/var/lib/postgresql/data\ postgres  
nodemon index  
cd ..  
cd engine  
nodemon index  
