<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PT. Jaya Kencana Form System</title>
    <link href="style.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="main.js"></script>
    <script src="printpdf.js"></script>
    <!-- <style>
        @view-transition {
            navigation: auto;
        }
    </style> -->
</head>
<body>
    <div id="loginScreen" class="login-container">
        <div class="login-card">
            <h1 class="login-title" id="companyTitle">PT. JAYA KENCANA</h1>
            <form id="loginForm">
                <div class="form-group"><label for="username" class="form-label">Username</label> <input type="text"
                        id="username" class="form-input" placeholder="Masukkan username" required>
                </div>
                <div class="form-group"><label for="password" class="form-label">Password</label> <input type="password"
                        id="password" class="form-input" placeholder="Masukkan password" required>
                </div><button type="submit" class="btn-primary">Login</button>
            </form>
        </div>
    </div>
    <div id="mainScreen" class="container hidden"><button class="logout-btn" onclick="logout()">Logout</button>
        <header class="main-header">
            <h1 class="company-title" id="mainCompanyTitle">PT. JAYA KENCANA</h1>
            <p class="user-subtitle" id="userSubtitle">Selamat datang</p>
        </header>
        <nav class="navigation-grid">
            <div class="nav-card" data-section="escalator"><span class="nav-icon">🔧</span>
                <div class="nav-title">
                    Safety Eskalator
                </div>
            </div>
            <div class="nav-card" data-section="elevator"><span class="nav-icon">🏗️</span>
                <div class="nav-title">
                    Safety Elevator
                </div>
            </div>
            <div class="nav-card" data-section="history"><span class="nav-icon">📋</span>
                <div class="nav-title">
                    History
                </div>
            </div>
        </nav>
        <main id="contentArea"><!-- Content will be dynamically loaded here -->
        </main>
        <footer class="footer">
            <p class="copyright" id="copyrightText">Copyright 2025 PT. Jaya Kencana</p>
        </footer>
    </div>
    <script>(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'99835fab017b40c0',t:'MTc2MjA4MzgwMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();</script>
</body>

</html>
