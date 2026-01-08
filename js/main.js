// 主JavaScript文件 - 处理页面交互和效果

document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.classList.add('loaded');

    // 为文档链接添加点击效果
    const docLinks = document.querySelectorAll('.doc-link');
    docLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // ESC键返回主页
        if (e.key === 'Escape' && window.location.pathname.includes('/docs/')) {
            window.location.href = '../index.html';
        }

        // H键显示帮助
        if (e.key === 'h' || e.key === 'H') {
            showHelp();
        }
    });

    // 响应式导航
    initResponsiveNav();
});

function showHelp() {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff41;
            padding: 30px;
            z-index: 1000;
            font-family: 'Courier New', monospace;
            color: #00ff41;
            max-width: 400px;
            text-align: center;
        ">
            <h3 style="margin-bottom: 20px;">快捷键帮助</h3>
            <p>ESC - 返回主页</p>
            <p>H - 显示此帮助</p>
            <button onclick="this.parentElement.remove()" style="
                background: #00ff41;
                color: #000;
                border: none;
                padding: 10px 20px;
                margin-top: 20px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
            ">关闭</button>
        </div>
    `;
    document.body.appendChild(helpModal);
}

function initResponsiveNav() {
    // 移动端菜单切换
    const navSections = document.querySelectorAll('.nav-section');

    if (window.innerWidth <= 768) {
        navSections.forEach(section => {
            const h2 = section.querySelector('h2');
            const ul = section.querySelector('ul');

            h2.addEventListener('click', function() {
                ul.classList.toggle('active');
                this.classList.toggle('active');
            });

            h2.style.cursor = 'pointer';
            h2.innerHTML += ' <span style="float: right;">▼</span>';
        });
    }
}

// Markdown转换为HTML的简单函数（用于文档页面）
function markdownToHtml(markdown) {
    // 简单的Markdown转换器
    return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');
}

// 页面滚动效果
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    document.body.classList.add('scrolling');

    scrollTimeout = setTimeout(function() {
        document.body.classList.remove('scrolling');
    }, 150);
});