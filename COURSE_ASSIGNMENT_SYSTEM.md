# Course Assignment System

Yeh system admin ko teachers aur students ko courses assign karne mein help karta hai, aur teachers ko apne students dekhne mein bhi help karta hai.

## Features

### Admin Features
- **Teacher Assignment**: Admin kisi bhi teacher ko course assign kar sakta hai
- **Student Assignment**: Admin kisi bhi student ko course mein enroll kar sakta hai
- **Overview**: Total students, teachers, courses aur enrollments ka overview

### Teacher Features
- **My Students**: Sirf apne assigned courses ke students dekh sakte hain
- **My Courses**: Apne assigned courses dekh sakte hain
- **Dashboard**: Course count aur student count ka overview

### Student Features
- **My Courses**: Apne enrolled courses dekh sakte hain
- **Self Registration**: Course mein khud enroll ho sakte hain
- **Dashboard**: Enrolled courses count aur recent enrollments

## API Endpoints

### Course Assignment (Admin Only)
```
POST /course/assign-teacher
Body: { courseId, teacherId, campusId }

POST /course/assign-student  
Body: { studentId, courseId, campusId }
```

### Teacher Routes
```
GET /course/teacher/students     - Get teacher's students
GET /course/teacher/courses      - Get teacher's assigned courses
GET /dashboard/teacher/overview  - Teacher dashboard
```

### Student Routes
```
GET /course/student/courses      - Get student's enrolled courses
POST /course/student/enroll      - Self enroll to course
GET /dashboard/student/overview  - Student dashboard
```

### User Management (Admin)
```
GET /auth/users/students         - Get all students
GET /auth/users/teachers         - Get all teachers  
GET /auth/users/role/:role       - Get users by role
```

### Dashboard
```
GET /dashboard/admin/overview    - Admin overview
GET /dashboard/teacher/overview  - Teacher overview
GET /dashboard/student/overview  - Student overview
```

## Database Models

### Course Model
- `teacher` field added to track assigned teacher
- Teacher assignment validation

### Enrolment Model
- Enhanced with status, enrollment date, active status
- Unique compound index to prevent duplicate enrollments
- Proper validation and required fields

### TeacherCourse Model
- Tracks teacher-course-campus assignments
- Assignment date and status tracking
- Unique compound index

## Security Features

- **Role-based Access Control**: Admin, Teacher, Student roles
- **JWT Authentication**: Protected routes
- **Middleware Validation**: Input validation and sanitization
- **Duplicate Prevention**: Unique constraints in database

## Usage Examples

### 1. Admin assigning teacher to course
```javascript
POST /course/assign-teacher
{
  "courseId": "course_id_here",
  "teacherId": "teacher_id_here", 
  "campusId": "campus_id_here"
}
```

### 2. Admin assigning student to course
```javascript
POST /course/assign-student
{
  "studentId": "student_id_here",
  "courseId": "course_id_here",
  "campusId": "campus_id_here"
}
```

### 3. Student self-registration
```javascript
POST /course/student/enroll
{
  "courseId": "course_id_here",
  "campusId": "campus_id_here"
}
```

## Error Handling

- Proper HTTP status codes
- Descriptive error messages
- Validation errors
- Duplicate assignment prevention
- Role-based access control

## Database Relationships

```
User (Teacher) ←→ Course ←→ User (Student)
     ↓              ↓           ↓
TeacherCourse   Enrolment   Enrolment
     ↓              ↓           ↓
  Campus         Campus      Campus
```

## Notes

- Course mein teacher assign karne ke baad hi students enroll ho sakte hain
- Duplicate enrollments prevent kiye gaye hain
- Teachers sirf apne assigned courses ke students dekh sakte hain
- Students sirf apne enrolled courses dekh sakte hain
- Admin ko sab kuch access hai
