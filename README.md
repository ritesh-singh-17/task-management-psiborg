# Task Management System

A task management system that allows users to manage tasks, assign them to others, and track their progress. It includes role-based access control and features like task management, team management, user authentication, and more.


## Overview

This is a task management system that allows teams to organize, manage, and track tasks. It includes the following features:
- **User Authentication**: Sign up, login, and token-based authentication using JWT.
- **Role-based Access Control**: Different roles (Admin, Manager, User) with specific access privileges.
- **Task Management**: Create, assign, and update tasks.
- **Team Management**: Assign users to teams and manage team tasks.

---

## Project Setup

### Installing Dependencies

1. Clone the repository to your local machine:
   git clone https://github.com/your-username/task-management.git
   cd task-management

2. Install the project dependencies:
    npm install

### Configuring Environment Variables
Create a .env file in the root of the project and configure the following environment variables:
    MONGO_URI= your mongodb url
    JWT_SECRET= your jwt secret
    SMTP_SERVICE= your smtp service
    SMTP_MAIL= your smtp mail
    SMTP_PASSWORD= your smtp password
    SERVER_URL= http://localhost:5000

### Starting the Server
Once dependencies are installed and the environment variables are configured, start the server:
    npm start



## API Endpoints

## Auth APIs

### POST /api/auth/register
Registers a new user.

#### Request Body:
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123",
  "role": "User"
}

#### Response Body:
User registered successfully.
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "johndoe@example.com"
  }
}


### POST /api/auth/login
Logs in a user and returns a JWT token.

#### Request Body:
{
  "email": "johndoe@example.com",
  "password": "Password123",
  "role": "User"
}


#### Response Body:
Login Successfull
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "role": "User"
  }
}

### POST /api/auth/logout
Log outs a user.

#### Security:
Bearer Token required in the Authorization header.

#### Response Body:
User logged out successfully.
{
  "message": "User logged out successfully"
}


## Tasks APIs

### POST /api/tasks
Create a new task.

#### Request Body:
{
  "title": "Finish project report",
  "description": "Complete the final report for the client project.",
  "dueDate": "2024-12-10",
  "priority": "High"
}

#### Response Body:
Task Created successfully
{
  "success": true,
  "task": {
    "id": "607f1f77bcf86cd799439011",
    "title": "Finish project report",
    "description": "Complete the final report for the client project.",
    "dueDate": "2024-12-10",
    "priority": "High",
    "status": "Pending",
    "createdBy": "607f1f77bcf86cd799439012",
    "assignedTo": "607f1f77bcf86cd799439013",
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-02T14:00:00Z"
  }
}


### GET /api/tasks
Retrieve all tasks with filtering and sorting.

#### Parameters:
status (string): Filter tasks by status (e.g. Pending, Completed).
priority (string): Filter tasks by priority (Low, Medium, High).
sortBy (string): Field to sort by (e.g. title, dueDate).
order (string): Sorting order (asc for ascending, desc for descending).

#### Response Body:
List of tasks:
{
  "success": true,
  "tasks": [
    {
      "id": "607f1f77bcf86cd799439011",
      "title": "Finish project report",
      "description": "Complete the final report for the client project.",
      "dueDate": "2024-12-10",
      "priority": "High",
      "status": "Pending",
      "createdBy": "607f1f77bcf86cd799439012",
      "assignedTo": "607f1f77bcf86cd799439013",
      "createdAt": "2024-12-01T12:00:00Z",
      "updatedAt": "2024-12-02T14:00:00Z"
    }
  ]
}


### GET /api/tasks/{id}
Retrieve a task by its ID.

#### Parameters:
id (string): ID of the task to retrieve.

#### Response Body:
Task details:
{
  "success": true,
  "task": {
    "id": "607f1f77bcf86cd799439011",
    "title": "Finish project report",
    "description": "Complete the final report for the client project.",
    "dueDate": "2024-12-10",
    "priority": "High",
    "status": "Pending",
    "createdBy": "607f1f77bcf86cd799439012",
    "assignedTo": "607f1f77bcf86cd799439013",
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-02T14:00:00Z"
  }
}


### PUT /api/tasks/{id}
Update a task by ID.

#### Parameters:
id (string): ID of the task.

#### Request Body:
{
  "title": "Update project report",
  "description": "Revise and finalize the project report.",
  "dueDate": "2024-12-15",
  "priority": "Medium",
  "status": "In Progress"
}


#### Response Body:
Task updated successfully:
{
  "success": true,
  "task": {
    "id": "607f1f77bcf86cd799439011",
    "title": "Update project report",
    "description": "Revise and finalize the project report.",
    "dueDate": "2024-12-15",
    "priority": "Medium",
    "status": "In Progress",
    "createdBy": "607f1f77bcf86cd799439012",
    "assignedTo": "607f1f77bcf86cd799439013",
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-02T14:00:00Z"
  }
}


### DELETE /api/tasks/{id}
Delete a task by ID.

#### Parameters:
id (string): ID of the task.

#### Response Body:
Task deleted successfully


### PUT /api/tasks/{id}/assign
Assign a task to a user.

#### Parameters:
id (string): ID of the task.

#### Request Body:
{
  "userId": "607f1f77bcf86cd799439011"
}

#### Response Body:
Task assigned successfully
{
  "success": true,
  "task": {
    "id": "607f1f77bcf86cd799439011",
    "title": "Finish project report",
    "description": "Complete the final report for the client project.",
    "dueDate": "2024-12-10",
    "priority": "High",
    "status": "Pending",
    "createdBy": "607f1f77bcf86cd799439012",
    "assignedTo": "607f1f77bcf86cd799439013",
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-02T14:00:00Z"
  }
}


### GET /api/tasks/assigned
View tasks assigned to the current user.


#### Response Body:
List of assigned tasks
{
  "success": true,
  "tasks": [
    {
      "id": "607f1f77bcf86cd799439011",
      "title": "Finish project report",
      "description": "Complete the final report for the client project.",
      "dueDate": "2024-12-10",
      "priority": "High",
      "status": "Pending",
      "createdBy": "607f1f77bcf86cd799439012",
      "assignedTo": "607f1f77bcf86cd799439013",
      "createdAt": "2024-12-01T12:00:00Z",
      "updatedAt": "2024-12-02T14:00:00Z"
    }
  ]
}


### GET /api/tasks/analytics/user
Get task analytics for the current user.


#### Response Body:
Task analytics fetched successfully
{
  "success": true,
  "analytics": {
    "completed": 10,
    "pending": 5,
    "overdue": 5
  }
}


### GET /api/tasks/analytics/team/{teamId}
Get task analytics for a team.

#### Parameters:
teamId (string): ID of the team to fetch analytics for.

#### Response Body:
Team task analytics fetched successfully
{
  "success": true,
  "analytics": {
    "completed": 50,
    "pending": 30,
    "overdue": 20
  }
}


## Team APIs

### POST /api/teams
Create a new team.

#### Request Body:
{
  "name": "Development Team",
  "managerId": "607f1f77bcf86cd799439011",
  "memberIds": [
    "607f1f77bcf86cd799439012",
    "607f1f77bcf86cd799439013"
  ]
}

#### Response Body:
Created
{
  "success": true,
  "team": {
    "name": "Development Team",
    "manager": "607f1f77bcf86cd799439011",
    "members": [
      "607f1f77bcf86cd799439012",
      "607f1f77bcf86cd799439013"
    ],
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-01T12:00:00Z"
  }
}



### PUT /api/teams/addMember
Add a member to an existing team.

#### Request Body:
{
  "teamId": "607f1f77bcf86cd799439014",
  "memberId": "607f1f77bcf86cd799439016"
}

#### Response Body:
{
  "success": true,
  "message": "Member added to the team"
}

 

### PUT /api/teams/removeMember
Remove a member from an existing team.

#### Request Body:
{
  "teamId": "607f1f77bcf86cd799439014",
  "memberId": "607f1f77bcf86cd799439016"
}

#### Response Body:
{
  "success": true,
  "message": "Member removed from the team"
}

 

### GET /api/teams/{id}
Fetch details of a team by its ID.

#### Parameters:
id (string): The ID of the team.

#### Response Body:
{
  "success": true,
  "team": {
    "name": "Development Team",
    "manager": "607f1f77bcf86cd799439011",
    "members": [
      "607f1f77bcf86cd799439012",
      "607f1f77bcf86cd799439013"
    ],
    "createdAt": "2024-12-01T12:00:00Z",
    "updatedAt": "2024-12-02T14:00:00Z"
  }
}

 

### DELETE /api/teams/{id}
Delete a team by its ID.

#### Parameters:
id (string): The ID of the team.

#### Response Body:
{
  "success": true,
  "message": "Team deleted successfully"
}

 

## User APIs


### GET /me
Retrieve the profile details of the currently authenticated user.

#### Parameters:


#### Request Body:


#### Response Body:
{
  "_id": "12345",
  "username": "john_doe",
  "email": "john@example.com"
}


### PUT /me
Update the profile details of the currently authenticated user.

#### Request Body:
{
  "username": "updated_username",
  "email": "updated_email@example.com"
}

#### Response Body:
{
  "message": "User profile updated successfully",
  "user": {
    "id": "12345",
    "username": "updated_username",
    "email": "updated_email@example.com"
  }
}



### PUT /me/password
Change the password of the currently authenticated user.

#### Request Body:
{
  "currentPassword": "current_password",
  "newPassword": "new_password"
}

#### Response Body:
Password updated successfully.


### GET /
Retrieve a list of all users.

#### Response Body:
[
  {
    "_id": "12345",
    "username": "john_doe",
    "email": "john@example.com"
  },
  {
    "_id": "67890",
    "username": "jane_doe",
    "email": "jane@example.com"
  }
]



### DELETE /:id
Retrieve the profile details of the currently authenticated user.

#### Parameters:
id (string): The ID of the user to delete.

#### Response Body:
{
  "message": "User deleted successfully"
}