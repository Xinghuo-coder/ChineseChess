/**
 * 用户认证系统
 * 支持手机号、邮箱、Apple、Google、Facebook、微信登录
 */

var auth = {
    // 当前登录用户信息
    currentUser: null,
    
    // 第三方登录配置
    oauthConfig: {
        google: {
            clientId: 'YOUR_GOOGLE_CLIENT_ID',
            redirectUri: window.location.origin + '/callback'
        },
        facebook: {
            appId: 'YOUR_FACEBOOK_APP_ID',
            redirectUri: window.location.origin + '/callback'
        },
        apple: {
            clientId: 'YOUR_APPLE_CLIENT_ID',
            redirectUri: window.location.origin + '/callback'
        },
        wechat: {
            appId: 'YOUR_WECHAT_APP_ID',
            redirectUri: window.location.origin + '/callback'
        }
    },
    
    /**
     * 初始化认证系统
     */
    init: function() {
        // 检查是否已登录
        this.checkLoginStatus();
        // 绑定事件
        this.bindEvents();
        // 加载第三方SDK
        this.loadThirdPartySDK();
    },
    
    /**
     * 检查登录状态
     */
    checkLoginStatus: function() {
        var userJson = localStorage.getItem('currentUser');
        if (userJson) {
            try {
                this.currentUser = JSON.parse(userJson);
                this.showUserInfo();
                return true;
            } catch(e) {
                localStorage.removeItem('currentUser');
            }
        }
        return false;
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        var self = this;
        
        // 登录按钮
        document.getElementById('loginBtn') && document.getElementById('loginBtn').addEventListener('click', function() {
            self.showLoginModal();
        });
        
        // 注册按钮
        document.getElementById('registerBtn') && document.getElementById('registerBtn').addEventListener('click', function() {
            self.showRegisterModal();
        });
        
        // 登出按钮
        document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', function() {
            self.logout();
        });
        
        // 关闭模态框
        var closeBtns = document.querySelectorAll('.auth-modal-close');
        for (var i = 0; i < closeBtns.length; i++) {
            closeBtns[i].addEventListener('click', function() {
                self.hideAllModals();
            });
        }
        
        // 切换到注册
        document.getElementById('switchToRegister') && document.getElementById('switchToRegister').addEventListener('click', function(e) {
            e.preventDefault();
            self.hideAllModals();
            self.showRegisterModal();
        });
        
        // 切换到登录
        document.getElementById('switchToLogin') && document.getElementById('switchToLogin').addEventListener('click', function(e) {
            e.preventDefault();
            self.hideAllModals();
            self.showLoginModal();
        });
        
        // 忘记密码
        document.getElementById('forgotPassword') && document.getElementById('forgotPassword').addEventListener('click', function(e) {
            e.preventDefault();
            self.showForgotPasswordModal();
        });
        
        // 表单提交
        document.getElementById('loginForm') && document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            self.handleLogin();
        });
        
        document.getElementById('registerForm') && document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            self.handleRegister();
        });
        
        document.getElementById('resetPasswordForm') && document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            self.handleResetPassword();
        });
        
        // 第三方登录按钮
        document.getElementById('googleLogin') && document.getElementById('googleLogin').addEventListener('click', function() {
            self.loginWithGoogle();
        });
        
        document.getElementById('facebookLogin') && document.getElementById('facebookLogin').addEventListener('click', function() {
            self.loginWithFacebook();
        });
        
        document.getElementById('appleLogin') && document.getElementById('appleLogin').addEventListener('click', function() {
            self.loginWithApple();
        });
        
        document.getElementById('wechatLogin') && document.getElementById('wechatLogin').addEventListener('click', function() {
            self.loginWithWechat();
        });
    },
    
    /**
     * 显示登录模态框
     */
    showLoginModal: function() {
        document.getElementById('loginModal').style.display = 'block';
    },
    
    /**
     * 显示注册模态框
     */
    showRegisterModal: function() {
        document.getElementById('registerModal').style.display = 'block';
    },
    
    /**
     * 显示忘记密码模态框
     */
    showForgotPasswordModal: function() {
        this.hideAllModals();
        document.getElementById('resetPasswordModal').style.display = 'block';
    },
    
    /**
     * 隐藏所有模态框
     */
    hideAllModals: function() {
        var modals = document.querySelectorAll('.auth-modal');
        for (var i = 0; i < modals.length; i++) {
            modals[i].style.display = 'none';
        }
    },
    
    /**
     * 处理登录
     */
    handleLogin: function() {
        var identifier = document.getElementById('loginIdentifier').value.trim();
        var password = document.getElementById('loginPassword').value;
        
        if (!identifier || !password) {
            this.showMessage('请输入账号和密码', 'error');
            return;
        }
        
        // 从本地存储获取用户数据
        var users = this.getUsers();
        var user = null;
        
        // 查找用户（支持手机号或邮箱）
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === identifier || users[i].phone === identifier) {
                user = users[i];
                break;
            }
        }
        
        if (!user) {
            this.showMessage('用户不存在', 'error');
            return;
        }
        
        // 验证密码（简单示例，实际应使用加密）
        if (user.password !== this.hashPassword(password)) {
            this.showMessage('密码错误', 'error');
            return;
        }
        
        // 登录成功
        this.setCurrentUser(user);
        this.hideAllModals();
        this.showMessage('登录成功！', 'success');
    },
    
    /**
     * 处理注册
     */
    handleRegister: function() {
        var registerType = document.querySelector('input[name="registerType"]:checked').value;
        var identifier = document.getElementById('registerIdentifier').value.trim();
        var password = document.getElementById('registerPassword').value;
        var confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (!identifier || !password) {
            this.showMessage('请填写完整信息', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('两次密码不一致', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('密码长度至少6位', 'error');
            return;
        }
        
        // 验证格式
        if (registerType === 'email' && !this.validateEmail(identifier)) {
            this.showMessage('邮箱格式不正确', 'error');
            return;
        }
        
        if (registerType === 'phone' && !this.validatePhone(identifier)) {
            this.showMessage('手机号格式不正确', 'error');
            return;
        }
        
        // 检查用户是否已存在
        var users = this.getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === identifier || users[i].phone === identifier) {
                this.showMessage('该账号已被注册', 'error');
                return;
            }
        }
        
        // 创建新用户
        var newUser = {
            id: 'user_' + Date.now(),
            registerType: registerType,
            email: registerType === 'email' ? identifier : '',
            phone: registerType === 'phone' ? identifier : '',
            password: this.hashPassword(password),
            nickname: identifier.split('@')[0] || identifier.substring(0, 3) + '****',
            avatar: 'img/default-avatar.svg',
            createdAt: new Date().toISOString(),
            gameStats: {
                totalGames: 0,
                wins: 0,
                losses: 0,
                draws: 0
            }
        };
        
        users.push(newUser);
        this.saveUsers(users);
        
        // 自动登录
        this.setCurrentUser(newUser);
        this.hideAllModals();
        this.showMessage('注册成功！', 'success');
    },
    
    /**
     * 处理重置密码
     */
    handleResetPassword: function() {
        var identifier = document.getElementById('resetIdentifier').value.trim();
        var newPassword = document.getElementById('newPassword').value;
        var confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (!identifier || !newPassword) {
            this.showMessage('请填写完整信息', 'error');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            this.showMessage('两次密码不一致', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showMessage('密码长度至少6位', 'error');
            return;
        }
        
        // 查找用户
        var users = this.getUsers();
        var userIndex = -1;
        
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === identifier || users[i].phone === identifier) {
                userIndex = i;
                break;
            }
        }
        
        if (userIndex === -1) {
            this.showMessage('用户不存在', 'error');
            return;
        }
        
        // 更新密码
        users[userIndex].password = this.hashPassword(newPassword);
        this.saveUsers(users);
        
        this.hideAllModals();
        this.showMessage('密码重置成功，请重新登录', 'success');
    },
    
    /**
     * 登出
     */
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.hideUserInfo();
        this.showMessage('已登出', 'info');
    },
    
    /**
     * 设置当前用户
     */
    setCurrentUser: function(user) {
        // 不保存密码到currentUser
        var userCopy = {};
        for (var key in user) {
            if (key !== 'password') {
                userCopy[key] = user[key];
            }
        }
        
        this.currentUser = userCopy;
        localStorage.setItem('currentUser', JSON.stringify(userCopy));
        this.showUserInfo();
    },
    
    /**
     * 显示用户信息
     */
    showUserInfo: function() {
        var userInfoBox = document.getElementById('userInfoBox');
        var loginBox = document.getElementById('loginBox');
        
        if (userInfoBox && loginBox && this.currentUser) {
            document.getElementById('userNickname').textContent = this.currentUser.nickname;
            document.getElementById('userAvatar').src = this.currentUser.avatar;
            
            // 显示游戏统计
            if (this.currentUser.gameStats) {
                var stats = this.currentUser.gameStats;
                document.getElementById('userStats').innerHTML = 
                    '胜: ' + stats.wins + ' | 负: ' + stats.losses + ' | 和: ' + stats.draws;
            }
            
            loginBox.style.display = 'none';
            userInfoBox.style.display = 'block';
        }
    },
    
    /**
     * 隐藏用户信息
     */
    hideUserInfo: function() {
        var userInfoBox = document.getElementById('userInfoBox');
        var loginBox = document.getElementById('loginBox');
        
        if (userInfoBox && loginBox) {
            userInfoBox.style.display = 'none';
            loginBox.style.display = 'block';
        }
    },
    
    /**
     * Google登录
     */
    loginWithGoogle: function() {
        if (typeof gapi === 'undefined') {
            this.showMessage('Google SDK未加载，请刷新页面重试', 'error');
            return;
        }
        
        // Google登录逻辑
        var self = this;
        gapi.auth2.getAuthInstance().signIn().then(function(googleUser) {
            var profile = googleUser.getBasicProfile();
            var user = {
                id: 'google_' + profile.getId(),
                registerType: 'google',
                email: profile.getEmail(),
                nickname: profile.getName(),
                avatar: profile.getImageUrl(),
                createdAt: new Date().toISOString(),
                gameStats: {
                    totalGames: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0
                }
            };
            
            // 检查是否已存在
            var users = self.getUsers();
            var existingUser = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    existingUser = users[i];
                    break;
                }
            }
            
            if (!existingUser) {
                users.push(user);
                self.saveUsers(users);
            } else {
                user = existingUser;
            }
            
            self.setCurrentUser(user);
            self.hideAllModals();
            self.showMessage('Google登录成功！', 'success');
        }).catch(function(error) {
            self.showMessage('Google登录失败: ' + error.error, 'error');
        });
    },
    
    /**
     * Facebook登录
     */
    loginWithFacebook: function() {
        if (typeof FB === 'undefined') {
            this.showMessage('Facebook SDK未加载，请刷新页面重试', 'error');
            return;
        }
        
        var self = this;
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'id,name,email,picture'}, function(profile) {
                    var user = {
                        id: 'facebook_' + profile.id,
                        registerType: 'facebook',
                        email: profile.email || '',
                        nickname: profile.name,
                        avatar: profile.picture.data.url,
                        createdAt: new Date().toISOString(),
                        gameStats: {
                            totalGames: 0,
                            wins: 0,
                            losses: 0,
                            draws: 0
                        }
                    };
                    
                    var users = self.getUsers();
                    var existingUser = null;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].id === user.id) {
                            existingUser = users[i];
                            break;
                        }
                    }
                    
                    if (!existingUser) {
                        users.push(user);
                        self.saveUsers(users);
                    } else {
                        user = existingUser;
                    }
                    
                    self.setCurrentUser(user);
                    self.hideAllModals();
                    self.showMessage('Facebook登录成功！', 'success');
                });
            } else {
                self.showMessage('Facebook登录失败', 'error');
            }
        }, {scope: 'public_profile,email'});
    },
    
    /**
     * Apple登录
     */
    loginWithApple: function() {
        if (typeof AppleID === 'undefined') {
            this.showMessage('Apple SDK未加载，请刷新页面重试', 'error');
            return;
        }
        
        var self = this;
        AppleID.auth.signIn().then(function(response) {
            // 解析Apple返回的ID Token
            var user = {
                id: 'apple_' + response.user,
                registerType: 'apple',
                email: response.email || '',
                nickname: response.name || 'Apple用户',
                avatar: 'img/default-avatar.svg',
                createdAt: new Date().toISOString(),
                gameStats: {
                    totalGames: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0
                }
            };
            
            var users = self.getUsers();
            var existingUser = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    existingUser = users[i];
                    break;
                }
            }
            
            if (!existingUser) {
                users.push(user);
                self.saveUsers(users);
            } else {
                user = existingUser;
            }
            
            self.setCurrentUser(user);
            self.hideAllModals();
            self.showMessage('Apple登录成功！', 'success');
        }).catch(function(error) {
            self.showMessage('Apple登录失败', 'error');
        });
    },
    
    /**
     * 微信登录
     */
    loginWithWechat: function() {
        // 微信登录需要在微信环境中或使用微信开放平台
        if (typeof WeixinJSBridge === 'undefined') {
            this.showMessage('请在微信中打开', 'info');
            // 非微信环境，可以显示二维码扫描登录
            this.showWechatQRCode();
            return;
        }
        
        var self = this;
        // 微信环境中的登录逻辑
        // 这里需要后端配合获取code和用户信息
        this.showMessage('微信登录功能需要后端支持，请配置服务器', 'info');
    },
    
    /**
     * 显示微信二维码登录
     */
    showWechatQRCode: function() {
        // 生成微信登录二维码
        var qrModal = document.getElementById('wechatQRModal');
        if (qrModal) {
            qrModal.style.display = 'block';
            // 这里可以集成微信开放平台的二维码登录
            this.showMessage('微信扫码登录功能需要配置微信开放平台应用', 'info');
        }
    },
    
    /**
     * 加载第三方SDK
     */
    loadThirdPartySDK: function() {
        // Google SDK
        if (!document.getElementById('google-sdk')) {
            var googleScript = document.createElement('script');
            googleScript.id = 'google-sdk';
            googleScript.src = 'https://apis.google.com/js/platform.js';
            googleScript.async = true;
            googleScript.defer = true;
            document.body.appendChild(googleScript);
        }
        
        // Facebook SDK
        if (!document.getElementById('facebook-sdk')) {
            var fbScript = document.createElement('script');
            fbScript.id = 'facebook-sdk';
            fbScript.src = 'https://connect.facebook.net/zh_CN/sdk.js';
            fbScript.async = true;
            fbScript.defer = true;
            document.body.appendChild(fbScript);
            
            window.fbAsyncInit = function() {
                if (typeof FB !== 'undefined') {
                    FB.init({
                        appId: auth.oauthConfig.facebook.appId,
                        cookie: true,
                        xfbml: true,
                        version: 'v12.0'
                    });
                }
            };
        }
        
        // Apple SDK
        if (!document.getElementById('apple-sdk')) {
            var appleScript = document.createElement('script');
            appleScript.id = 'apple-sdk';
            appleScript.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/zh_CN/appleid.auth.js';
            appleScript.async = true;
            appleScript.defer = true;
            document.body.appendChild(appleScript);
        }
    },
    
    /**
     * 获取所有用户
     */
    getUsers: function() {
        var usersJson = localStorage.getItem('users');
        if (usersJson) {
            try {
                return JSON.parse(usersJson);
            } catch(e) {
                return [];
            }
        }
        return [];
    },
    
    /**
     * 保存用户列表
     */
    saveUsers: function(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    
    /**
     * 更新当前用户游戏统计
     */
    updateGameStats: function(result) {
        if (!this.currentUser) return;
        
        var users = this.getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === this.currentUser.id) {
                if (!users[i].gameStats) {
                    users[i].gameStats = {
                        totalGames: 0,
                        wins: 0,
                        losses: 0,
                        draws: 0
                    };
                }
                
                users[i].gameStats.totalGames++;
                if (result === 'win') {
                    users[i].gameStats.wins++;
                } else if (result === 'loss') {
                    users[i].gameStats.losses++;
                } else if (result === 'draw') {
                    users[i].gameStats.draws++;
                }
                
                this.saveUsers(users);
                this.setCurrentUser(users[i]);
                break;
            }
        }
    },
    
    /**
     * 密码哈希（简单示例，实际应使用更安全的加密）
     */
    hashPassword: function(password) {
        // 这里使用简单的Base64编码，实际项目应使用bcrypt等加密算法
        return btoa(password + '_salt_chess');
    },
    
    /**
     * 验证邮箱
     */
    validateEmail: function(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * 验证手机号
     */
    validatePhone: function(phone) {
        var re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    },
    
    /**
     * 显示消息
     */
    showMessage: function(message, type) {
        var messageBox = document.getElementById('authMessage');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'authMessage';
            messageBox.className = 'auth-message';
            document.body.appendChild(messageBox);
        }
        
        messageBox.textContent = message;
        messageBox.className = 'auth-message auth-message-' + type + ' show';
        
        setTimeout(function() {
            messageBox.className = 'auth-message';
        }, 3000);
    }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        auth.init();
    });
} else {
    auth.init();
}
