import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTlOk4Q-A0YuN--xoxpp2PMmOCNE4MxoQ",
    authDomain: "ooko-ab897.firebaseapp.com",
    projectId: "ooko-ab897",
    storageBucket: "ooko-ab897.firebasestorage.app",
    messagingSenderId: "914585725610",
    appId: "1:914585725610:web:4ca42679e42207619c3ed3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let localDB = { players: [], fans: [], news: [], matches: [] };
let currentUser = null; 
let currentTab = 'news';
const container = document.getElementById('app-container');

onSnapshot(collection(db, "players"), (snap) => {
    localDB.players = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if(currentUser && currentUser.role === 'player') {
        const exists = localDB.players.find(x => x.id === currentUser.info.id);
        if(!exists) {
            window.logout();
            return;
        }
    }
    render();
});
onSnapshot(collection(db, "fans"), (snap) => {
    localDB.fans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
});
onSnapshot(collection(db, "news"), (snap) => {
    localDB.news = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
});
onSnapshot(collection(db, "matches"), (snap) => {
    localDB.matches = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
});

function render() {
    if (!currentUser) {
        renderLanding();
    } else if (currentUser.role === 'fan') {
        renderFanApp();
    } else if (currentUser.role === 'player') {
        renderPlayerApp();
    }
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderLanding() {
    container.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6">
            <div class="mb-12 flex flex-col items-center text-center">
                <div class="mb-4 flex h-32 w-32 items-center justify-center rounded-full p-1 ring-2 ring-white/30 bg-white shadow-xl overflow-hidden">
                    <img src="./icon-512.png" alt="شعار نادي الرجاء العراقي" class="w-full h-full object-cover rounded-full" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgOGgudDAxIi8+PHBhdGggZD0iTTEyIDEyYTIgMiAwIDAgMSAyejEiLz48L3N2Zz4='">
                </div>
                <h1 class="text-3xl font-bold tracking-tight">نادي الرجاء العراقي</h1>
                <p class="mt-2 text-blue-200">التطبيق الرسمي لـ اللاعبين والمشجعين</p>
            </div>
            
            <div class="w-full space-y-4">
                <button onclick="renderFanLogin()" class="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition-colors">
                    <i data-lucide="users" class="h-6 w-6"></i> دخول كمشجع
                </button>
                <button onclick="renderPlayerLogin()" class="w-full bg-white/10 border border-white/20 hover:bg-white/20 text-white h-16 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition-colors">
                    <i data-lucide="user" class="h-6 w-6"></i> دخول كلاعب
                </button>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

window.renderFanLogin = function() {
    container.innerHTML = `
        <div class="flex-1 flex flex-col bg-slate-50">
            <header class="p-4">
                <button onclick="renderLanding()" class="p-2 rounded-full hover:bg-slate-200">
                    <i data-lucide="chevron-right" class="w-6 h-6"></i>
                </button>
            </header>
            <div class="p-6">
                <h1 class="text-2xl font-bold mb-2 text-slate-900">أهلاً بك مشجعنا</h1>
                <p class="text-slate-500 mb-8 text-sm">سجل دخولك أو أنشئ حساباً جديداً لتبقى على اطلاع بأخبار النادي.</p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1 text-slate-700">الاسم الكريم</label>
                        <input type="text" id="fan-name" class="w-full h-12 border border-slate-300 rounded-lg px-3 bg-white" placeholder="مثال: صالح محمد">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1 text-slate-700">رقم الهاتف أو البريد</label>
                        <input type="text" id="fan-contact" dir="ltr" class="w-full h-12 border border-slate-300 rounded-lg px-3 text-left bg-white" placeholder="05xxxxxxxxx">
                    </div>
                    <button onclick="loginFan()" class="w-full h-12 bg-blue-600 text-white rounded-lg font-bold text-lg mt-4">دخول لحسابي</button>
                </div>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

window.renderPlayerLogin = function() {
    container.innerHTML = `
        <div class="flex-1 flex flex-col bg-slate-50">
            <header class="p-4">
                <button onclick="renderLanding()" class="p-2 rounded-full hover:bg-slate-200">
                    <i data-lucide="chevron-right" class="w-6 h-6"></i>
                </button>
            </header>
            <div class="p-6">
                <div class="flex flex-col items-center mb-8">
                    <div class="bg-blue-100 p-4 rounded-full mb-4">
                        <i data-lucide="scan-line" class="w-10 h-10 text-blue-600"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-slate-900">دخول اللاعبين</h1>
                    <p class="text-slate-500 text-sm mt-2 text-center">أدخل الكود الخاص بك الذي تم تزويدك به من قبل الإدارة</p>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <input type="text" id="player-code" dir="ltr" class="w-full h-14 bg-white border border-slate-300 rounded-lg px-3 text-center text-xl tracking-widest uppercase font-mono" placeholder="P-XXXX">
                    </div>
                    <button onclick="loginPlayer()" class="w-full h-12 bg-blue-600 text-white rounded-lg font-bold text-lg mt-2">دخول</button>
                </div>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

window.renderLanding = renderLanding;

window.loginFan = async function() {
    const name = document.getElementById('fan-name').value;
    const contact = document.getElementById('fan-contact').value;
    if(!name || !contact) return alert('الرجاء إدخال البيانات المطلوبة');
    
    const exists = localDB.fans.find(f => f.contact === contact);
    if (!exists) {
        try {
            const docRef = await addDoc(collection(db, "fans"), { name, contact });
            currentUser = { role: 'fan', info: { id: docRef.id, name, contact } };
        } catch (e) {
            console.error("Error adding fan: ", e);
            alert("حدث خطأ في التسجيل.");
            return;
        }
    } else {
        currentUser = { role: 'fan', info: exists };
    }
    
    currentTab = 'news';
    render();
}

window.loginPlayer = function() {
    const code = document.getElementById('player-code').value.trim();
    if(!code) return alert('الرجاء إدخال الكود');
    
    const player = localDB.players.find(p => String(p.code).toLowerCase() === code.toLowerCase());
    
    if (player) {
        currentUser = { role: 'player', info: player };
        currentTab = 'profile';
        render();
    } else {
        alert('كود الدخول غير صحيح، تأكد من الإدارة.');
    }
}

window.logout = function() {
    currentUser = null;
    render();
}

function renderFanApp() {
    container.innerHTML = `
        <header class="flex flex-col py-3 min-h-[5rem] items-center justify-center border-b border-slate-200 bg-white px-4 sticky top-0 z-10 w-full relative">
            <img src="./icon-512.png" alt="شعار نادي الرجاء العراقي" class="w-12 h-12 object-cover rounded-full shadow-sm mb-1 border border-slate-100" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgOGgudDAxIi8+PHBhdGggZD0iTTEyIDEyYTIgMiAwIDAgMSAyejEiLz48L3N2Zz4='">
            <h1 class="text-lg font-bold text-slate-900 leading-none mt-1">نادي الرجاء العراقي</h1>
            <button onclick="logout()" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 bg-slate-100 rounded-full transition-colors">
                <i data-lucide="log-out" class="w-5 h-5"></i>
            </button>
        </header>
        <main class="flex-1 p-4 bg-slate-50 overflow-y-auto pb-24">
            ${getTabContent(currentTab, 'fan')}
        </main>
        <nav class="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 h-16 flex items-center justify-around z-20 pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            <button onclick="switchTab('news')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'news' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="home" class="w-6 h-6 ${currentTab === 'news' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">الأخبار</span>
            </button>
            <button onclick="switchTab('matches')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'matches' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="calendar" class="w-6 h-6 ${currentTab === 'matches' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">المباريات</span>
            </button>
            <button onclick="switchTab('players')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'players' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="users" class="w-6 h-6 ${currentTab === 'players' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">الفريق</span>
            </button>
        </nav>
    `;
    if (window.lucide) window.lucide.createIcons();
}

function renderPlayerApp() {
    container.innerHTML = `
        <header class="flex flex-col py-3 min-h-[5rem] items-center justify-center border-b border-slate-200 bg-white px-4 sticky top-0 z-10 w-full relative">
            <img src="./icon-512.png" alt="شعار نادي الرجاء العراقي" class="w-12 h-12 object-cover rounded-full shadow-sm mb-1 border border-slate-100" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgOGgudDAxIi8+PHBhdGggZD0iTTEyIDEyYTIgMiAwIDAgMSAyejEiLz48L3N2Zz4='">
            <h1 class="text-lg font-bold text-blue-900 leading-none mt-1">نادي الرجاء العراقي</h1>
            <button onclick="logout()" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 bg-slate-100 rounded-full transition-colors">
                <i data-lucide="log-out" class="w-5 h-5"></i>
            </button>
        </header>
        <main class="flex-1 p-4 bg-slate-50 overflow-y-auto pb-24">
            ${getTabContent(currentTab, 'player')}
        </main>
        <nav class="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 h-16 flex items-center justify-around z-20 pb-safe shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            <button onclick="switchTab('profile')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'profile' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="user" class="w-6 h-6 ${currentTab === 'profile' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">ملفي</span>
            </button>
            <button onclick="switchTab('news')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'news' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="home" class="w-6 h-6 ${currentTab === 'news' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">الأخبار</span>
            </button>
            <button onclick="switchTab('matches')" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${currentTab === 'matches' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}">
                <i data-lucide="calendar" class="w-6 h-6 ${currentTab === 'matches' ? 'fill-blue-100' : ''}"></i>
                <span class="text-[10px] font-medium">المباريات</span>
            </button>
        </nav>
    `;
    if (window.lucide) window.lucide.createIcons();
}

window.switchTab = function(tab) {
    currentTab = tab;
    render();
}

function getTabContent(tab, role) {
    if (tab === 'news') {
        if(localDB.news.length === 0) return `<div class="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-300">لا توجد أخبار حالياً</div>`;
        return `<div class="space-y-4">
            <h2 class="font-bold text-xl mb-4 text-slate-800">أحدث الأخبار</h2>
            ${localDB.news.sort((a,b) => new Date(b.date) - new Date(a.date)).map(n => `
                <article class="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                    <span class="text-xs font-medium text-blue-600 mb-2 block">${new Date(n.date).toLocaleDateString('ar-SA')}</span>
                    <h3 class="font-bold text-lg mb-2 text-slate-900">${n.title}</h3>
                    <p class="text-sm text-slate-600 leading-relaxed">${n.content}</p>
                </article>
            `).join('')}
        </div>`;
    }
    
    if (tab === 'matches') {
        if(localDB.matches.length === 0) return `<div class="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-300">لا توجد مباريات حالياً</div>`;
        return `<div class="space-y-4">
            <h2 class="font-bold text-xl mb-4 text-slate-800">المباريات</h2>
            ${localDB.matches.map(m => {
                let statusClass = 'bg-blue-100 text-blue-700';
                let statusText = 'قادمة';
                if(m.status === 'live') { statusClass = 'bg-red-100 text-red-700 animate-pulse'; statusText = 'مباشر'; }
                if(m.status === 'finished') { statusClass = 'bg-slate-100 text-slate-700'; statusText = 'انتهت'; }
                
                return `
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center">
                    <span class="${statusClass} px-3 py-1 rounded-full text-xs font-medium mb-4">${statusText}</span>
                    <div class="flex items-center justify-between w-full">
                        <div class="flex-1 flex flex-col items-center gap-2 text-center">
                            <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                <i data-lucide="shield" class="w-8 h-8 text-blue-600"></i>
                            </div>
                            <span class="font-bold text-sm text-slate-900">${m.teamA}</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center px-4">
                            ${m.status === 'upcoming' 
                                ? `<span class="text-xl font-bold text-slate-400">VS</span>`
                                : `<span class="text-3xl font-black tracking-widest text-slate-900">${m.scoreA || 0} - ${m.scoreB || 0}</span>`
                            }
                            <span class="text-xs text-slate-500 mt-2 whitespace-nowrap">${new Date(m.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 text-center">
                            <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                <i data-lucide="shield" class="w-8 h-8 text-slate-400"></i>
                            </div>
                            <span class="font-bold text-sm text-slate-900">${m.teamB}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </div>`;
    }
    
    if (tab === 'players') {
        if(localDB.players.length === 0) return `<div class="p-8 text-center text-slate-500 border border-dashed rounded-xl border-slate-300">لا يوجد لاعبين حالياً</div>`;
        return `<div class="space-y-4">
            <h2 class="font-bold text-xl mb-4 text-slate-800">قائمة اللاعبين</h2>
            <div class="grid grid-cols-2 gap-4">
            ${localDB.players.map(p => `
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center text-center">
                    <div class="w-20 h-20 rounded-full bg-slate-100 mb-3 relative flex items-center justify-center shadow-inner overflow-hidden border border-slate-200">
                        ${p.photo ? `<img src="${p.photo}" class="w-full h-full object-cover rounded-full" />` : `<i data-lucide="user" class="w-10 h-10 text-slate-300"></i>`}
                        ${p.status === 'أساسي' ? `<div class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>` : ''}
                        ${p.status === 'مصاب' ? `<div class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-red-500"></div>` : ''}
                    </div>
                    <h3 class="font-bold text-sm text-slate-900">${p.name}</h3>
                    <p class="text-xs text-slate-500 mt-1">${p.position}</p>
                </div>
            `).join('')}
            </div>
        </div>`;
    }
    
    if (tab === 'profile' && role === 'player') {
        const p = currentUser.info;
        const freshPlayer = localDB.players.find(x => x.id === p.id) || p;
        
        return `<div class="space-y-6">
            <div class="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                <div class="h-24 bg-gradient-to-r from-blue-700 to-blue-500"></div>
                <div class="px-6 pb-6 pt-0 flex flex-col items-center">
                    <div class="-mt-12 mb-4 h-24 w-24 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center overflow-hidden">
                        ${freshPlayer.photo ? `<img src="${freshPlayer.photo}" class="w-full h-full object-cover rounded-full"/>` : `<i data-lucide="user" class="w-12 h-12 text-slate-300"></i>`}
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">${freshPlayer.name}</h2>
                    <span class="mt-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        ${freshPlayer.position}
                    </span>
                </div>
            </div>

            <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 class="font-bold text-slate-800 border-b border-slate-100 pb-2">المعلومات الشخصية</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="block text-xs text-slate-500">العمر</span>
                        <span class="block font-medium text-slate-900">${freshPlayer.age} سنة</span>
                    </div>
                    <div>
                        <span class="block text-xs text-slate-500">الحالة في النادي</span>
                        <span class="block font-medium text-slate-900">${freshPlayer.status}</span>
                    </div>
                    <div class="col-span-2">
                        <span class="block text-xs text-slate-500">رقم الكود (للاحتفاظ به)</span>
                        <span class="block font-medium text-slate-900 tracking-widest text-lg bg-slate-50 p-2 rounded text-center mt-1 border border-slate-100 font-mono" dir="ltr">${freshPlayer.code}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    return '';
}

render();
