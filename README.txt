
#To start the application:
docker-compose up --build

# Nodejs app will take a while to build because it will wait for mysql's health check.
# Data will automatically populated into database once the services are running.


URLs:
1. GET http://localhost:3000/drinks?type=<type>

# locations are ['Area A', 'Area B', 'Area C'] for the seed data.
2. GET http://localhost:3000/cafes?location=<location>

3. GET http://localhost:3000/cafes/employees

4. POST http://localhost:3000/cafe
# sample request body: 
{
    "name": "GGG Cafe",
    "logo": "http://image_ggg.jpg",
    "location": "Area D",
    "description": "some description"
}

5. POST http://localhost:3000/cafe/employee
# sample request body:
{
    "cafeName": "GGG Cafe",
    "name": "Helen"
}

