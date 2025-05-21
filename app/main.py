from fastapi import FastAPI

app = FastAPI()

'''
Create API routes,
- GET / : returns a welcome message
- GET /user/(number) : returns user info at that number
'''

app.get("/")
	def read_root():
		return {"message": "Welcome to the News Recommendation Engine!"}

app.get("/user/{user_id}")
	def get_user(user_id: int):
		return {"user_id": user_id}