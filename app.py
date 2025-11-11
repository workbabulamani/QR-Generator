from fastapi import FastAPI, Response, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import qrcode
import io

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/generate")
async def generate_qr(data: dict):
    text = data.get("text")
    if not text:
        return {"error": "No text provided"}

    img = qrcode.make(text)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return Response(content=buf.getvalue(), media_type="image/png")

@app.get("/download")
async def download_qr(text: str):
    if not text:
        return {"error": "No text provided"}

    img = qrcode.make(text)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    headers = {"Content-Disposition": "attachment; filename=qr_code.png"}
    return Response(content=buf.getvalue(), media_type="image/png", headers=headers)
