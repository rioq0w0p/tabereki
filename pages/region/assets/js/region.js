window.addEventListener('scroll', function() {
    const backButton = document.querySelector('.back-button');
    const scrollPosition = window.scrollY;
    const headerHeight = 100; // ヘッダーの高さ
    const footer = document.querySelector('footer');
    const footerTop = footer.offsetTop;
    const windowHeight = window.innerHeight;
    const bottomThreshold = footerTop - windowHeight;

    if (scrollPosition < headerHeight || scrollPosition > bottomThreshold) {
        backButton.style.opacity = '0';
        backButton.style.pointerEvents = 'none';
    } else {
        backButton.style.opacity = '1';
        backButton.style.pointerEvents = 'auto';
    }
});

// ページ読み込み時にも実行
window.dispatchEvent(new Event('scroll'));