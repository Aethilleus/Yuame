// Dropdown menülerin çalışması için JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Tüm dropdown butonlarını seç
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');

    // Her butona click event listener ekle
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Tıklanan butonun data-menu attribute'unu al
            const menuId = this.getAttribute('data-menu');
            const dropdownContent = document.getElementById(menuId);

            // Diğer tüm açık menüleri kapat
            dropdownBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherId = otherBtn.getAttribute('data-menu');
                    const otherContent = document.getElementById(otherId);
                    otherContent.classList.remove('show');
                    otherBtn.classList.remove('active');
                }
            });

            // Tıklanan menüyü aç/kapat
            this.classList.toggle('active');

            // Animasyon için height değişimini ayarla
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.style.maxHeight = null;
                setTimeout(() => {
                    dropdownContent.classList.remove('show');
                }, 200); // animasyon süresi ile eşleşmeli
            } else {
                dropdownContent.classList.add('show');
                dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
            }
        });
    });

    // Sayfa herhangi bir yerine tıklandığında menüleri kapat
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown')) {
            dropdownBtns.forEach(btn => {
                const menuId = btn.getAttribute('data-menu');
                const dropdownContent = document.getElementById(menuId);
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.style.maxHeight = null;
                    setTimeout(() => {
                        dropdownContent.classList.remove('show');
                    }, 200); // animasyon süresi ile eşleşmeli
                }
                btn.classList.remove('active');
            });
        }
    });

    // İç içe dropdown menüler için
    const nestedDropdownBtns = document.querySelectorAll('.nested-dropdown-btn');

    nestedDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Ana dropdown'ın kapanmasını engelle
            const menuId = this.getAttribute('data-menu');
            const dropdownContent = document.getElementById(menuId);

            // Diğer açık olan iç içe menüleri kapat
            nestedDropdownBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    const otherId = otherBtn.getAttribute('data-menu');
                    const otherContent = document.getElementById(otherId);
                    otherContent.classList.remove('show');
                    otherBtn.classList.remove('active');
                }
            });

            // Tıklanan menüyü aç/kapat
            this.classList.toggle('active');
            dropdownContent.classList.toggle('show');
        });
    });

    // Arama çubuğu fonksiyonalitesi
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        // Tüm içeriği seç (menüler, ana içerik, vs.)
        const searchableElements = document.querySelectorAll('.dropdown-item, .content *');

        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                element.style.backgroundColor = searchTerm ? '#fff3cd' : ''; // Eşleşen içeriği vurgula
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                element.style.backgroundColor = '';
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Sayfa yüklendiğinde dark mode durumunu kontrol et
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }

    // Dark mode toggle fonksiyonu
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Dark mode durumunu localStorage'a kaydet
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
    });

    // Diğer sayfalarda dark mode kontrolü
    document.addEventListener('DOMContentLoaded', function () {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    });

    // Şifremi Unuttum Sayfası için JavaScript Kodları
    if (document.querySelector('.forgot-password-page')) {
        // Captcha oluşturma
        function generateCaptcha() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let captcha = '';
            for (let i = 0; i < 6; i++) {
                captcha += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('captcha').textContent = captcha;
            return captcha;
        }

        let currentCaptcha = generateCaptcha();

        // Adımlar arası geçiş
        window.nextStep = function (step) {
            const email = document.getElementById('email').value;
            if (step === 2 && !email) {
                alert('Lütfen e-posta adresinizi girin');
                return;
            }

            // Önceki adımları gizle
            document.querySelectorAll('.verification-steps').forEach(el => {
                el.style.display = 'none';
                el.classList.remove('active');
            });

            // Seçilen adımı göster
            const currentStep = document.getElementById(`step${step}`);
            currentStep.style.display = 'block';
            currentStep.classList.add('active');

            // Adım göstergelerini güncelle
            document.querySelectorAll('.step').forEach(el => {
                const stepNumber = parseInt(el.dataset.step);
                if (stepNumber < step) {
                    el.classList.add('completed');
                    el.classList.remove('active');
                } else if (stepNumber === step) {
                    el.classList.add('active');
                    el.classList.remove('completed');
                } else {
                    el.classList.remove('active', 'completed');
                }
            });
        }

        // Captcha doğrulama
        window.verifyCaptcha = function () {
            const userInput = document.getElementById('captchaInput').value;
            if (userInput === currentCaptcha) {
                nextStep(3);
            } else {
                alert('Güvenlik kodu hatalı. Lütfen tekrar deneyin.');
                currentCaptcha = generateCaptcha();
                document.getElementById('captchaInput').value = '';
            }
        }

        // SMS kodu doğrulama
        window.verifyCode = function () {
            const inputs = document.querySelectorAll('.verification-code input');
            let code = '';
            inputs.forEach(input => {
                code += input.value;
            });

            if (code.length === 6) {
                // Başarılı mesajını göster
                document.getElementById('successMessage').style.display = 'block';
                // 3 saniye sonra giriş sayfasına yönlendir
                setTimeout(() => {
                    window.location.href = 'giris.html';
                }, 3000);
            } else {
                alert('Lütfen 6 haneli kodu eksiksiz girin.');
            }
        }

        // SMS kodu input olayları
        const codeInputs = document.querySelectorAll('.verification-code input');
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
});

// Güvenlik Sayfası JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Parola görünürlüğünü değiştirme
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Parola gücü kontrolü
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-progress');
            const strengthText = document.querySelector('.strength-text');
            
            // Parola gücü kriterleri
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isLongEnough = password.length >= 8;
            
            let strength = 0;
            if (hasLower) strength += 20;
            if (hasUpper) strength += 20;
            if (hasNumber) strength += 20;
            if (hasSpecial) strength += 20;
            if (isLongEnough) strength += 20;
            
            strengthBar.style.width = strength + '%';
            
            if (strength <= 40) {
                strengthBar.style.background = '#ff4444';
                strengthText.textContent = 'Parola gücü: Zayıf';
            } else if (strength <= 80) {
                strengthBar.style.background = '#ffa700';
                strengthText.textContent = 'Parola gücü: Orta';
            } else {
                strengthBar.style.background = '#00c851';
                strengthText.textContent = 'Parola gücü: Güçlü';
            }
        });
    }

    // Parola değiştirme formu görünürlüğü
    window.togglePasswordChange = function() {
        const form = document.getElementById('passwordChangeForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    // Parola değiştirme işlemi
    window.changePassword = function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Yeni parolalar eşleşmiyor.');
            return;
        }

        // Burada parola değiştirme API çağrısı yapılacak
        alert('Parola başarıyla değiştirildi!');
        togglePasswordChange();
    }

    // İki adımlı doğrulama toggle
    window.toggle2FA = function() {
        const twoFactorSetup = document.getElementById('twoFactorSetup');
        const twoFactorToggle = document.getElementById('twoFactorToggle');
        
        if (twoFactorToggle.checked) {
            twoFactorSetup.style.display = 'block';
            // Animasyonlu gösterim
            setTimeout(() => {
                twoFactorSetup.style.opacity = '1';
            }, 10);
        } else {
            twoFactorSetup.style.opacity = '0';
            setTimeout(() => {
                twoFactorSetup.style.display = 'none';
            }, 300);
        }
    }

    // Oturum yenileme
    window.refreshSessions = function() {
        const refreshBtn = document.querySelector('.refresh-btn');
        const refreshIcon = refreshBtn.querySelector('.refresh-icon');
        
        // Yenileme animasyonu
        refreshIcon.style.animation = 'spin 1s linear infinite';
        
        // API çağrısı simülasyonu
        setTimeout(() => {
            refreshIcon.style.animation = '';
            alert('Oturumlar güncellendi!');
        }, 1000);
    }

    // Oturum kapatma
    const endSessionBtns = document.querySelectorAll('.end-session-btn');
    endSessionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const session = this.closest('.session');
            const isActive = session.classList.contains('active');
            
            if (isActive) {
                if (confirm('Aktif oturumu kapatmak istediğinizden emin misiniz? Bu işlem sizi sistemden çıkaracaktır.')) {
                    window.location.href = 'giris.html';
                }
            } else {
                session.remove();
                alert('Oturum başarıyla kapatıldı!');
            }
        });
    });
});

// Yenileme animasyonu için CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Gizlilik sayfası anahtarları kontrolü
document.addEventListener('DOMContentLoaded', function() {
    const switches = document.querySelectorAll('.privacy-card input[type="checkbox"]');
    
    switches.forEach(switchInput => {
        // Sayfa yüklendiğinde mevcut durumu kontrol et
        updateSwitchStatus(switchInput);
        
        // Anahtar değiştiğinde durumu güncelle
        switchInput.addEventListener('change', function() {
            updateSwitchStatus(this);
        });
    });
});

function updateSwitchStatus(switchInput) {
    const statusElement = switchInput.closest('.privacy-options').querySelector('.privacy-status');
    if (switchInput.checked) {
        statusElement.textContent = 'Açık';
    } else {
        statusElement.textContent = 'Kapalı';
    }
}

// Doğrulama Kodu Input Kontrolü
document.addEventListener('DOMContentLoaded', function() {
    const verificationInput = document.querySelector('.verification-input input');
    if (verificationInput) {
        verificationInput.addEventListener('input', function(e) {
            // Sadece rakam girişine izin ver
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // 6 haneli kod girildiğinde otomatik doğrulama
            if (this.value.length === 6) {
                document.querySelector('.verify-btn').focus();
            }
        });
    }
});
