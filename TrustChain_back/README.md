# TrustChain Backend

This is the backend server for the TrustChain application built with FastAPI and MongoDB.

## Prerequisites

- Python 3.11 or higher
- MongoDB installed and running on localhost:27017
- Git (optional)

## Installation Steps

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

- Windows:

```bash
.\venv\Scripts\activate
```

- Linux/Mac:

```bash
source venv/bin/activate
```

3. Install the required packages:

```bash
pip install -r requirements.txt
```

## Configuration

Make sure MongoDB is running on your system. The application expects MongoDB to be running on:

- Host: localhost
- Port: 27017
- Database name: Users
- Collection name: info

## Running the Application

1. Make sure you're in the TrustChain-back directory
2. Activate the virtual environment (if not already activated)
3. Run the FastAPI application:

```bash
uvicorn main:app --reload --port 8001
```

## Accessing the API

- Swagger UI (API Documentation): http://localhost:8001/docs
- Alternative API Documentation: http://localhost:8001/redoc
- Base API URL: http://localhost:8001

## Available Endpoints

- GET /users - List all users or filter by name
- POST /users - Create a new user
- GET /users/{user_id} - Get a specific user
- PUT /users/{user_id} - Update a user
- DELETE /users/{user_id} - Delete a user

## Troubleshooting

1. If you get a "Port already in use" error:

   - Make sure no other application is using port 8001
   - Or change the port number in the command: `uvicorn main:app --reload --port <different_port>`

2. If MongoDB connection fails:

   - Verify MongoDB is running: `mongosh`
   - Check MongoDB service status
   - Ensure MongoDB is listening on default port 27017

3. If packages are missing:
   - Ensure you're in the virtual environment (you should see `(venv)` in your terminal)
   - Run `pip install -r requirements.txt` again

## Development

For debugging, you can run the application using VS Code's debugger:

1. Open the project in VS Code
2. Select the Python interpreter from the virtual environment
3. Press F5 to start debugging
4. The Swagger UI will be available at http://localhost:8001/docs



## JWT dependencies

1. pip install "python-jose[cryptography]"
2. pip install "passlib[bcrypt]"
3. pip install python-multipart