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

![image](https://github.com/user-attachments/assets/4e17c6ba-97f1-46e3-b535-607af2d3501b)


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
   - Check for Existing Profile: SBasic details:
   ■ Name
   ■ Mobile Phone
   ■ PAN
   ■ Credit Scoreearches for a profile with the same PAN.
   - Save to Database: Inserts or updates the credit profile in MongoDB.
Cleanup: Deletes the processed file.   
- #### `/Retrive`
   - Method: `GET`
   - GET / – Fetch all credit profiles with pagination, allows filtering (by name, PAN, credit score), and sorting options.

   - GET /:id – Retrieve a specific credit profile by its MongoDB Object ID.

   - GET /pan/:pan – Get all credit profiles associated with a given PAN.

   - GET /stats/credit-score – Get statistics on credit scores, including average, min, max, and total profiles.
 

### Front-End

![frontend](https://github.com/user-attachments/assets/11f2a79b-21ad-4a19-a8b3-a6b0ba977e81)


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

  - Summary: 
    - Displays Summary on the right hand side
      
- #### `/profiles`
  Displays profile information in 3 part: basic details, Report Summary, Credit Accounts
  - Allows copying of basic info and report summary
  - Shows charts for Report Summary
  - Colored Credit Accounts for easy viewing 


### Error Handling

#### Front-end
Upload file in frontend takes only `.xml` files then validates for any errors in xml file using `/validateXML.jsx`
**validateXML.jsx**:
   - First pasres string -> xml using DOMParser and check for errors
   - Then checks for structural errors
   - Finally check common errors: Missing <?xml declaration but encoding is present etc.

If an object with same PAN is already in database it askes the user if he want to replace the old object or if it was a mistake, in order to prevent uneccecary duplication

Changes background based on success or error:
![bg](https://github.com/user-attachments/assets/f7b18465-359b-4808-ab04-00adbd495345)

#### Back-end
Validates file exists and if duplicate exits in Mongo it returns `409 Conflict` handles the request via force update tag coming from front-end

Handles error if there is any during data extraction returns extraction error

Handles mongodb connection error with `500`
