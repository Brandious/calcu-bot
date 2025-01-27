
# Calcu-bot Overview

## Architecture

- **Frontend**: Built using React and TypeScript, providing an interactive user interface for inputting mathematical expressions and displaying results.
- **Backend**: Developed with Node.js and Express, handling requests, evaluating expressions, and managing data storage.
- **Math Library**: A dedicated library for evaluating mathematical expressions, ensuring robust and accurate calculations.
- **Database**: Utilizes MongoDB to store user expressions and results, allowing for history retrieval and data persistence.

## Key Features

- **Expression Evaluation**: Users can input mathematical expressions, which are evaluated in real-time. The application supports basic arithmetic operations and more complex calculations.
- **History Management**: Users can view their calculation history, allowing them to revisit previous expressions and results.
- **Real-time Interaction**: The application uses WebSocket (Socket.IO) for real-time communication between the frontend and backend, ensuring a responsive user experience.
- **Error Handling**: The application includes validation to handle invalid inputs gracefully, providing user feedback when necessary.

## User Interface

- The frontend features a clean and intuitive design, allowing users to enter expressions easily and view results in a structured format.
- The calculator component provides input fields, buttons for submission, and a results overview section to display past calculations.

## Development and Deployment

- The application is structured as a monorepo using Yarn workspaces, facilitating organized development across multiple packages (frontend, backend, shared, and math library).
- It includes scripts for building and running the application in development and production environments.

# Running the app

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
2. **Yarn**: Install Yarn as a package manager. You can install it globally using npm:

   ```bash
   npm install --global yarn
   ```

3. **MongoDB**: Make sure you have MongoDB installed and running. You can either install it locally or use a cloud service like MongoDB Atlas.

## Steps to Run the Application

1. **Clone the Repository**:
   Clone the Calcu-bot repository to your local machine using Git:

   ```bash
   git clone https://github.com/Brandious/calcu-bot.git
   cd calcu-bot
   ```

2. **Install Dependencies**:
   Navigate to the root of the project and install the dependencies for all packages using Yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory of the project and add the necessary environment variables. Here’s an example:

   ```plaintext
   PORT=8000
   MONGO_URL=mongodb://localhost:27017/calcu-bot
   VITE_IO_URL=http://localhost:5173
   ```

   Adjust the `MONGO_URL` according to your MongoDB setup.

4. **Build the Application**:
   Build the application to compile TypeScript files:

   ```bash
   yarn build
   ```

5. **Run the Application**:
   You can run both the backend and frontend simultaneously using the following command:

   ```bash

   yarn dev
   
   ```

   This command uses `concurrently` to start both the backend and frontend servers.

6. **Access the Application**:
   Open your web browser and navigate to `http://localhost:5173` to access the Calcu-bot application.

## Additional Notes

- **Testing**: If you want to run tests, you can use:

```bash
  
  yarn test
  
 ```

- **Production Build**: For a production build, you can run:

```bash

  yarn workspace @calcu-bot/frontend build

```

  This will create a production-ready build of the frontend.

- **Docker start**: For a docker user you can leverage dockerfile and docker-compose by replacing the env vars

```Yaml
    environment:
      - PORT=<PORT_NUMBER>
      - MONGO_URL=<MONGO_URL>
```

  with corresponding ones and triggering

```bash
    docker compose build
    docker compose up -d
```

  based on the port you entered default **:3000** calcu-bot should be running on root page served by node server

By following these steps, you should be able to successfully run the Calcu-bot application on your local machine.
