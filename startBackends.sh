#!/bin/bash

echo "Starting Backend 1..."
cd backend-1
npm run dev &  # Run in background

cd ..

echo "Starting Backend 2..."
cd backend-2
npm run dev &  # Run in background

cd ..

echo "Starting Engine..."
cd engine
npm run dev &  # Run in background

cd ..

echo "Starting realTimeEngine..."
cd realTimeEngine
npm run dev &  # Run in background

echo "All backends started!"

# Keep script running until all processes finish
wait
