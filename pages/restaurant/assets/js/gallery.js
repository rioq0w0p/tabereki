function changeMainImage(src, caption, shouldScroll = true) {
    const mainImage = document.getElementById('mainImage');
    const captionElement = document.getElementById('imageCaption');
    
    // メイン画像を更新
    mainImage.src = src;
    
    // キャプションを更新
    if (caption) {
        captionElement.textContent = caption;
    }

    // サムネイルのアクティブ状態を更新
    document.querySelectorAll('.shop-photos__thumbnail').forEach(thumb => {
        if (thumb.querySelector('img').src === src) {
            thumb.classList.add('active');
            // 初回読み込み時はスクロールしない
            if (shouldScroll) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        } else {
            thumb.classList.remove('active');
        }
    });
}

// 画像切り替え関数
function navigateImage(direction) {
    const thumbnails = Array.from(document.querySelectorAll('.shop-photos__thumbnail'));
    const currentIndex = thumbnails.findIndex(thumb => thumb.classList.contains('active'));
    
    let nextIndex;
    if (direction === 'next') {
        nextIndex = currentIndex + 1 >= thumbnails.length ? 0 : currentIndex + 1;
    } else {
        nextIndex = currentIndex - 1 < 0 ? thumbnails.length - 1 : currentIndex - 1;
    }

    const nextImage = thumbnails[nextIndex].querySelector('img');
    changeMainImage(nextImage.src, nextImage.dataset.caption);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 最初の画像を設定（スクロールを防ぐために scrollIntoView を実行しない）
    const firstThumbnail = document.querySelector('.shop-photos__thumbnail img');
    if (firstThumbnail) {
        changeMainImage(firstThumbnail.src, firstThumbnail.dataset.caption, false);
    }

    // キーボード操作
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
            navigateImage('next');
        }
    });

    // タッチスワイプ操作のサポート
    const mainImage = document.getElementById('mainImage');
    let touchStartX = 0;
    
    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    mainImage.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // 50px以上のスワイプで反応
            if (diff > 0) {
                navigateImage('next');
            } else {
                navigateImage('prev');
            }
        }
    });
});