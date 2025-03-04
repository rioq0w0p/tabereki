document.addEventListener("DOMContentLoaded", async function () {
    const restaurantContainer = document.querySelector(".category__container");

    // `.row.row-cols-1.row-cols-md-6` を検索（存在しない場合は新規作成）
    let rowContainer = restaurantContainer.querySelector(".row.row-cols-1.row-cols-md-6");
    if (!rowContainer) {
        rowContainer = document.createElement("div");
        rowContainer.classList.add("row", "row-cols-1", "row-cols-md-6");
        restaurantContainer.appendChild(rowContainer);
    }

    const prefectureSelect = document.createElement("select");
    prefectureSelect.classList.add("form-control", "my-3");
    prefectureSelect.innerHTML = `<option value="all">すべての${window.targetArea}エリア</option>`; // 初期値
    restaurantContainer.insertAdjacentElement("beforebegin", prefectureSelect); // フィルタを上部に追加

    // `stores.json` のパスを動的に設定
    const jsonPath = window.location.pathname.includes("/region/") ? "../../../../assets/json/stores.json" : "stores.json";

    try {
        // JSONから店舗ページリストを取得
        const response = await fetch(jsonPath);
        const storePages = await response.json();

        const stores = [];
        const allPrefectures = new Set(); // 都道府県一覧

        // 各ページの情報を取得
        for (const page of storePages) {
            try {
                const pagePath = window.location.pathname.includes("/region/") ? `../${page}` : page;
                const res = await fetch(pagePath);
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

                // `meta` タグから情報を取得
                const name = doc.querySelector("meta[name='store-name']").content;
                const tags = doc.querySelector("meta[name='store-tags']").content.split(",").map(tag => tag.trim());
                const prefecture = doc.querySelector("meta[name='store-prefecture']").content; // 都道府県
                const area = doc.querySelector("meta[name='store-area']").content; // エリア（関東、関西など）
                const image = doc.querySelector("meta[name='store-image']").content;

                stores.push({ name, url: pagePath, tags, prefecture, area, image });

                // `window.targetArea` に一致する都道府県をセットに追加
                if (area === window.targetArea) {
                    allPrefectures.add(prefecture);
                }
            } catch (error) {
                console.error(`${page} の取得エラー:`, error);
            }
        }

        console.log("All Stores:", stores);
        console.log(`All Prefectures (${window.targetArea}):`, [...allPrefectures]);

        // 都道府県プルダウンを動的に生成（五十音順）
        prefectureSelect.innerHTML += [...allPrefectures]
            .sort((a, b) => a.localeCompare(b, 'ja'))
            .map(pref => `<option value="${pref}">${pref}</option>`)
            .join("");

        // 初期状態では `window.targetArea` の全店舗を表示
        function displayStores(filteredStores) {
            rowContainer.innerHTML = "";
            if (filteredStores.length === 0) {
                rowContainer.innerHTML = `<p class='text-center'>該当する店舗がありません。</p>`;
            } else {
                filteredStores
                    .sort((a, b) => a.name.localeCompare(b.name, 'ja')) // 五十音順にソート
                    .forEach(store => {
                        const cardHTML = `
                            <div class="col mb-4">
                                <a href="${store.url}" class="card-link">
                                    <div class="card h-100">
                                        <img src="${store.image}" class="card-img-top" alt="${store.name}">
                                        <div class="card-body">
                                            <h5 class="card-title">${store.name}</h5>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        `;
                        rowContainer.innerHTML += cardHTML;
                    });
            }
        }

        // 初期表示：`window.targetArea` の店舗をすべて表示
        displayStores(stores.filter(store => store.area === window.targetArea));

        // 都道府県が選択されたらフィルタリング
        prefectureSelect.addEventListener("change", function () {
            const selectedPrefecture = prefectureSelect.value;

            if (selectedPrefecture === "all") {
                // すべての `window.targetArea` の店舗を表示
                displayStores(stores.filter(store => store.area === window.targetArea));
            } else {
                // 選択した都道府県の店舗のみ表示
                displayStores(stores.filter(store => store.prefecture === selectedPrefecture));
            }
        });

    } catch (error) {
        console.error("店舗ページリストの取得エラー:", error);
    }
});
