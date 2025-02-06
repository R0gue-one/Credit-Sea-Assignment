# Credit Sea Assignment 
## Demo
Deployed on AWS [here](http://3.108.59.253:5173/)
### Video Demo


https://github.com/user-attachments/assets/d16bab51-3f06-487b-ab92-ac5ace964fc7



## How to Setup
1. Clone the repo `git clone https://github.com/R0gue-one/Credit-Sea-Assignment.git`
2. Open `backend` folder and run:
   ```
   npm install
   ```
3. Create a .env file and add your MongoDB URI like:
    ```
    MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.zargflr.mongodb.net/<databse_name>?retryWrites=true&w=majority&appName=Cluster0
    ```
    replace `<your_username>`, `<your_password>` and `<databse_name>`

4. Run the backend server using
   ```
   node index.js
   ```
5. Open `frontend` folder and run: `npm install`
6. Run client using
   ```
   npm run dev
   ```
    Go to `http://localhost:5173/`



## Code Documentation
### Tech Stack
**MERN**: MongoDB, Express.js, React and Node.js

### MongoDB Schema
