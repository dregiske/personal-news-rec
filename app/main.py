from fastapi import FastAPI
from app.api.routes import users

app = FastAPI()

# Register the user routes
app.include_router(users.router)