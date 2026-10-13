const app = document.getElementById('app');
const state = { stack: [], sheet: null, alert: null, toast: null, tab: 'practice', permissions: { camera: false, mic: false }, banner: true, tool: 0, bpm: 96, metronome: false, beat: 0, live: { ready: 0, strummed: false, nice: false, chord: 'G' }, previewChord: null, timer: null };
const screens = {};
const icon = name => `<span class="icon" aria-hidden="true">${sym(name)}</span>`;
const button = (label, action, cls = 'btn') => `<button class="${cls} tap" data-action="${action}">${label}</button>`;

function render() {
  const current = state.stack.at(-1) || 'start';
  app.innerHTML = screens[current]();
  if (state.sheet === 'profile') app.insertAdjacentHTML('beforeend', screens.profile());
  else if (state.sheet) app.insertAdjacentHTML('beforeend', renderSheet());
  if (state.previewChord) app.insertAdjacentHTML('beforeend', renderPreviewSheet());
  if (state.alert) app.insertAdjacentHTML('beforeend', renderAlert());
  if (state.toast) app.insertAdjacentHTML('beforeend', `<div class="toast">${state.toast}</div>`);
  bind();
}

function push(name) { state.stack.push(name); render(); }
function pop() { if (state.stack.length > 1) { state.stack.pop(); render(); } }
function presentSheet(type) { state.sheet = type; render(); }
function dismissSheet() { state.sheet = null; render(); }
function showAlert(title, message, actions = [{ label: 'OK', action: 'dismiss-alert' }]) { state.alert = { title, message, actions }; render(); }
function showActionSheet() { presentSheet('actions'); }
function toast(message) { state.toast = message; render(); setTimeout(() => { state.toast = null; render(); }, 2000); }
function tabs(active) { return `<nav class="tabbar"><button class="tab ${active === 'dashboard' ? 'on' : ''}" data-action="tab-dashboard">${icon('square.grid.2x2.fill')}<span>Dashboard</span></button><button class="tab ${active === 'practice' ? 'on' : ''}" data-action="tab-practice">${icon('guitars.fill')}<span>Practice</span></button><button class="tab ${active === 'tools' ? 'on' : ''}" data-action="tab-tools">${icon('metronome.fill')}<span>Tools</span></button></nav>`; }
function nav(title, back = true) { return `<div class="nav">${back ? `<button class="nav-back" data-action="back">${icon('chevron.left')}</button>` : '<span></span>'}<span class="title-2">${title}</span><span></span></div>`; }

screens.start = () => `<section class="view center"><div style="margin-top:108px"><div class="logo" style="margin:auto">${icon('questionmark')}</div><h1 class="large-title" style="margin-top:24px">Guitar One</h1><p class="body">Your AI guitar tutor for beginners.</p><p class="subhead secondary">Learn chords, build confidence, and make music.</p></div><div class="bottom-action">${button('Get Started', 'start-permissions')}</div></section>`;
screens.permissions = () => `<section class="view"><h1 class="large-title">Allow Access</h1><div class="group"><div class="group-row"><div class="row"><div class="icon-box">${icon('camera.fill')}</div><div><strong class="body">Camera</strong><div class="footnote secondary">To see your guitar and hands</div></div></div>${state.permissions.camera ? icon('checkmark.circle.fill') : icon('chevron.right')}</div><div class="group-row"><div class="row"><div class="icon-box">${icon('mic.fill')}</div><div><strong class="body">Microphone</strong><div class="footnote secondary">To hear your chords</div></div></div>${state.permissions.mic ? icon('checkmark.circle.fill') : icon('chevron.right')}</div></div><div class="card secondary" style="margin-top:16px">${icon('lock.fill')} Everything from your camera and microphone stays on your device. Nothing is used by us.</div><div class="bottom-action">${button('Continue', 'request-permissions')}</div></section>`;
screens.blocked = () => `<section class="view blocked"><div><div class="icon">${icon('lock.fill')}</div><h1 class="title-2">Access Needed</h1><p class="body secondary">Camera and microphone access are needed to check your guitar and hear your chords.</p>${button('Open Settings', 'settings')}<div style="height:10px"></div>${button('Try Again', 'try-again', 'btn secondary-btn')}</div></section>`;
screens.practice = () => `<section class="view practice-view"><h1 class="large-title">Practice</h1>${state.banner ? `<div class="card banner"><div class="icon-box">${icon('tuningfork')}</div><div><strong class="body">Tune guitar?</strong><div class="footnote secondary">Get in tune before you start</div></div><div style="margin-left:auto;display:flex;align-items:center;justify-content:flex-end;gap:4px"><button class="nav-back" data-action="dismiss-banner">${icon('xmark')}</button><button class="nav-back" data-action="open-tuner">${icon('chevron.right')}</button></div></div>` : ''}<h2 class="subhead" style="margin:0 0 10px">Choose a chord</h2><div class="chord-grid">${['C','D','G','Em'].map(chord => `<div class="card chord-card tap" data-action="preview-${chord}"><div class="chord-name">${chord}</div><div class="diagram"></div><span class="caption secondary">Practice chord</span></div>`).join('')}</div></section>${tabs('practice')}`;
screens.dashboard = () => `<section class="view practice-view"><div class="nav" style="margin-bottom:6px"><div class="row"><div class="logo" style="width:38px;height:38px;border-radius:12px;font-size:23px">?</div><strong class="body">Guitar One</strong></div><button class="icon-button" data-action="profile">${icon('person.crop.circle')}</button></div><div class="row spread" style="margin:19px 0 12px"><h2 class="title-2" style="margin:0">Lessons</h2><button class="nav-back accent" data-action="all-lessons">See All</button></div><div class="lesson-carousel"><div class="card lesson-card"><div class="lesson-art">YOUR FIRST CHORD</div><div class="row spread"><div><strong class="body">Your First Chord</strong><div class="footnote secondary">Lesson 2 of 6</div></div><button class="tiny-btn" data-action="lesson-player">Continue</button></div><div class="progress" style="margin-top:13px"><i style="width:35%"></i></div></div><div class="card lesson-card"><div class="lesson-art">STRUMMING</div><strong class="body">Strumming Basics</strong><div class="footnote secondary">Not started</div></div></div><h2 class="title-2" style="margin:24px 0 12px">Progress</h2><div class="card row tap" data-action="completed-lessons"><div class="ring"><strong>40%</strong></div><div><strong class="body">Lessons completed</strong><div class="footnote secondary">You are building a habit</div></div></div><div class="card row spread tap" data-action="preview-G" style="margin-top:12px"><div><div class="footnote secondary">Continue practice</div><strong class="body">Chord G</strong></div><span class="accent">${icon('play.fill')}</span></div></section>${tabs('dashboard')}`;
screens.tools = () => `<section class="view tools-view"><h1 class="large-title">Tools</h1><div class="segmented"><button class="${state.tool === 0 ? 'on' : ''}" data-action="tool-tuner">${icon('tuningfork')} Tuner</button><button class="${state.tool === 1 ? 'on' : ''}" data-action="tool-metronome">${icon('metronome.fill')} Metronome</button></div>${state.tool === 0 ? `<div class="tool-page"><div class="tuner-note">E</div><div class="center secondary">String 6 · 82.4 Hz</div><div class="needle" style="--tilt:${Math.sin(Date.now() / 800) * 8}deg"></div><div class="center" style="color:#30d158;font-weight:700">${Math.abs(Math.sin(Date.now() / 800)) < .4 ? 'In tune' : 'Listening...'}</div><p class="center footnote secondary">Tap the tuner to simulate a note</p></div>` : `<div class="tool-page"><div class="metronome-number">${state.bpm}</div><div class="center secondary">BPM</div><input class="range" type="range" min="40" max="180" value="${state.bpm}" data-action="bpm"><div class="row" style="justify-content:center;margin-top:18px"><button class="icon-button" data-action="bpm-minus">${icon('minus.circle')}</button><span class="secondary">Tempo</span><button class="icon-button" data-action="bpm-plus">${icon('plus.circle')}</button></div><div class="beat-row">${[0,1,2,3].map(i => `<span class="beat ${state.beat === i ? 'on' : ''}"></span>`).join('')}</div><button class="play-button" data-action="toggle-metronome">${icon(state.metronome ? 'pause.fill' : 'play.fill')}</button></div>`}</section>${tabs('tools')}`;
screens.live = () => `<section class="live"><div class="live-overlay"><div class="live-top"><button class="icon-button light" data-action="back">${icon('xmark')}</button><div class="chord-pill">Chord ${state.live.chord}</div><div class="live-actions"><button class="icon-button light" data-action="preview-live">${icon('questionmark')}</button><div class="accuracy-display"><strong>${state.live.strummed ? '86%' : state.live.ready >= 3 ? '72%' : '--'}</strong><span>Audio accuracy</span></div></div></div><div class="camera-frame"><div class="camera-preview"><div class="camera-label">Camera preview</div><div class="score-checks">1✓  3✓</div></div></div><div class="live-feedback" data-action="nice"><div><strong>${state.live.ready >= 1 ? 'Guitar detected' : 'Point the camera at your guitar'}</strong><span>${state.live.ready >= 2 ? 'Fretboard aligned' : 'Looking for your fretboard'}</span></div><div><strong>${state.live.nice ? 'Nice! Chord looks great.' : state.live.ready >= 3 ? 'Move your 2nd finger to the 3rd fret' : 'Listening for your chord'}</strong><span>${state.live.strummed ? 'Strum detected' : 'Waiting for a clear strum'}</span></div></div></div>${tabs('practice')}</section>`;
screens.allLessons = () => `<section class="view practice-view">${nav('All Lessons')}<h1 class="large-title">All Lessons</h1><div class="lessons-list"><div class="group">${['Your First Chord','Strumming Basics','Switching Chords','Play Your First Song'].map((x,i) => `<div class="group-row lesson-list-row" data-action="lesson-player"><div><strong class="body">${x}</strong><div class="footnote secondary">${i < 2 ? 'In progress' : 'Up next'}</div></div>${icon('chevron.right')}</div>`).join('')}</div></div></section>${tabs('dashboard')}`;
screens.lessonPlayer = () => `<section class="view lesson-player-view">${nav('Lesson 2 of 6')}<div class="video" aria-label="Lesson video placeholder"><div class="video-play">${icon('play.fill')}</div></div><h1 class="title-2">Your First Chord</h1><p class="body secondary">Build your first shape and learn how each finger sits on the fretboard.</p>${button('Mark as Complete', 'complete-lesson')}<div style="height:10px"></div>${button('Practice Chord G', 'live-G', 'btn secondary-btn')}</section>${tabs('dashboard')}`;
screens.progress = () => `<section class="view progress-screen">${nav('Progress')}<h1 class="large-title">Your Progress</h1><div class="card progress-summary"><div class="ring large"><strong>40%</strong></div><div><strong class="body">Lesson completion</strong><div class="footnote secondary">2 of 6 lessons in progress</div></div></div><h2 class="subhead progress-heading">Practice time</h2><div class="group chord-time-list"><div class="group-row"><span><strong class="body">Chord C</strong><small class="footnote secondary">Most practiced this week</small></span><strong class="body">12 min</strong></div><div class="group-row"><span><strong class="body">Chord D</strong><small class="footnote secondary">Building consistency</small></span><strong class="body">8 min</strong></div><div class="group-row"><span><strong class="body">Chord G</strong><small class="footnote secondary">Your current focus</small></span><strong class="body">24 min</strong></div><div class="group-row"><span><strong class="body">Chord Em</strong><small class="footnote secondary">Ready for more practice</small></span><strong class="body">5 min</strong></div></div></section>${tabs('dashboard')}`;
screens.profile = () => `<div class="sheet-backdrop" data-action="dismiss-profile"></div><div class="sheet"><div class="grabber"></div><div class="row spread"><button class="nav-back accent" data-action="dismiss-profile">Done</button><h2>Profile</h2><span style="width:44px"></span></div><div class="center" style="margin:7px 0 18px"><div class="logo" style="width:70px;height:70px;margin:auto;border-radius:50%;font-size:32px">?</div><strong class="body">Name</strong></div><div class="group"><div class="group-row" data-action="name"><span class="body">Name</span>${icon('chevron.right')}</div><div class="group-row" data-action="preferences"><span class="body">Preferences</span>${icon('chevron.right')}</div><div class="group-row" data-action="reset-progress"><span class="body" style="color:#ff453a">Reset Progress</span>${icon('chevron.right')}</div><div class="group-row" data-action="about"><span class="body">About and Privacy</span>${icon('chevron.right')}</div></div></div>`;

function renderSheet() { if (state.sheet === 'actions') { const chord = state.live.chord || 'G'; return `<div class="sheet-backdrop" data-action="dismiss-sheet"></div><div class="sheet"><div class="grabber"></div><h2>Chord ${chord}</h2><div class="group"><div class="group-row" data-action="change-chord">Change chord ${icon('chevron.right')}</div><div class="group-row" data-action="show-diagram">Show chord diagram ${icon('chevron.right')}</div></div>${button('Cancel', 'dismiss-sheet', 'btn secondary-btn')}</div>`; } return ''; }
function renderPreviewSheet() {
  if (!state.previewChord) return '';
  const chord = state.previewChord;
  return `<div class="preview-backdrop" data-action="dismiss-preview"></div><div class="preview-card"><div class="preview-header"><button class="preview-action close" data-action="dismiss-preview">Close</button><div class="preview-title">Chord ${chord}</div><button class="preview-action start" data-action="start-preview">Start</button></div><div class="preview-body"><div class="placeholder-svg" aria-label="${chord} chord placeholder"><div class="placeholder-grid"><span class="string"></span><span class="string"></span><span class="string"></span><span class="string"></span><span class="string"></span><span class="string"></span><span class="fret fret-1"></span><span class="fret fret-2"></span><span class="fret fret-3"></span><span class="fret fret-4"></span><span class="dot dot-1"></span><span class="dot dot-2"></span><span class="dot dot-3"></span><span class="dot dot-4"></span></div></div></div><div class="preview-caption">Finger placement placeholder</div></div>`;
}
function renderAlert() { return `<div class="alert-backdrop"></div><div class="alert"><div class="alert-copy"><h3>${state.alert.title}</h3><p>${state.alert.message}</p></div><div class="alert-actions">${state.alert.actions.map(a => `<button class="${a.danger ? 'danger' : ''}" data-action="${a.action}">${a.label}</button>`).join('')}</div></div>`; }
function requestPermission(kind) { const title = kind === 'camera' ? '“Guitar One” Would Like to Access the Camera' : '“Guitar One” Would Like to Access the Microphone'; const message = kind === 'camera' ? 'Guitar One uses the camera to check your finger placement.' : 'Guitar One uses the microphone to hear your chords.'; showAlert(title, message, [{ label: 'Don’t Allow', action: `deny-${kind}` }, { label: 'OK', action: `allow-${kind}` }]); }
function finishPermission(kind, allowed) { state.alert = null; if (allowed) { state.permissions[kind] = true; if (state.permissions.camera && state.permissions.mic) { state.stack = ['practice']; state.tab = 'practice'; } render(); } else { state.stack.push('blocked'); render(); } }
function bind() { app.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => act(el.dataset.action, el))); const range = app.querySelector('[data-action="bpm"]'); if (range) range.addEventListener('input', e => { state.bpm = Number(e.target.value); render(); }); }

function act(action, el) {
  if (action === 'start-permissions') return push('permissions');
  if (action === 'request-permissions') return requestPermission(state.permissions.camera ? 'mic' : 'camera');
  if (action.startsWith('allow-')) return finishPermission(action.slice(6), true);
  if (action.startsWith('deny-')) return finishPermission(action.slice(5), false);
  if (action === 'try-again') return push('permissions');
  if (action === 'settings') return toast('Opens iOS Settings in the real app');
  if (action === 'back') { if (state.stack.at(-1) === 'progress') { state.stack = ['dashboard']; return render(); } return pop(); }
  if (action === 'dismiss-banner') { state.banner = false; return render(); }
  if (action === 'open-tuner') { state.tool = 0; state.stack = ['tools']; return render(); }
  if (action === 'preview-live') {
    state.previewChord = state.live.chord;
    return render();
  }
  if (action.startsWith('preview-')) {
    state.previewChord = action.slice('preview-'.length);
    return render();
  }
  if (action === 'dismiss-preview') {
    state.previewChord = null;
    return render();
  }
  if (action === 'start-preview') {
    const chord = state.previewChord || 'G';
    state.previewChord = null;
    state.live = { ready: 0, strummed: false, nice: false, chord };
    push('live');
    startReadiness();
    return;
  }
  if (action.startsWith('live-')) {
    const chord = action.slice('live-'.length);
    state.live = { ready: 0, strummed: false, nice: false, chord };
    push('live');
    startReadiness();
    return;
  }
  if (action === 'tab-dashboard') { state.stack = ['dashboard']; return render(); }
  if (action === 'tab-practice') { state.stack = ['practice']; return render(); }
  if (action === 'tab-tools') { state.stack = ['tools']; return render(); }
  if (action === 'profile') { state.sheet = 'profile'; return render(); }
  if (action === 'dismiss-profile') { state.sheet = null; return render(); }
  if (action === 'all-lessons') return push('allLessons');
  if (action === 'completed-lessons') { state.stack = ['progress']; return render(); }
  if (action === 'lesson-player') return push('lessonPlayer');
  if (action === 'complete-lesson') return showAlert('Lesson complete', 'Nice work. Your progress has been updated.');
  if (action === 'live-actions') return showActionSheet();
  if (action === 'dismiss-sheet') return dismissSheet();
  if (action === 'change-chord') { dismissSheet(); return toast('Chord picker opens in the real app'); }
  if (action === 'show-diagram') { dismissSheet(); return toast('Chord diagram shown'); }
  if (action === 'nice') { state.live.nice = !state.live.nice; return render(); }
  if (action === 'strum') { state.live.strummed = true; return render(); }
  if (action === 'tool-tuner') { state.tool = 0; return render(); }
  if (action === 'tool-metronome') { state.tool = 1; return render(); }
  if (action === 'bpm-minus') { state.bpm = Math.max(40, state.bpm - 5); return render(); }
  if (action === 'bpm-plus') { state.bpm = Math.min(180, state.bpm + 5); return render(); }
  if (action === 'toggle-metronome') { state.metronome = !state.metronome; startMetronome(); return render(); }
  if (action === 'dismiss-alert') { state.alert = null; return render(); }
  if (action === 'reset-progress') return toast('Progress reset');
}

function startReadiness() { clearInterval(state.timer); state.timer = setInterval(() => { if (state.live.ready < 3) { state.live.ready++; render(); } else clearInterval(state.timer); }, 1100); }
function startMetronome() { clearInterval(state.timer); if (state.metronome) state.timer = setInterval(() => { state.beat = (state.beat + 1) % 4; render(); }, 60000 / state.bpm); }

document.addEventListener('keydown', e => { if (e.key === 'Escape') state.stack.length > 1 && pop(); });
document.getElementById('resetDemo').addEventListener('click', () => { clearInterval(state.timer); state.stack = ['start']; state.sheet = null; state.alert = null; state.previewChord = null; state.permissions = { camera: false, mic: false }; state.banner = true; render(); });
state.stack = ['start']; render();