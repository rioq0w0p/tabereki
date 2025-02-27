$(document).ready(function() {
    // クリックイベントのみ残す（必要な場合）
    $('.card').click(function() {
        $(this).css({
            'transform': 'scale(0.95)',
            'transition': 'transform 0.1s'
        });
        setTimeout(() => {
            $(this).css({
                'transform': 'scale(1)'
            });
        }, 100);
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

    // 画面サイズに応じた表示制御
    function handleLanguageDisplay() {
        if (window.innerWidth <= 576) {  // スマートフォンサイズ
            // 言語選択の値に応じて表示を切り替え
            if (languageSelect.value === 'ja') {
                jaText.style.display = 'block';
                enText.style.display = 'none';
            } else {
                jaText.style.display = 'none';
                enText.style.display = 'block';
            }
        } else {
            // スマートフォンサイズ以外では両方表示
            jaText.style.display = 'block';
            enText.style.display = 'block';
        }
    }

    // 言語選択が変更されたときの処理
    languageSelect.addEventListener('change', handleLanguageDisplay);

    // 画面サイズが変更されたときの処理
    window.addEventListener('resize', handleLanguageDisplay);

    // 初期表示時の処理
    handleLanguageDisplay();
});
