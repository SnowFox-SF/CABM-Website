// 粒子漂浮效果 - 科幻风格粒子系统
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 120;
        this.mouse = { x: 0, y: 0 };
        this.connectionDistance = 120;
        this.animationId = null;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    bindEvents() {
        // 鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
        });

        // 鼠标离开画布
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        // 触摸事件支持
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);

        // 更新和绘制粒子
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        // 绘制粒子连接线
        this.drawConnections();

        // 绘制鼠标连接
        this.drawMouseConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                if (distance < this.connectionDistance) {
                    const opacity = (this.connectionDistance - distance) / this.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        if (this.mouse.x < 0 || this.mouse.y < 0) return;

        this.particles.forEach(particle => {
            const distance = Math.sqrt((particle.x - this.mouse.x) ** 2 + (particle.y - this.mouse.y) ** 2);

            if (distance < this.connectionDistance * 1.5) {
                const opacity = (this.connectionDistance * 1.5 - distance) / (this.connectionDistance * 1.5);
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 单个粒子类
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        // 随机位置
        this.x = Math.random() * (this.canvas.offsetWidth || window.innerWidth);
        this.y = Math.random() * (this.canvas.offsetHeight || window.innerHeight);

        // 随机速度
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;

        // 随机大小和颜色
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;

        // 颜色变化
        this.colorIndex = Math.floor(Math.random() * 3);
        this.colors = [
            '#00d4ff', // 青色
            '#0080ff', // 蓝色
            '#00ffff'  // 亮青色
        ];
        this.color = this.colors[this.colorIndex];

        // 脉冲效果
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        // 位置更新
        this.x += this.vx;
        this.y += this.vy;

        // 边界检测和反弹
        const canvasWidth = this.canvas.offsetWidth || window.innerWidth;
        const canvasHeight = this.canvas.offsetHeight || window.innerHeight;

        if (this.x < 0 || this.x > canvasWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(canvasWidth, this.x));
        }

        if (this.y < 0 || this.y > canvasHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(canvasHeight, this.y));
        }

        // 脉冲效果
        this.pulsePhase += this.pulseSpeed;
        this.currentSize = this.size + Math.sin(this.pulsePhase) * 0.5;

        // 颜色渐变
        const time = Date.now() * 0.001;
        const colorShift = Math.sin(time + this.pulsePhase) * 0.3 + 0.7;
        this.opacity = Math.max(0.1, Math.min(1, colorShift));

        // 随机方向微调
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;

        // 限制速度
        const maxSpeed = 1;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    draw(ctx) {
        ctx.save();

        // 创建发光效果
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.currentSize * 2;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // 添加内环发光
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.fill();

        ctx.restore();
    }
}

// 初始化粒子系统
document.addEventListener('DOMContentLoaded', function() {
    const matrixBg = document.getElementById('matrix-bg');
    if (matrixBg) {
        // 创建画布元素
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';

        matrixBg.appendChild(canvas);

        // 初始化粒子系统
        const particleSystem = new ParticleSystem(canvas);

        // 页面可见性API - 当页面不可见时暂停动画
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                particleSystem.destroy();
            } else {
                particleSystem.animate();
            }
        });
    }
});