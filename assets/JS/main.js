// カードのクリックアニメーション
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('card--active');
            setTimeout(() => {
                this.classList.remove('card--active');
            }, 100);
        });
    });
});

// 画像の遅延読み込みを管理するIntersection Observer
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// 言語切り替え機能
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    const jaText = document.getElementById('jaText');
    const enText = document.getElementById('enText');

    // デバウンス関数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // 画面サイズに応じた表示制御
    const handleLanguageDisplay = () => {
        const isMobile = window.innerWidth <= 576;
        const isJapanese = languageSelect.value === 'ja';
        
        jaText.style.display = isMobile ? (isJapanese ? 'block' : 'none') : 'block';
        enText.style.display = isMobile ? (isJapanese ? 'none' : 'block') : 'block';
    };

    // 言語選択が変更されたときの処理
    languageSelect.addEventListener('change', handleLanguageDisplay);

    // 画面サイズが変更されたときの処理（デバウンス処理付き）
    window.addEventListener('resize', debounce(handleLanguageDisplay, 150));

    // 初期表示時の処理
    handleLanguageDisplay();
});
