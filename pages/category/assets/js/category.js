// ロード画面を追加
const loadingSpinner = document.createElement("div");
loadingSpinner.innerHTML = `
    <div id="loading-screen">
        <div class="loader">
            <div class="fork-spoon"></div>
        </div>
        <p class="loading-text">読み込み中...</p>
    </div>
`;
document.body.appendChild(loadingSpinner);

// ロード画面を表示する関数
function showLoading() {
    document.getElementById("loading-screen").style.display = "flex";
}

// ロード画面を非表示にする関数（フェードアウト）
function hideLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("fade-out"); // フェードアウトのクラスを追加

    // 完全に消えるまで 1 秒待って display: none にする
    setTimeout(() => {
        loadingScreen.style.display = "none";
        document.body.classList.add("loaded"); // メインコンテンツを表示
    }, 1000); // CSSの `transition: all 1s ease-out;` に合わせて 1秒待つ
}


document.addEventListener("DOMContentLoaded", async function () {
    const restaurantContainer = document.querySelector(".category__container");

    // `.row.row-cols-1.row-cols-md-6` を検索（存在しない場合は新規作成）
    let rowContainer = restaurantContainer.querySelector(".row.row-cols-1.row-cols-md-6");
    if (!rowContainer) {
        rowContainer = document.createElement("div");
        rowContainer.classList.add("row", "row-cols-1", "row-cols-md-6");
        restaurantContainer.appendChild(rowContainer);
    }

    // 地方選択のプルダウン
    const areaSelect = document.createElement("select");
    areaSelect.classList.add("form-control", "my-3");
    areaSelect.innerHTML = `<option value="">すべての地方</option>`; // 初期値
    restaurantContainer.insertAdjacentElement("beforebegin", areaSelect);

    // 都道府県選択のプルダウン
    const prefectureSelect = document.createElement("select");
    prefectureSelect.classList.add("form-control", "my-3");
    prefectureSelect.innerHTML = `<option value="">すべての県</option>`; // 初期値
    restaurantContainer.insertAdjacentElement("beforebegin", prefectureSelect);

    // `stores.json` のパスを動的に設定
    const isLocal = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1");
    const jsonPath = isLocal ? "../../../assets/json/stores.json" : `${window.location.origin}/tabereki/assets/json/stores.json`;

    console.log(jsonPath);

    try {
        showLoading();  // 🟢 データ取得前にロード画面を表示

        const response = await fetch(jsonPath);
        const storePages = await response.json();

        const stores = [];
        const allAreas = new Set(); // 全地方リスト
        const areaToPrefectures = {}; // 地方ごとの都道府県リスト

        // 各ページの情報を取得
        for (const page of storePages) {
            try {
                const pagePath = isLocal
                    ? `../${page}`
                    : `${window.location.origin}/tabereki/pages/restaurant/${page}`;

                const res = await fetch(pagePath);
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");

                const name = doc.querySelector("meta[name='store-name']").content;
                const tags = doc.querySelector("meta[name='store-tags']").content.split(",").map(tag => tag.trim());
                const prefecture = doc.querySelector("meta[name='store-prefecture']").content;
                const area = doc.querySelector("meta[name='store-area']").content;
                const image = doc.querySelector("meta[name='store-image']").content;

                stores.push({ name, url: pagePath, tags, prefecture, area, image });

                // 地方セットに追加
                allAreas.add(area);

                // 地方ごとの都道府県をマッピング
                if (!areaToPrefectures[area]) {
                    areaToPrefectures[area] = new Set();
                }
                areaToPrefectures[area].add(prefecture);
                console.log(pagePath);
            } catch (error) {
                console.error(`${page} の取得エラー:`, error);
            }
        }

        hideLoading();  // 🔴 データ取得が完了したらロード画面を非表示

        console.log("All Stores:", stores);
        console.log("Target Tag:", window.targetTag);

        // 地方プルダウンを五十音順に並べて追加
        areaSelect.innerHTML += [...allAreas]
            .sort((a, b) => a.localeCompare(b, 'ja'))
            .map(area => `<option value="${area}">${area}</option>`)
            .join("");

        // 初期表示（タグに一致するすべての店舗を表示）
        filterStores();

        // 地方が選択されたら都道府県プルダウンを更新
        areaSelect.addEventListener("change", function () {
            const selectedArea = areaSelect.value;
            prefectureSelect.innerHTML = `<option value="">すべての県</option>`; // 初期値

            if (selectedArea && areaToPrefectures[selectedArea]) {
                prefectureSelect.innerHTML += [...areaToPrefectures[selectedArea]]
                    .sort((a, b) => a.localeCompare(b, 'ja'))
                    .map(pref => `<option value="${pref}">${pref}</option>`)
                    .join("");
            }

            filterStores();
        });

        prefectureSelect.addEventListener("change", function () {
            filterStores();
        });

        function filterStores() {
            const selectedArea = areaSelect.value;
            const selectedPrefecture = prefectureSelect.value;
            const targetTag = window.targetTag ? window.targetTag.trim() : "";

            let filteredStores = stores;

            if (targetTag) {
                filteredStores = filteredStores.filter(store => store.tags.includes(targetTag));
            }
            if (selectedArea) {
                filteredStores = filteredStores.filter(store => store.area === selectedArea);
            }
            if (selectedPrefecture) {
                filteredStores = filteredStores.filter(store => store.prefecture === selectedPrefecture);
            }

            displayStores(filteredStores);
        }

        function displayStores(filteredStores) {
            rowContainer.innerHTML = "";
            if (filteredStores.length === 0) {
                rowContainer.innerHTML = `<p class='text-center'>該当する店舗がありません。</p>`;
            } else {
                filteredStores.forEach(store => {
                    rowContainer.innerHTML += `
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
                });
            }
        }
    } catch (error) {
        hideLoading();
        console.error("店舗ページリストの取得エラー:", error);
    }
});
