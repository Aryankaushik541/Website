# Neverend Lifestyle - Full Stack E-Commerce Platform

A modern full-stack e-commerce web application built with **React.js + Vite (frontend)** and **Django REST Framework (backend)**. This project showcases a complete lifestyle brand platform with advanced features including authentication, state management, animations, and a responsive UI.

## 🔗 Live Demo

Coming Soon...

## ✨ Features

- **Modern UI/UX**: Built with React, Material-UI, and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state handling
- **Authentication**: JWT-based authentication with Firebase integration
- **Animations**: Smooth transitions using Framer Motion
- **Security**: Google reCAPTCHA integration, password strength validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: RESTful API communication with Axios
- **Toast Notifications**: User-friendly feedback with React Toastify
- **Loading States**: Enhanced UX with React Loader Spinner

## 🧩 Tech Stack

### Frontend (Wolfly)
- **Framework**: React 18.2.0 with Vite
- **Styling**: Tailwind CSS, Material-UI, Emotion
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Heroicons, Material Icons, React Icons, Lucide React
- **Authentication**: Firebase, JWT Decode
- **Security**: React Google reCAPTCHA, zxcvbn (password strength)
- **Build Tool**: Vite

### Backend (Django)
- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Authentication**: djangorestframework-simplejwt 5.3.1
- **CORS**: django-cors-headers 4.3.1
- **Image Processing**: Pillow 11.1.0
- **Configuration**: python-decouple 3.8
- **Database**: SQLite (development) / PostgreSQL (production ready)

## 📁 Project Structure

```
Website/
├── Wolfly_frontEnd/
│   └── Wolfly/              # React + Vite frontend
│       ├── src/             # Source files
│       ├── public/          # Static assets
│       ├── package.json     # Frontend dependencies
│       ├── vite.config.js   # Vite configuration
│       ├── tailwind.config.js
│       └── postcss.config.js
├── Backend_Dj/
│   └── Backend/
│       └── eCommerce/       # Django backend
│           ├── eCommerce/   # Django project settings
│           ├── requirement.txt
│           └── manage.py
├── .env                     # Environment variables
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip
- npm or yarn

### 1️⃣ Backend Setup (Django)

```bash
# Navigate to backend directory
cd Backend_Dj/Backend/eCommerce

# Create virtual environment
python -m venv env

# Activate virtual environment
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirement.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend server starts at: `http://127.0.0.1:8000/`

### 2️⃣ Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd Wolfly_frontEnd/Wolfly

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend app starts at: `http://localhost:5173/`

### 3️⃣ Environment Variables

Create a `.env` file in the root directory with necessary configurations:

```env
# Backend
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend
VITE_API_URL=http://127.0.0.1:8000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## 🔄 Connect Frontend to Backend

### Django CORS Configuration

In `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

### Frontend API Configuration

In React, configure Axios base URL to communicate with Django backend:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});
```

## 📜 Available Scripts

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `python manage.py runserver` - Start Django development server
- `python manage.py migrate` - Run database migrations
- `python manage.py makemigrations` - Create new migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py test` - Run tests

## 🚀 Deployment

### Backend Deployment Options
- **Railway** (Recommended)
- **Render**
- **Heroku**
- **AWS EC2**
- **DigitalOcean**

### Frontend Deployment Options
- **Vercel** (Recommended for Vite)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

### Pre-Deployment Checklist
- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Update CORS settings for production domain
- [ ] Set up environment variables on hosting platform
- [ ] Use production database (PostgreSQL recommended)
- [ ] Configure static files serving
- [ ] Set up SSL certificates
- [ ] Update API URLs in frontend

## 🔒 Security Features

- JWT-based authentication
- Password strength validation (zxcvbn)
- Google reCAPTCHA integration
- CORS protection
- CSRF protection
- Secure HTTP-only cookies
- Environment variable management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork and clone the repository
git clone https://github.com/Aryankaushik541/Website.git

# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "Add: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aryan Kaushik**
- GitHub: [@Aryankaushik541](https://github.com/Aryankaushik541)
- Email: aryankaushik541@gmail.com

## 🙏 Acknowledgments

- Built with Create React App and Vite
- UI components from Material-UI
- Styling with Tailwind CSS
- Animations powered by Framer Motion
- Backend powered by Django REST Framework
- Icons from Heroicons, Material Icons, and React Icons

---

**Note**: This is the Neverend Lifestyle e-commerce platform - a complete full-stack solution for modern online retail.
