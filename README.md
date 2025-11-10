# QR Code Generator (FastAPI)

A simple and lightweight **QR Code Generator** built with **FastAPI**, **Jinja2**, and the **qrcode** library.  
Enter any text/URL to generate a QR code, preview it in the browser, or download it as a PNG.

---

## ✨ Features
- Generate QR codes from any text or URL
- Instant browser preview
- Download as PNG (`qr_code.png`)
- Minimal UI using Jinja2 templates
- Fast, production‑ready backend with FastAPI/uvicorn

---

## 📦 Requirements
- Python 3.9+
- Packages: `fastapi`, `uvicorn`, `qrcode`, `pillow`, `jinja2`
- (Optional) Docker & Docker Compose v2+

---

## 🗂️ Project Structure
```
project/
│── app.py
│── templates/
│     └── index.html
│── static/
│     └── (CSS/JS assets, optional)
│── README.md
│── Dockerfile              # (you already have this)
│── docker-compose.yml      # (you already have this)
```
> **Note:** `app.py` mounts `./templates` and `./static`. Ensure those directories exist.

---

## 🚀 Quick Start (Local)

```bash
# 1) (Optional) create & activate a virtual environment
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 2) Install dependencies
pip install fastapi uvicorn qrcode pillow jinja2

# 3) Run the server
uvicorn app:app --reload --host 0.0.0.0 --port 8080

# 4) Open in browser
# http://localhost:8080
```

FastAPI interactive docs are available at:
- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`

---

## 🐳 Run with Docker

You mentioned you already have a **Dockerfile** and **docker-compose.yml**.  
To build and run with **Docker Compose v2** the correct command is:

```bash
docker compose up -d --build
```

> If your system still uses the legacy v1 CLI, use:
> ```bash
> docker-compose up -d --build
> ```

### Example `docker-compose.yml` (reference)
> *Use this only if you need a template; otherwise keep your existing file.*
```yaml
services:
  qr-generator:
    build: .
    container_name: qr-generator
    ports:
      - "8080:8080"
    environment:
      # Add env vars if you introduce any in the future
      # EXAMPLE_BASE_URL: "http://localhost:8080"
      UVICORN_HOST: "0.0.0.0"
      UVICORN_PORT: "8080"
    command: uvicorn app:app --host 0.0.0.0 --port 8080
    volumes:
      - ./templates:/app/templates:ro
      - ./static:/app/static:ro
    restart: unless-stopped
```

### Example `Dockerfile` (reference)
```Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system deps for Pillow (PNG/JPEG)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . /app

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Example `requirements.txt` (reference)
```
fastapi
uvicorn[standard]
qrcode
pillow
jinja2
```

---

## 🔌 API Endpoints

### `GET /`
Renders the main HTML page for entering text and generating a QR code.

### `POST /generate`
Generate a QR code from JSON body and return **PNG bytes**.

**Request body**
```json
{ "text": "hello world" }
```

**cURL**
```bash
curl -s -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "https://example.com"}' > qr_code.png
```

### `GET /download?text=<VALUE>`
Generate and download a PNG file named **qr_code.png**.

**Example**
```bash
curl -L "http://localhost:8080/download?text=Hello%20World" -o qr_code.png
```

> If `text` is missing, the API returns: `{ "error": "No text provided" }`

---

## 🧠 How It Works
- The backend uses the `qrcode` library to create a QR image from the supplied `text`.
- Images are generated in memory using `io.BytesIO()` and returned as `image/png`.
- `/generate` returns the raw image bytes for inline display; `/download` adds a `Content-Disposition` header to trigger download.

---

## 🧪 Health Check (optional)
A simple readiness check can be added by hitting `/` or by adding a minimal `/healthz` endpoint if needed.

---

## 🧩 Customization Tips
- **Error handling**: validate length/format of `text` or add rate limiting.
- **Branding/UI**: add CSS/JS under `static/` and update `templates/index.html`.
- **QR options**: switch from `qrcode.make(text)` to the advanced API to control version, box size, border, error correction, colors, etc.

Example:
```python
import qrcode
from qrcode.constants import ERROR_CORRECT_M

qr = qrcode.QRCode(
    version=1,
    error_correction=ERROR_CORRECT_M,
    box_size=10,
    border=4,
)
qr.add_data(text)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
```

---

## 🐛 Troubleshooting
- **404 for `/`**: Ensure `templates/index.html` exists and `Jinja2` is installed.
- **Broken images**: Confirm `pillow` is installed; it’s required by `qrcode` for PNG output.
- **Static files not loading**: Make sure `static/` exists and is mounted (Docker volume example above).

---

## 📄 License
MIT (or your preferred license)

---

## 🙌 Acknowledgements
- [FastAPI](https://fastapi.tiangolo.com/)
- [qrcode](https://pypi.org/project/qrcode/)
- [Jinja2](https://jinja.palletsprojects.com/)
- [Uvicorn](https://www.uvicorn.org/)
