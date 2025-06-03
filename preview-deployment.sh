#!/bin/bash
echo "Preview the deployment at: http://localhost:8080/portfolio/"
echo "Press Ctrl+C to stop the server"
cd dist && python3 -m http.server 8080 --bind 127.0.0.1