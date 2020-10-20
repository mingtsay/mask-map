(() => {
    if (!("geolocation" in navigator)) return;
    document.getElementById('unsupported').style.display = 'none';

    const displayMaskData = async (uri, hasDistance) => {
        const tbody = document.getElementById('tbody');
        while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);

        const loadingTr = document.createElement('tr');
        const loadingTd = document.createElement('td');
        loadingTd.colSpan = 9;
        loadingTd.textContent = '資料正在載入中…';
        loadingTr.appendChild(loadingTd);
        tbody.appendChild(loadingTr);

        const list = await fetch(uri).then(r => r.json());

        tbody.removeChild(tbody.firstChild);

        if (!list.features.length) {
            const emptyTr = document.createElement('tr');
            const emptyTd = document.createElement('td');
            emptyTd.colSpan = 9;
            emptyTd.textContent = '您選擇的條件無任何醫事機構資訊可供顯示。';
            emptyTr.appendChild(emptyTd);
            tbody.appendChild(emptyTr);

            return;
        }

        const properties = [
            {key: 'name', className: 'list-name'},
            {key: 'phone', className: 'list-phone'},
            {key: 'address', className: 'list-address'},
            {key: 'mask_adult', className: 'list-mask list-mask-adult'},
            {key: 'mask_child', className: 'list-mask list-mask-child'},
            {key: 'note', className: 'list-note'},
            {key: 'custom_note', className: 'list-custom_note'},
            {key: 'website', className: 'list-website'},
            {key: 'distance', className: 'list-distance'}
        ];
        for (const i in list.features) {
            const record = list.features[i].properties;
            const tr = document.createElement('tr');
            for (const j in properties) {
                const property = properties[j];
                const td = document.createElement('td');
                td.textContent = 'distance' !== property.key ? record[property.key] :
                    (hasDistance ? `${record.distance.distance} ${record.distance.unit}` : '不適用');
                td.className = property.className;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    };

    document.getElementById('position-obtain').addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('position-longitude').value = position.coords.longitude;
            document.getElementById('position-latitude').value = position.coords.latitude;
        }, positionError => {
            alert(`目前位置取得失敗 (${positionError.code}) ${positionError.message}`);
        });
    });

    document.getElementById('form-position').addEventListener('submit', event => {
        event.preventDefault();

        const longitude = document.getElementById('position-longitude').value;
        const latitude = document.getElementById('position-latitude').value;
        const limit = document.getElementById('list-obtain-limit').value;
        const filter = document.getElementById('list-obtain-filter').checked;

        displayMaskData(`/list/${longitude}/${latitude}?limit=${limit}${filter ? '&filter=on' : ''}`, true);
    });

    document.getElementById('tgos-county').addEventListener('change', () => {
        const county = document.getElementById('tgos-county').value;
        const $town = document.getElementById('tgos-town');
        const $cunli = document.getElementById('tgos-cunli');
        while ($town.lastChild.value) $town.removeChild($town.lastChild);
        while ($cunli.lastChild.value) $cunli.removeChild($cunli.lastChild);

        for (const town in tgos[county]) {
            if (!tgos.hasOwnProperty(county)) continue;
            const town_option = document.createElement('option');
            town_option.textContent = town;
            town_option.value = town;
            $town.appendChild(town_option);
        }
    });

    document.getElementById('tgos-town').addEventListener('change', () => {
        const county = document.getElementById('tgos-county').value;
        const town = document.getElementById('tgos-town').value;
        const $cunli = document.getElementById('tgos-cunli');
        while ($cunli.lastChild.value) $cunli.removeChild($cunli.lastChild);

        for (const cunli of tgos[county][town]) {
            const cunli_option = document.createElement('option');
            cunli_option.textContent = cunli;
            cunli_option.value = cunli;
            $cunli.appendChild(cunli_option);
        }
    });

    document.getElementById('form-tgos').addEventListener('submit', event => {
        event.preventDefault();

        const county = document.getElementById('tgos-county').value;
        const town = document.getElementById('tgos-town').value;
        const cunli = document.getElementById('tgos-cunli').value;
        const limit = document.getElementById('tgos-obtain-limit').value;
        const filter = document.getElementById('tgos-obtain-filter').checked;

        displayMaskData(`/tgos/${county}/${town}/${cunli}?limit=${limit}${filter ? '&filter=on' : ''}`, false);
    });

    fetch('/tgos').then(r => r.json()).then(tgos => {
        window.tgos = tgos;
        for (const county in tgos) {
            if (!tgos.hasOwnProperty(county)) continue;
            const county_option = document.createElement('option');
            county_option.textContent = county;
            county_option.value = county;
            document.getElementById('tgos-county').appendChild(county_option);
        }
    });

    document.getElementById('form-search').addEventListener('submit', event => {
        event.preventDefault();

        const query = document.getElementById('search-query').value;
        const limit = document.getElementById('search-obtain-limit').value;
        const filter = document.getElementById('search-obtain-filter').checked;

        const query_encoded = encodeURIComponent(query).replace(/%20/g, '+');

        displayMaskData(`/search?q=${query_encoded}&limit=${limit}${filter ? '&filter=on' : ''}`, false);
    });
})();
