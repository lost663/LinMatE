// ========================================
// ===== УПРАВЛЕНИЕ СЕССИЕЙ =====
// ========================================

// ===== СОЗДАНИЕ ТЕСТОВОГО АДМИНИСТРАТОРА =====
function createTestAdmin() {
    const existingAdmin = localStorage.getItem('user_admin');
    if (!existingAdmin) {
        const adminData = {
            username: 'admin',
            email: 'admin@school256-fokino.ru',
            password: 'admin123',
            role: 'admin',
            registeredAt: new Date().toISOString(),
            fullName: 'Главный Администратор',
            avatar: 'https://ui-avatars.com/api/?background=1e3c72&color=fff&name=Admin'
        };
        localStorage.setItem('user_admin', JSON.stringify(adminData));
        console.log('✅ Тестовый администратор создан! Логин: admin, Пароль: admin123');
    }
}

// Создаем тестового админа при загрузке
createTestAdmin();

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

// Получение текущей сессии
function getCurrentSession() {
    try {
        const sessionData = localStorage.getItem('currentSession') || sessionStorage.getItem('currentSession');
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Проверка авторизации
function isAuthenticated() {
    return getCurrentSession() !== null;
}

// Получение данных пользователя
function getUserData() {
    const session = getCurrentSession();
    return session ? session.userData : null;
}

// Получение имени пользователя
function getUserName() {
    const userData = getUserData();
    if (userData) {
        return userData.fullName || userData.username || 'Профиль';
    }
    return 'Профиль';
}

// Получение аватара пользователя
function getUserAvatar() {
    const userData = getUserData();
    if (userData) {
        return userData.avatar || `https://ui-avatars.com/api/?background=1e3c72&color=fff&name=${encodeURIComponent(getUserName())}`;
    }
    return `https://ui-avatars.com/api/?background=1e3c72&color=fff&name=User`;
}

// Получение роли пользователя
function getUserRole() {
    const userData = getUserData();
    return userData ? userData.role : null;
}

// Проверка, является ли пользователь администратором
function isAdmin() {
    return getUserRole() === 'admin';
}

// Обновление навигации на всех страницах
function updateNavbar() {
    const session = getCurrentSession();
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    // Находим пункт "Вход"
    let loginLink = navMenu.querySelector('a[href="login.html"]');
    if (!loginLink) {
        const links = navMenu.querySelectorAll('a');
        for (let link of links) {
            if (link.textContent.includes('Вход') || link.textContent.includes('Войти')) {
                loginLink = link;
                break;
            }
        }
    }
    
    if (session && loginLink) {
        const userData = session.userData || { username: session.username };
        const name = userData.fullName || userData.username || 'Профиль';
        const avatar = userData.avatar || `https://ui-avatars.com/api/?background=1e3c72&color=fff&name=${encodeURIComponent(name)}`;
        const isAdminUser = userData.role === 'admin';
        
        const parentLi = loginLink.closest('li') || loginLink.parentElement;
        
        let adminLink = '';
        if (isAdminUser) {
            adminLink = `<a href="admin.html" style="display: flex; align-items: center; gap: 5px; color: #ffd700; font-size: 0.8rem; padding: 0.2rem 0.5rem; background: rgba(255,215,0,0.15); border-radius: 4px; margin-top: 2px; text-decoration: none;">
                <i class="fas fa-crown"></i> Админ-панель
            </a>`;
        }
        
        parentLi.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <a href="profile.html" class="profile-nav" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: white; padding: 0.3rem 0.8rem; border-radius: 5px; transition: all 0.3s;">
                    <img src="${avatar}" alt="${name}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); object-fit: cover;">
                    <span style="font-size: 0.9rem; font-weight: 500;">${name}</span>
                    ${isAdminUser ? '<span style="font-size: 0.6rem; background: #ffd700; color: #1e3c72; padding: 0.1rem 0.5rem; border-radius: 10px; font-weight: bold;">ADMIN</span>' : ''}
                </a>
                ${adminLink}
            </div>
        `;
    } else if (loginLink) {
        const parentLi = loginLink.closest('li') || loginLink.parentElement;
        
        parentLi.innerHTML = `
            <a href="login.html" class="btn-login" style="background: #ff6b6b; color: white; padding: 0.5rem 1.5rem; border-radius: 5px; text-decoration: none; transition: all 0.3s;">
                <i class="fas fa-sign-in-alt"></i> Вход
            </a>
        `;
    }
}

// Выход из системы
function logoutUser(redirectTo = 'index.html') {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('currentSession');
        sessionStorage.removeItem('currentSession');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastLogin');
        window.location.href = redirectTo;
    }
}

// Защита страницы (требует авторизации)
function requireAuth(redirectTo = 'login.html') {
    if (!isAuthenticated()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Защита админ-страницы (требует роль admin)
function requireAdmin(redirectTo = 'index.html') {
    if (!isAuthenticated()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return false;
    }
    
    if (!isAdmin()) {
        alert('Доступ запрещен! Только для администраторов.');
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Обновление сессии
function refreshSession() {
    const session = getCurrentSession();
    if (session) {
        session.lastActivity = new Date().toISOString();
        if (localStorage.getItem('currentSession')) {
            localStorage.setItem('currentSession', JSON.stringify(session));
        } else if (sessionStorage.getItem('currentSession')) {
            sessionStorage.setItem('currentSession', JSON.stringify(session));
        }
    }
    return session;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    refreshSession();
    updateNavbar();
    
    // Обработка кнопок выхода
    document.querySelectorAll('.btn-logout, #logoutBtn, [data-action="logout"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser('index.html');
        });
    });
});