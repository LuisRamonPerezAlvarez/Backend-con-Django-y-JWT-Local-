import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    # 1. Captura de Swagger UI general
    print("Capturando Swagger UI...")
    page.goto("http://127.0.0.1:8000/swagger/")
    page.wait_for_selector(".swagger-ui")
    time.sleep(2)
    page.screenshot(path="evidencias/01_swagger_general.png", full_page=True)

    # 2. Desplegar endpoints de auth y users
    print("Desplegando endpoints en Swagger...")
    # Click en los encabezados de tags para abrirlos si están cerrados
    tags = page.query_selector_all(".opblock-tag")
    for t in tags:
        t.click()
        time.sleep(0.5)

    time.sleep(1)
    page.screenshot(path="evidencias/02_swagger_endpoints.png", full_page=False)

    browser.close()
    print("Capturas de Swagger finalizadas.")

