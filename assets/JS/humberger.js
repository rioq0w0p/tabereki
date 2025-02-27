const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
});

// ドキュメント全体のクリックイベントを監視
document.addEventListener("click", (e) => {
  // クリックされた要素がハンバーガーメニューでもナビゲーションでもない場合
  if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains("open")) {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
  }
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
      });
  });
});