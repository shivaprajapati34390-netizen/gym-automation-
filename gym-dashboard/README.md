Welcome to the **Gym Membership Management System**! This is a full-stack web application built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). It allows gyms to efficiently manage their members, including adding new members, updating their details, deleting members, and tracking attendance.

---

**Features**
- **Add New Members**: Add members with details like name, age, gender, contact information, and membership type (Monthly/Yearly).
- **View All Members**: Display a list of all gym members with their details.
- **Update Member Information**: Edit member details to keep records up-to-date.
- **Delete Members**: Remove members from the system when needed.
- **Track Attendance**: Record and view attendance for each member.

---

**Tech Stack**
- **Frontend**: React.js (with functional components and hooks like `useState` and `useEffect`).
- **Backend**: Node.js and Express.js for building a RESTful API.
- **Database**: MongoDB for storing member and attendance data.
- **Styling**: CSS for a clean and responsive user interface.

---

**Installation**

**Prerequisites**
- Node.js and npm installed on your machine.
- MongoDB installed or a MongoDB Atlas account for cloud database.

**Steps to Run the Project**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/gym-management-system.git
   cd gym-management-system
   ```

2. **Set Up the Backend**:
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` folder and add your MongoDB connection string:
     ```
     MONGO_URI=mongodb://localhost:27017/gym-management
     PORT=5000
     ```
   - Start the backend server:
     ```bash
     node index.js
     ```

3. **Set Up the Frontend**:
   - Open a new terminal and navigate to the `frontend` folder:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Access the Application**:
   - Open your browser and go to `http://localhost:3000` to view the application.

---

**Folder Structure**
```
gym-management-system/
├── backend/
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   └── index.js             # Backend entry point
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styles for the app
│   │   └── index.js         # Frontend entry point
│   └── package.json         # Frontend dependencies
├── .gitignore               # Files to ignore in Git
└── README.md                # Project documentation
```

---

**API Endpoints**
The backend provides the following RESTful API endpoints:

- **GET** `/api/members` - Get all members.
- **POST** `/api/members` - Add a new member.
- **GET** `/api/members/:id` - Get a single member by ID.
- **PUT** `/api/members/:id` - Update a member by ID.
- **DELETE** `/api/members/:id` - Delete a member by ID.
- **POST** `/api/members/:id/attendance` - Record attendance for a member.

---

**Usage**
1. **Add a New Member**:
   - Fill out the form on the homepage and click "Add Member".

2. **View All Members**:
   - The list of members is displayed below the form.

3. **Update a Member**:
   - Click the "Update" button next to a member, edit their details, and click "Save Changes".

4. **Delete a Member**:
   - Click the "Delete" button next to a member to remove them from the system.

---

**Future Enhancements**
- **Payment Tracking**: Record and manage membership payments.
- **Workout Plans**: Assign and track workout plans for each member.
- **Admin Dashboard**: A dedicated dashboard for gym administrators.

---

**Contributing**
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request.

---

**Contact**
If you have any questions or feedback, feel free to reach out:  
- **Email**: ebadhassan009@gmail.com  
- **LinkedIn**: www.linkedin.com/in/ebad-hassan-523b1a355 
- **GitHub**: www.github.com/ibbad009

---

Thank you for checking out my project! 
