from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            # Forward the request to Node.js server
            response = requests.get(f'http://127.0.0.1:3001{self.path}')
            
            # Send response back to client
            self.send_response(response.status_code)
            for key, value in response.headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(response.content)
            
        except Exception as e:
            print(f"Error: {e}")
            self.send_error(500, f"Error: {e}")

print("Starting proxy server on port 8000...")
print("Try these URLs in your browser:")
print("  http://localhost:8000/health")
print("  http://localhost:8000/test")
HTTPServer(('', 8000), ProxyHandler).serve_forever() 