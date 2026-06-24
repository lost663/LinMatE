// ===== МЕНЮ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-menu a').forEach(n => {
    n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== ОБРАБОТКА ФОРМ =====

// Форма обратной связи на главной
const contactForm = document.getElementById('consultationForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (isValid) {
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            this.reset();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправлено!';
            submitBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 2000);
        } else {
            alert('Пожалуйста, заполните все обязательные поля.');
        }
    });
}

// ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.advantage-card, .program-card, .team-card').forEach(el => {
    observer.observe(el);
});

// ===== АНИМАЦИЯ СЧЕТЧИКОВ =====
const stats = document.querySelectorAll('.stat h3');
if (stats.length > 0) {
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start) + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const value = parseInt(statNumber.textContent);
                animateValue(statNumber, 0, value - 1, 2000);
                statObserver.unobserve(statNumber);
            }
        });
    });

    stats.forEach(stat => {
        statObserver.observe(stat);
    });
}

// ===== ПРОВЕРКА АДМИН-ДОСТУПА =====
// Проверка на странице админки
if (window.location.pathname.includes('admin.html')) {
    const session = localStorage.getItem('currentSession') || sessionStorage.getItem('currentSession');
    if (!session) {
        alert('Доступ запрещен! Требуется авторизация.');
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
    } else {
        try {
            const sessionData = JSON.parse(session);
            const userData = sessionData.userData || {};
            if (userData.role !== 'admin') {
                alert('Доступ запрещен! Только для администраторов.');
                window.location.href = 'index.html';
            }
        } catch (e) {
            window.location.href = 'login.html';
        }
    }
}

// Проверка на странице профиля
if (window.location.pathname.includes('profile.html')) {
    if (!isAuthenticated()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
    }
}

// Обработка форм с подтверждением
document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', function(e) {
        const confirmMsg = this.getAttribute('data-confirm');
        if (confirmMsg && !confirm(confirmMsg)) {
            e.preventDefault();
        }
    });
});

// ===== БЫСТРЫЙ ВХОД ДЛЯ АДМИНА (через консоль) =====
console.log('%c🔐 Для быстрого входа как админ выполните: quickLoginAdmin()', 'font-size: 16px; color: #1e3c72;');

window.quickLoginAdmin = function() {
    const adminSession = {
        username: 'admin',
        userData: {
            username: 'admin',
            fullName: 'Главный Администратор',
            email: 'admin@school256-fokino.ru',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?background=1e3c72&color=fff&name=Admin',
            registeredAt: new Date().toISOString()
        },
        loginTime: new Date().toISOString(),
        rememberMe: true
    };
    
    localStorage.setItem('currentSession', JSON.stringify(adminSession));
    localStorage.setItem('currentUser', 'admin');
    localStorage.setItem('lastLogin', new Date().toISOString());
    
    alert('✅ Вход выполнен как Администратор!');
    window.location.href = 'admin.html';
};

console.log('%c👤 Тестовый админ: admin / admin123', 'font-size: 14px; color: #27ae60;');