# Shop Website - FastAPI Backend & React Frontend

This repository contains the source code for a simple e-commerce website. The backend is built with FastAPI, and the frontend is developed using React. The project leverages Celery, Flower, and Redis for background task processing and asynchronous functionality.

## Technologies Used

### Backend:

**- FastAPI:** A modern, fast (high-performance), web framework for building APIs with Python 3.7+.

**- Celery:** An asynchronous distributed task queue.

**- Flower:** A real-time web-based monitoring tool for Celery.

**- Redis:** An open-source, in-memory data structure store used as a message broker for Celery.

### Frontend:

**- React:** A JavaScript library for building user interfaces.

## Getting Started

To run the project locally, follow these steps:

1. Ensure you have Docker installed on your machine.
2. Clone this repository to your local machine:
   `git clone https://github.com/TAnd-dev/react-fastapi-app.git`
3. Navigate to the project directory:
   cd react-fastapi-app
4. Build and run the Docker containers:
   `docker-compose up --build` - this command will set up both the FastAPI backend and the React frontend, along with the required dependencies.
6. Open your browser and navigate to http://localhost:3000 to access the shop website.

## Additional Notes
- The Celery worker and Flower monitoring tool can be accessed at http://localhost:5555 after starting the Docker containers.
- Customize the configurations in the .env file to suit your preferences or add any additional environment variables as needed.
- Make sure to install the required dependencies for the frontend using npm install inside the frontend directory if you plan to make changes to the React application.

Feel free to explore, modify, and enhance this e-commerce website as needed for your own projects. If you encounter any issues or have suggestions for improvement, please submit an issue or pull request. Happy coding!
