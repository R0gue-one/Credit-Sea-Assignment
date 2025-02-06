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
This schema is designed for storing credit profile data in a MongoDB database using Mongoose. It consists of 3 nested schemas:

-  **Address Schema**: Stores address details.<br>
   **Credit Account Schema**: Stores financial details of a credit account.<br>
   **Credit Profile Schema**: Main schema, storing user details, credit accounts, and addresses.

-  **Nested Arrays**<br>
   creditAccounts: Stores multiple creditAccountSchema records. Each credit account references an address schema
   addresses: Stores multiple addressSchema records.

-  **Modular Structure** – Separate schemas (Address, CreditAccount) improve reusability and maintainability.
-  Indexing pan (unique) for allowing updates and prevent duplication.
-  Automatic Timestamps – Keeps track of record creation and updates without manual intervention.

### Backend 
Backend has 3 main routes:
- #### `/Upload`
   - Method: `POST` 
   - The uplaoded file is downloaded temporarily in uploads folder.
- #### `/Extract`
   - Method: `POST`
   - Validate Input: Checks if filename is provided.
   - File Handling: Reads XML file from ./uploads/.
   - Parse XML: Converts XML to JSON format.
   - Extract Data: Retrieves applicant details, credit accounts, and summary.
   - Check for Existing Profile: Searches for a profile with the same PAN.
   - Save to Database: Inserts or updates the credit profile in MongoDB.
Cleanup: Deletes the processed file.   
- #### `/Retrive`
   - Method: `GET`
   - GET / – Fetch all credit profiles with pagination, allows filtering (by name, PAN, credit score), and sorting options.

   - GET /:id – Retrieve a specific credit profile by its MongoDB Object ID.

   - GET /pan/:pan – Get all credit profiles associated with a given PAN.

   - GET /stats/credit-score – Get statistics on credit scores, including average, min, max, and total profiles.
