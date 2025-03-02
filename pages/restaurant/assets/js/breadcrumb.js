function generateBreadcrumb() {
    // URLからパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const category = urlParams.get('category');
    const region = urlParams.get('region');

    const breadcrumbList = document.querySelector('.breadcrumb-002');
    
    // パンくずリストの基本構造（TOPは常に表示）
    breadcrumbList.innerHTML = '<li><a href="../../../index.html">TOP</a></li>';

    if (from === 'category' && category) {
        // カテゴリーからのアクセスの場合
        breadcrumbList.innerHTML += `
            <li><a href="../../category/${category}.html">${getCategoryName(category)}</a></li>
            <li><span>店舗情報</span></li>
        `;
    } else if (from === 'region' && region) {
        // 地域からのアクセスの場合
        breadcrumbList.innerHTML += `
            <li><a href="../../region/${region}.html">${getRegionName(region)}</a></li>
            <li><span>店舗情報</span></li>
        `;
    } else {
        // パラメータがない場合（直接アクセスなど）
        breadcrumbList.innerHTML += '<li><span>店舗情報</span></li>';
    }
}

function getCategoryName(category) {
    const categories = {
        'ramen': 'ラーメン',
        'udon': 'うどん',
        'chinese': '中華料理',
        'japanese': '和食',
        'western': '洋食',
        'other_noodle': 'その他の麺類',
        'sweets': 'スイーツ',
        'other': 'その他'
    };
    return categories[category] || '不明なカテゴリー';
}

function getRegionName(region) {
    const regions = {
        'hokkaido': '北海道',
        'tohoku': '東北',
        'kanto': '関東',
        'tyubu': '中部',
        'kinki': '近畿',
        'tyugoku': '中国',
        'shikoku': '四国',
        'kyusyu-okinawa': '九州・沖縄',
        'world': '世界'
    };
    return regions[region] || '不明な地域';
}

// ページ読み込み時にパンくずリストを生成
document.addEventListener('DOMContentLoaded', generateBreadcrumb);