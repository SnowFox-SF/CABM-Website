// 主JavaScript文件 - 处理页面交互和效果

// 项目导航函数
function navigateToProject(projectName) {
    switch(projectName) {
        case 'CABM-ED':
            window.location.href = 'CABM-ED/index.html';
            break;
        case 'CABM':
        case 'CABM-DTP':
        case 'CABM-TS':
        case 'CABM-MS':
        case 'CABM-QB':
        case 'CABM-OSA':
        case 'CABM-Java':
            // 暂时显示开发中提示
            showComingSoon(projectName);
            break;
        default:
            console.log(`导航到项目: ${projectName}`);
    }
}

function showComingSoon(projectName) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 40, 80, 0.9) 100%);
            border: 2px solid #00d4ff;
            padding: 40px;
            z-index: 10000;
            font-family: 'Courier New', monospace;
            color: #00d4ff;
            max-width: 500px;
            text-align: center;
            border-radius: 15px;
            box-shadow: 0 0 50px rgba(0, 212, 255, 0.3);
            backdrop-filter: blur(20px);
        ">
            <h3 style="margin-bottom: 20px; color: #00d4ff;">${projectName}</h3>
            <p style="color: #c0e6ff; margin-bottom: 30px; line-height: 1.6;">
                该项目页面正在开发中...<br>
                敬请期待！
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 128, 255, 0.2) 100%);
                border: 2px solid #00d4ff;
                color: #00d4ff;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                transition: all 0.3s ease;
                text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 20px rgba(0, 212, 255, 0.3)'"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                确定
            </button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            backdrop-filter: blur(5px);
        " onclick="this.parentElement.remove()"></div>
    `;
    document.body.appendChild(modal);
}

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

    // 为项目卡片添加点击效果
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 添加点击动画
            this.style.transform = 'scale(0.98) translateY(-4px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
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