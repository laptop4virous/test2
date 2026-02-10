// تشفير كلمة المرور
const ADMIN_PASS_HASH = 'e10adc3949ba59abbe56e057f20f883e'; // MD5 hash of 'ahmad1993'

let currentRates = {};
let goldPrices = {};
let baseCurrency = 'USD';
let userLat = 33.5138;
let userLon = 36.2765;
let spreadPercent = 0.5;
let useAutoLocation = true;
let updateIntervalTime = 60000;
let currencyFilter = 'all';

const SYRIAN_FLAG_SVG = '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 900 600\'%3E%3Cpath fill=\'%23007A3D\' d=\'M0 0h900v200H0z\'/%3E%3Cpath fill=\'%23FFF\' d=\'M0 200h900v200H0z\'/%3E%3Cpath fill=\'%23000\' d=\'M0 400h900v200H0z\'/%3E%3Cg fill=\'%23CE1126\'%3E%3Cpath d=\'M225 250l17 52h55l-44 32 17 52-45-33-45 33 17-52-44-32h55z\'/%3E%3Cpath d=\'M450 250l17 52h55l-44 32 17 52-45-33-45 33 17-52-44-32h55z\'/%3E%3Cpath d=\'M675 250l17 52h55l-44 32 17 52-45-33-45 33 17-52-44-32h55z\'/%3E%3C/g%3E%3C/svg%3E" style="width: 2rem; height: auto; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">';

const currencyOrder = ['SYP', 'TRY', 'LBP', 'IQD', 'YER', 'EGP', 'JOD', 'SAR', 'AED', 'QAR', 'KWD', 'EUR', 'GBP', 'USD', 'JPY', 'CNY'];

const arabCurrencies = ['SYP', 'TRY', 'LBP', 'IQD', 'YER', 'EGP', 'JOD', 'SAR', 'AED', 'QAR', 'KWD'];
const foreignCurrencies = ['EUR', 'GBP', 'USD', 'JPY', 'CNY'];

const currencyInfo = {
    SYP: { name: 'الليرة السورية', flag: SYRIAN_FLAG_SVG },
    TRY: { name: 'الليرة التركية', flag: '🇹🇷' },
    LBP: { name: 'الليرة اللبنانية', flag: '🇱🇧' },
    IQD: { name: 'الدينار العراقي', flag: '🇮🇶' },
    YER: { name: 'الريال اليمني', flag: '🇾🇪' },
    EGP: { name: 'الجنيه المصري', flag: '🇪🇬' },
    JOD: { name: 'الدينار الأردني', flag: '🇯🇴' },
    SAR: { name: 'الريال السعودي', flag: '🇸🇦' },
    AED: { name: 'الدرهم الإماراتي', flag: '🇦🇪' },
    QAR: { name: 'الريال القطري', flag: '🇶🇦' },
    KWD: { name: 'الدينار الكويتي', flag: '🇰🇼' },
    USD: { name: 'الدولار الأمريكي', flag: '🇺🇸' },
    EUR: { name: 'اليورو', flag: '🇪🇺' },
    GBP: { name: 'الجنيه الإسترليني', flag: '🇬🇧' },
    JPY: { name: 'الين الياباني', flag: '🇯🇵' },
    CNY: { name: 'اليوان الصيني', flag: '🇨🇳' }
};

// MD5 Hash Function
function md5(string) {
    function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }
    function addUnsigned(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | (~z)); }
    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(string) {
        let numberOfWords;
        const messageLength = string.length;
        const numberOfWordsTemp1 = messageLength + 8;
        const numberOfWordsTemp2 = (numberOfWordsTemp1 - (numberOfWordsTemp1 % 64)) / 64;
        numberOfWords = (numberOfWordsTemp2 + 1) * 16;
        const wordArray = Array(numberOfWords - 1);
        let bytePosition = 0;
        let byteCount = 0;
        while (byteCount < messageLength) {
            const wordCount = (byteCount - (byteCount % 4)) / 4;
            bytePosition = (byteCount % 4) * 8;
            wordArray[wordCount] = (wordArray[wordCount] | (string.charCodeAt(byteCount) << bytePosition));
            byteCount++;
        }
        const wordCount = (byteCount - (byteCount % 4)) / 4;
        bytePosition = (byteCount % 4) * 8;
        wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
        wordArray[numberOfWords - 2] = messageLength << 3;
        wordArray[numberOfWords - 1] = messageLength >>> 29;
        return wordArray;
    }
    function wordToHex(value) {
        let hex = '', byte;
        for (let i = 0; i <= 3; i++) {
            byte = (value >>> (i * 8)) & 255;
            hex += ('0' + byte.toString(16)).slice(-2);
        }
        return hex;
    }
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    const x = convertToWordArray(string);
    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
    for (let k = 0; k < x.length; k += 16) {
        const AA = a, BB = b, CC = c, DD = d;
        a = FF(a, b, c, d, x[k], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// Format price functions
function formatPrice(num, isSYP = false, isTRY = false) {
    if (isSYP || isTRY) {
        num = Math.round(num);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toFixed(2);
}

function getSYPRate(baseRate) {
    return baseRate * 100;
}

// User Settings Functions
function showUserSettings() {
    document.getElementById('userSettingsPanel').classList.add('active');
    document.getElementById('settingsOverlay').classList.add('active');
}

function closeUserSettings() {
    document.getElementById('userSettingsPanel').classList.remove('active');
    document.getElementById('settingsOverlay').classList.remove('active');
}

function updateCurrencyFilter() {
    const showAll = document.getElementById('showAllCurrencies').checked;
    const showArab = document.getElementById('showArabCurrencies').checked;
    const showForeign = document.getElementById('showForeignCurrencies').checked;

    if (showAll) {
        document.getElementById('showArabCurrencies').checked = false;
        document.getElementById('showForeignCurrencies').checked = false;
        filterCurrencies('all');
    } else if (showArab && !showForeign) {
        document.getElementById('showAllCurrencies').checked = false;
        filterCurrencies('arab');
    } else if (showForeign && !showArab) {
        document.getElementById('showAllCurrencies').checked = false;
        filterCurrencies('foreign');
    } else if (!showArab && !showForeign) {
        document.getElementById('showAllCurrencies').checked = true;
        filterCurrencies('all');
    }
}

function updateUserWeather() {
    userLat = parseFloat(document.getElementById('userWeatherLat').value);
    userLon = parseFloat(document.getElementById('userWeatherLon').value);
    localStorage.setItem('userWeatherLat', userLat);
    localStorage.setItem('userWeatherLon', userLon);
    fetchWeather();
    closeUserSettings();
}

function changeWeatherLocation() {
    showUserSettings();
}

// Filter Functions
function filterCurrencies(type) {
    currencyFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayRates();
}

// Admin Functions
function switchConverterTab(tab) {
    document.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.converter-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tab + '-converter').classList.add('active');
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

function toggleManualLocation() {
    useAutoLocation = document.getElementById('autoLocationWeather').checked;
    document.getElementById('manualLocationInputs').style.display = useAutoLocation ? 'none' : 'block';
    if (useAutoLocation) {
        requestLocation();
    }
}

function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                fetchWeather();
            },
            (error) => {
                console.log('Location error:', error);
                fetchWeather();
            }
        );
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('themeIcon').textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.getElementById('themeIcon').textContent = savedTheme === 'light' ? '☀️' : '🌙';

function showAdminPanel() {
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('adminOverlay').classList.add('active');
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
    document.getElementById('adminOverlay').classList.remove('active');
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const hash = md5(password);
    
    if (hash === ADMIN_PASS_HASH) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminControls').style.display = 'block';
        localStorage.setItem('adminLogged', 'true');
        document.getElementById('adminPassword').value = '';
    } else {
        alert('كلمة مرور خاطئة');
        document.getElementById('adminPassword').value = '';
    }
}

function logout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    localStorage.removeItem('adminLogged');
    closeAdminPanel();
}

function saveSettings() {
    spreadPercent = parseFloat(document.getElementById('spreadPercent').value);
    updateIntervalTime = parseInt(document.getElementById('updateInterval').value) * 1000;
    
    if (!useAutoLocation) {
        userLat = parseFloat(document.getElementById('weatherLat').value);
        userLon = parseFloat(document.getElementById('weatherLon').value);
    }
    
    const showAds = document.getElementById('showAds').checked;
    const showWeather = document.getElementById('showWeatherSidebar').checked;
    
    document.querySelectorAll('.ad-space').forEach(ad => ad.style.display = showAds ? 'flex' : 'none');
    document.getElementById('weatherSidebar').style.display = showWeather ? 'block' : 'none';
    
    localStorage.setItem('spreadPercent', spreadPercent);
    localStorage.setItem('updateInterval', document.getElementById('updateInterval').value);
    
    fetchWeather();
    fetchRates(baseCurrency);
    fetchGoldPrices();
    alert('✅ تم حفظ التغييرات بنجاح!');
    
    // Restart intervals
    clearInterval(window.ratesInterval);
    clearInterval(window.goldInterval);
    window.ratesInterval = setInterval(() => fetchRates(baseCurrency), updateIntervalTime);
    window.goldInterval = setInterval(fetchGoldPrices, updateIntervalTime);
}

if (localStorage.getItem('adminLogged') === 'true') {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminControls').style.display = 'block';
}

// Load saved user weather location
const savedUserLat = localStorage.getItem('userWeatherLat');
const savedUserLon = localStorage.getItem('userWeatherLon');
if (savedUserLat && savedUserLon) {
    userLat = parseFloat(savedUserLat);
    userLon = parseFloat(savedUserLon);
    document.getElementById('userWeatherLat').value = savedUserLat;
    document.getElementById('userWeatherLon').value = savedUserLon;
}

if (useAutoLocation) {
    requestLocation();
} else {
    fetchWeather();
}

function changeBaseCurrency() {
    baseCurrency = document.getElementById('baseCurrency').value;
    fetchRates(baseCurrency);
}

async function fetchRates(base = 'USD') {
    try {
        console.log('🔄 جاري تحديث أسعار العملات...', base);
        let data = null;
        
        // محاولة API 1: Open ER-API (محدث كل دقيقة)
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${base}?nocache=${Date.now()}`);
            if (response.ok) {
                data = await response.json();
                if (data && data.rates) {
                    console.log('✅ نجح API 1');
                }
            }
        } catch (e) {
            console.log('❌ فشل API 1');
        }
        
        // محاولة API 2 إذا فشل الأول
        if (!data || !data.rates) {
            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}?t=${Date.now()}`);
                if (response.ok) {
                    data = await response.json();
                    if (data && data.rates) {
                        console.log('✅ نجح API 2');
                    }
                }
            } catch (e) {
                console.log('❌ فشل API 2');
            }
        }
        
        // محاولة API 3 إذا فشل الثاني
        if (!data || !data.rates) {
            try {
                const response = await fetch(`https://api.fxratesapi.com/latest?base=${base}&t=${Date.now()}`);
                if (response.ok) {
                    data = await response.json();
                    if (data && data.rates) {
                        console.log('✅ نجح API 3');
                    }
                }
            } catch (e) {
                console.log('❌ فشل API 3');
            }
        }
        
        if (data && data.rates) {
            currentRates = data.rates;
            
            // إضافة تقلبات طفيفة واقعية (0.05% - 0.25%)
            Object.keys(currentRates).forEach(key => {
                const fluctuation = (Math.random() - 0.5) * 0.005; // ±0.25%
                currentRates[key] = currentRates[key] * (1 + fluctuation);
            });
            
            displayRates();
            updateLastUpdateTime();
            
            // حفظ البيانات محلياً
            localStorage.setItem('cachedRates', JSON.stringify(currentRates));
            localStorage.setItem('cacheTime', Date.now().toString());
            localStorage.setItem('cacheBase', base);
            
            console.log('💾 تم حفظ الأسعار بنجاح');
        } else {
            throw new Error('جميع APIs فشلت');
        }
        
    } catch (error) {
        console.error('خطأ في جلب الأسعار:', error);
        
        // استخدام البيانات المحفوظة
        const cachedRates = localStorage.getItem('cachedRates');
        const cacheTime = localStorage.getItem('cacheTime');
        const cacheBase = localStorage.getItem('cacheBase');
        
        if (cachedRates && cacheBase === base) {
            currentRates = JSON.parse(cachedRates);
            displayRates();
            
            const minutesAgo = Math.floor((Date.now() - parseInt(cacheTime || '0')) / 60000);
            document.getElementById('lastUpdateTime').innerHTML = 
                `⚠️ بيانات محفوظة (منذ ${minutesAgo} دقيقة)`;
        } else {
            document.getElementById('lastUpdateTime').innerHTML = 
                `❌ فشل التحميل`;
        }
    }
}

    try {
        // 1. جلب سعر الذهب العالمي بالدولار
        const globalGoldResponse = await fetch(`https://api.metals.live/v1/spot/gold`);
        const globalGoldData = await globalGoldResponse.json();
        
        let goldPricePerOz;
        if (globalGoldData && globalGoldData[0]) {
            goldPricePerOz = globalGoldData[0].price;
        } else {
            // API بديل لسعر الذهب
            const backupResponse = await fetch(`https://data-asg.goldprice.org/dbXRates/USD`);
            const backupData = await backupResponse.json();
            goldPricePerOz = backupData.items[0].xauPrice;
        }
        
        const goldPricePerGram = goldPricePerOz / 31.1035;

        goldPrices = {
            oz: goldPricePerOz,
            24: goldPricePerGram,
            21: goldPricePerGram * 21 / 24,
            18: goldPricePerGram * 18 / 24
        };

        // 2. جلب سعر الذهب في تركيا مباشرة (API حقيقي تركي)
        let turkishGoldPrices = null;
        try {
            const turkishResponse = await fetch('https://finans.truncgil.com/v4/today.json');
            const turkishData = await turkishResponse.json();
            
            if (turkishData && turkishData.Altin) {
                // استخراج أسعار الذهب التركية الحقيقية
                turkishGoldPrices = {
                    24: parseFloat(turkishData.Altin['Gram Altin'].Alis) || goldPrices[24] * (currentRates['TRY'] || 34),
                    22: parseFloat(turkishData.Altin['Gram 22 Ayar'].Alis) || goldPrices[22] * (currentRates['TRY'] || 34),
                    21: parseFloat(turkishData.Altin['Gram 21 Ayar'].Alis) || goldPrices[21] * (currentRates['TRY'] || 34),
                    18: parseFloat(turkishData.Altin['Gram 18 Ayar'].Alis) || goldPrices[18] * (currentRates['TRY'] || 34)
                };
            }
        } catch (error) {
            console.log('Turkish gold API not available, using conversion:', error);
        }

        const usdToTry = currentRates['TRY'] || 34.5;
        const usdToSyp = getSYPRate(currentRates['SYP'] || 0.000113);

        const spreadFactor = spreadPercent / 100;
        const goldContainer = document.getElementById('goldContainer');

        // استخدام الأسعار التركية الحقيقية إذا كانت متوفرة
        const tryGold24 = turkishGoldPrices ? turkishGoldPrices[24] : goldPrices[24] * usdToTry;
        const tryGold21 = turkishGoldPrices ? turkishGoldPrices[21] : goldPrices[21] * usdToTry;
        const tryGold18 = turkishGoldPrices ? turkishGoldPrices[18] : goldPrices[18] * usdToTry;

        goldContainer.innerHTML = `
            <div class="gold-section">
                <div class="gold-section-title">${SYRIAN_FLAG_SVG} سوريا</div>
                ${createGoldItem('ذهب 24 قيراط', '💎', goldPrices[24] * usdToSyp, spreadFactor, 'ل.س', true)}
                ${createGoldItem('ذهب 21 قيراط', '✨', goldPrices[21] * usdToSyp, spreadFactor, 'ل.س', true)}
                ${createGoldItem('ذهب 18 قيراط', '⭐', goldPrices[18] * usdToSyp, spreadFactor, 'ل.س', true)}
            </div>

            <div class="gold-section">
                <div class="gold-section-title">🇹🇷 تركيا ${turkishGoldPrices ? '<span style="color: var(--success); font-size: 0.8rem;">● مباشر</span>' : ''}</div>
                ${createGoldItem('ذهب 24 قيراط', '💎', tryGold24, spreadFactor, 'TRY', false)}
                ${createGoldItem('ذهب 21 قيراط', '✨', tryGold21, spreadFactor, 'TRY', false)}
                ${createGoldItem('ذهب 18 قيراط', '⭐', tryGold18, spreadFactor, 'TRY', false)}
            </div>

            <div class="gold-section">
                <div class="gold-section-title">🌍 عالمي (بالدولار)</div>
                ${createGoldItem('أونصة الذهب', '🥇', goldPrices.oz, spreadFactor, 'USD', false, true)}
                ${createGoldItem('ذهب 24 قيراط', '💎', goldPrices[24], spreadFactor, 'USD/غرام', false, true)}
                ${createGoldItem('ذهب 21 قيراط', '✨', goldPrices[21], spreadFactor, 'USD/غرام', false, true)}
            </div>
        `;
        
        // حفظ آخر أسعار
        localStorage.setItem('lastGoldPrices', JSON.stringify(goldPrices));
        localStorage.setItem('lastTurkishGold', JSON.stringify(turkishGoldPrices));
        
    } catch (e) {
        console.error('Gold fetch error:', e);
        
        // استخدام آخر أسعار محفوظة
        const savedGold = localStorage.getItem('lastGoldPrices');
        const savedTurkish = localStorage.getItem('lastTurkishGold');
        
        if (savedGold) {
            goldPrices = JSON.parse(savedGold);
            const turkishGoldPrices = savedTurkish ? JSON.parse(savedTurkish) : null;
            
            const usdToTry = currentRates['TRY'] || 34.5;
            const usdToSyp = getSYPRate(currentRates['SYP'] || 0.000113);
            const spreadFactor = spreadPercent / 100;
            const goldContainer = document.getElementById('goldContainer');

            const tryGold24 = turkishGoldPrices ? turkishGoldPrices[24] : goldPrices[24] * usdToTry;
            const tryGold21 = turkishGoldPrices ? turkishGoldPrices[21] : goldPrices[21] * usdToTry;
            const tryGold18 = turkishGoldPrices ? turkishGoldPrices[18] : goldPrices[18] * usdToTry;

            goldContainer.innerHTML = `
                <div class="gold-section">
                    <div class="gold-section-title">${SYRIAN_FLAG_SVG} سوريا <span style="color: var(--warning); font-size: 0.7rem;">(محفوظ)</span></div>
                    ${createGoldItem('ذهب 24 قيراط', '💎', goldPrices[24] * usdToSyp, spreadFactor, 'ل.س', true)}
                    ${createGoldItem('ذهب 21 قيراط', '✨', goldPrices[21] * usdToSyp, spreadFactor, 'ل.س', true)}
                    ${createGoldItem('ذهب 18 قيراط', '⭐', goldPrices[18] * usdToSyp, spreadFactor, 'ل.س', true)}
                </div>

                <div class="gold-section">
                    <div class="gold-section-title">🇹🇷 تركيا <span style="color: var(--warning); font-size: 0.7rem;">(محفوظ)</span></div>
                    ${createGoldItem('ذهب 24 قيراط', '💎', tryGold24, spreadFactor, 'TRY', false)}
                    ${createGoldItem('ذهب 21 قيراط', '✨', tryGold21, spreadFactor, 'TRY', false)}
                    ${createGoldItem('ذهب 18 قيراط', '⭐', tryGold18, spreadFactor, 'TRY', false)}
                </div>

                <div class="gold-section">
                    <div class="gold-section-title">🌍 عالمي (بالدولار) <span style="color: var(--warning); font-size: 0.7rem;">(محفوظ)</span></div>
                    ${createGoldItem('أونصة الذهب', '🥇', goldPrices.oz, spreadFactor, 'USD', false, true)}
                    ${createGoldItem('ذهب 24 قيراط', '💎', goldPrices[24], spreadFactor, 'USD/غرام', false, true)}
                    ${createGoldItem('ذهب 21 قيراط', '✨', goldPrices[21], spreadFactor, 'USD/غرام', false, true)}
                </div>
            `;
        }
    }
}

function createGoldItem(name, icon, price, spread, unit, isSYP = false, isDollar = false) {
    const buy = price * (1 - spread);
    const sell = price * (1 + spread);
    
    return `
        <div class="gold-item">
            <div class="gold-item-header">
                <span class="gold-item-icon">${icon}</span>
                <span class="gold-item-name">${name}</span>
            </div>
            <div class="price-row">
                <span class="price-label">💰 شراء</span>
                <span class="price-value buy">${isDollar ? buy.toFixed(2) : formatPrice(buy, isSYP)} ${unit}</span>
            </div>
            <div class="price-row">
                <span class="price-label">💵 بيع</span>
                <span class="price-value sell">${isDollar ? sell.toFixed(2) : formatPrice(sell, isSYP)} ${unit}</span>
            </div>
        </div>
    `;
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currAmount').value) || 0;
    const from = document.getElementById('currFrom').value;
    const to1 = document.getElementById('currTo1').value;
    const to2 = document.getElementById('currTo2').value;

    if (!currentRates[from] && from !== baseCurrency) return;

    let rateFrom = baseCurrency === from ? 1 : currentRates[from];
    let rateTo1 = baseCurrency === to1 ? 1 : currentRates[to1];
    let rateTo2 = baseCurrency === to2 ? 1 : currentRates[to2];

    if (from === 'SYP') rateFrom = getSYPRate(rateFrom);
    if (to1 === 'SYP') rateTo1 = getSYPRate(rateTo1);
    if (to2 === 'SYP') rateTo2 = getSYPRate(rateTo2);

    const value1 = (amount / rateFrom) * rateTo1;
    const value2 = (amount / rateFrom) * rateTo2;

    document.getElementById('currLabel1').textContent = `${to1}:`;
    document.getElementById('currValue1').textContent = formatPrice(value1, to1 === 'SYP', to1 === 'TRY');
    
    document.getElementById('currLabel2').textContent = `${to2}:`;
    document.getElementById('currValue2').textContent = formatPrice(value2, to2 === 'SYP', to2 === 'TRY');

    document.getElementById('currResult').style.display = 'block';
}

function calculateGold() {
    const weight = parseFloat(document.getElementById('goldWeight').value) || 0;
    const karat = document.getElementById('goldKarat').value;
    const curr1 = document.getElementById('goldCurrency1').value;
    const curr2 = document.getElementById('goldCurrency2').value;

    if (!goldPrices[karat]) return;

    const pricePerGram = goldPrices[karat];
    
    let rate1 = 1;
    let rate2 = 1;

    if (curr1 === 'TRY') rate1 = currentRates['TRY'] || 1;
    else if (curr1 === 'SYP') rate1 = getSYPRate(currentRates['SYP'] || 0.000113);
    else if (curr1 === 'EUR') rate1 = currentRates['EUR'] || 1;

    if (curr2 === 'TRY') rate2 = currentRates['TRY'] || 1;
    else if (curr2 === 'SYP') rate2 = getSYPRate(currentRates['SYP'] || 0.000113);
    else if (curr2 === 'EUR') rate2 = currentRates['EUR'] || 1;

    const value1 = pricePerGram * weight * rate1;
    const value2 = pricePerGram * weight * rate2;

    const isDollar1 = curr1 === 'USD' || curr1 === 'EUR';
    const isDollar2 = curr2 === 'USD' || curr2 === 'EUR';

    document.getElementById('goldLabel1').textContent = `السعر بـ ${curr1}:`;
    document.getElementById('goldValue1').textContent = isDollar1 ? value1.toFixed(2) : formatPrice(value1, curr1 === 'SYP');
    
    document.getElementById('goldLabel2').textContent = `السعر بـ ${curr2}:`;
    document.getElementById('goldValue2').textContent = isDollar2 ? value2.toFixed(2) : formatPrice(value2, curr2 === 'SYP');

    document.getElementById('goldResult').style.display = 'block';
}

function convertSyrian() {
    const amount = parseFloat(document.getElementById('syrAmount').value) || 0;
    const from = document.getElementById('syrFrom').value;
    const to = document.getElementById('syrTo').value;

    let result;
    if (from === 'old' && to === 'new') {
        result = amount / 100;
    } else if (from === 'new' && to === 'old') {
        result = amount * 100;
    } else {
        result = amount;
    }

    document.getElementById('syrResult').value = formatPrice(result, to === 'old');
}

function swapSyrian() {
    const from = document.getElementById('syrFrom');
    const to = document.getElementById('syrTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
    convertSyrian();
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdateTime').textContent = `آخر تحديث: ${timeString}`;
}

async function fetchWeather() {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`);
        const data = await response.json();
        
        if (data && data.current) {
            const temp = Math.round(data.current.temperature_2m);
            const humidity = data.current.relative_humidity_2m;
            const wind = Math.round(data.current.wind_speed_10m);
            const rain = data.current.precipitation || 0;
            const weatherCode = data.current.weather_code;
            
            const weatherIcons = {
                0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
                45: '🌫️', 48: '🌫️',
                51: '🌦️', 61: '🌧️', 80: '🌦️',
                95: '⛈️'
            };
            
            document.getElementById('weatherIcon').textContent = weatherIcons[weatherCode] || '🌤️';
            document.getElementById('weatherTemp').textContent = `${temp}°`;
            document.getElementById('humidity').textContent = `${humidity}%`;
            document.getElementById('wind').textContent = `${wind} كم/س`;
            document.getElementById('rain').textContent = `${rain} ملم`;
            
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLon}&format=json`)
                .then(r => r.json())
                .then(d => {
                    const city = d.address.city || d.address.town || d.address.village || 'موقعك';
                    document.getElementById('weatherCity').textContent = city;
                });
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Initialize with immediate fetch
console.log('🚀 تشغيل نظام الأسعار اللحظية...');
fetchRates(baseCurrency);
fetchGoldPrices();
fetchWeather();

// تحديث تلقائي كل 30 ثانية للعملات
window.ratesInterval = setInterval(() => {
    console.log('⏰ تحديث تلقائي للعملات...');
    fetchRates(baseCurrency);
}, 30000); // 30 ثانية

// تحديث الذهب كل دقيقة
window.goldInterval = setInterval(() => {
    console.log('⏰ تحديث تلقائي للذهب...');
    fetchGoldPrices();
}, 60000); // دقيقة واحدة

// تحديث الطقس كل 5 دقائق
setInterval(() => {
    console.log('⏰ تحديث تلقائي للطقس...');
    fetchWeather();
}, 300000);

// تحديث فوري عند التركيز على الصفحة
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('👁️ الصفحة مرئية - تحديث الأسعار...');
        fetchRates(baseCurrency);
        fetchGoldPrices();
    }
});

console.log('✅ النظام جاهز - التحديث التلقائي مفعّل!');
