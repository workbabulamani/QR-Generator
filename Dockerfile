# Use a lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency file and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code
COPY . .

# Expose FastAPI's default port
EXPOSE 8080

# Run FastAPI using uvicorn
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--root-path", "/qrcode", "--proxy-headers"]
# CMD ["uvicorn", "app:app",
#      "--host", "0.0.0.0",
#      "--port", "8080",
#      "--root-path", "/qrcode",
#      "--proxy-headers",
#      "--forwarded-allow-ips", "*"]
CMD ["uvicorn", "app:app",
     "--host", "0.0.0.0",
     "--port", "8080",
     "--root-path", "/qrcode",
     "--proxy-headers",
     "--forwarded-allow-ips", "192.168.0.10"]

