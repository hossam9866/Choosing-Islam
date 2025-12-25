Choosing Islam (One-page SPA)

Files:
- index.html
- css/style.css
- js/app.js
- data/*.json (mock APIs)
- assets/logo.svg

How to run locally:
- Use any local server (recommended). Example:
  - VSCode Live Server, or
  - python -m http.server 8000
Then open: http://localhost:8000/choosing-islam/

Replace with real APIs:
- In js/app.js, replace api.getBooks/getArticles/... methods with real endpoints.
- Keep the JSON structure the same to avoid UI changes.

Notes:
- Books click opens a "detail page" in the middle with Back button + PDF iframe + download.
- Mobile shows a top bar with a menu button; categories open in a Bootstrap offcanvas.
