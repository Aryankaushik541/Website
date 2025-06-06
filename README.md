# 🌐 Full Stack Website

A full-stack web application built with **React.js (frontend)** and **Django (backend)**. This project demonstrates a modern web architecture with API-driven communication, reusable components, and clean UI.

## 🔗 Live Demo

Coming Soon…

## 🧩 Tech Stack

- 🔙 **Backend**: Django, Django REST Framework
- 🔜 **Frontend**: React.js, JSX, CSS
- 📦 **Package Management**: pip, npm
- 🔗 **API Communication**: Fetch / Axios
- 🔒 **Security**: Django CORS, CSRF, JWT (if used)

---

## 📁 Project Structure

```bash
Website/
├── backend/            # Django project
│   ├── manage.py
│   └── ...
├── frontend/           # React app
│   ├── package.json
│   ├── src/
│   └── ...
└── README.md

⚙️ Setup Instructions
1️⃣ Backend (Django)
bash
Copy
Edit
cd backend
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Server starts at http://127.0.0.1:8000/

2️⃣ Frontend (React)
bash
Copy
Edit
cd frontend
npm install
npm start
App starts at http://localhost:3000/

🔄 Connect Frontend to Backend
Make sure to enable CORS in Django:

python
Copy
Edit
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
In React, use Axios or fetch to make API calls to http://localhost:8000/api/...

🚀 Deployment
To deploy:

Backend: Render / Railway / Heroku / AWS

Frontend: Vercel / Netlify / GitHub Pages

Make sure to:

Add .env files for secrets

Use production builds

Set ALLOWED_HOSTS and CORS correctly

🤝 Contribution
Contributions are welcome!

bash
Copy
Edit
git clone https://github.com/aryan-kaushik541/Website.git
git checkout -b feature-name
git commit -m "Added feature"
git push origin feature-name
Then open a Pull Request.

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Aryan Kaushik
GitHub: @aryan-kaushik541

