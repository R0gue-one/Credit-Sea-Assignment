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

### Back-End 
Backend has 3 main routes:
- #### `/Upload`
   - Method: `POST` 
   - The uplaoded file is downloaded temporarily in uploads folder.
- #### `/Extract`
   - Method: `POST`
   - Validate Input: Checks if filename is provided.
   - File Handling: Reads XML file from `./backend/uploads/`.
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
 

### Front-End
- #### `/upload`:
  This React component provides an XML file upload and extraction and validates XML file to prevent corrupt upload:

   - File Selection & Validation – Users can select an XML file manually or via drag-and-drop. The file is validated before upload.
   - Upload Process – The selected file is uploaded to the backend.   
   - Extraction Process – Once uploaded, the file can be processed to extract relevant data.
   - Error Handling & UI Feedback – Displays messages based on success and failure with background change reflecting the same.
- #### `/credit-profile`
  Allows user to search through the database to find required user and view his details
  - Search filter: Allows user to filter profiles based on various filter using backend's filter ability
    ![image](https://github.com/user-attachments/assets/b521321f-e16d-44d3-a6e7-1571d244e16f)
 
  - Profiles list:
    - Shows list of all profiles matching query with pagination
    - Displays basic info with details button which sends user to `/profile` page
    - Displays Summary on the right hand side
      
- #### `/profiles`
   -  
   
