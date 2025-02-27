window.onload = function() {
    // ローディング画面を取得
    const loadingScreen = document.getElementById("loading-screen");
    const body = document.body;

    // 1秒後にフェードアウト開始
    setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        body.classList.add("loaded");

        // フェードアウト完了後にローディング画面を削除
        setTimeout(() => {
            loadingScreen.remove();
        }, 1000);
    }, 1000);
};
