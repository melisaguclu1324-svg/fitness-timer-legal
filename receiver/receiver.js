const NAMESPACE = 'urn:x-cast:com.fonksiyonelfitness.wodtimer';

const context = cast.framework.CastReceiverContext.getInstance();

context.addCustomMessageListener(NAMESPACE, (event) => {
  const data = event.data;
  switch (data.action) {
    case 'start':  handleStart(data);    break;
    case 'tick':   handleTick(data);     break;
    case 'pause':  handlePause(data);    break;
    case 'resume': handleResume(data);   break;
    case 'complete': handleComplete(data); break;
  }
});

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updatePhaseColor(phase) {
  const label = document.getElementById('phase-label');
  const fill = document.getElementById('progress-fill');
  
  label.className = '';
  if (phase === 'PREPARE') { label.classList.add('phase-prepare'); fill.style.backgroundColor = '#457B9D'; }
  else if (phase === 'WORK') { label.classList.add('phase-work'); fill.style.backgroundColor = '#E63946'; }
  else if (phase === 'REST') { label.classList.add('phase-rest'); fill.style.backgroundColor = '#2A9D8F'; }
  else if (phase === 'COOLDOWN') { label.classList.add('phase-cooldown'); fill.style.backgroundColor = '#9D4EDD'; }
}

function translatePhase(phase) {
  if (phase === 'PREPARE') return 'HAZIRLIK';
  if (phase === 'WORK') return 'ÇALIŞMA';
  if (phase === 'REST') return 'DİNLENME';
  if (phase === 'COOLDOWN') return 'SOĞUMA';
  return phase;
}

function handleStart(data) {
  document.getElementById('mode-name').textContent = data.modeName;
}

function handleTick(data) {
  document.getElementById('remaining-time').textContent = formatTime(data.remainingSeconds);
  document.getElementById('round-info').textContent = `TUR ${data.currentRound} / ${data.totalRounds}`;
  document.getElementById('phase-label').textContent = translatePhase(data.phase);
  document.getElementById('mode-name').textContent = data.modeName;
  
  updatePhaseColor(data.phase);
  
  const progress = data.totalSeconds > 0 ? 1 - (data.remainingSeconds / data.totalSeconds) : 1;
  document.getElementById('progress-fill').style.width = `${progress * 100}%`;
}

function handlePause(data) {
  document.getElementById('phase-label').textContent = 'DURAKLATILDI';
  document.getElementById('phase-label').className = '';
}

function handleResume(data) {
  // Tick handler will correct the phase name shortly after resume.
}

function handleComplete(data) {
  document.getElementById('phase-label').textContent = 'TAMAMLANDI';
  document.getElementById('phase-label').className = '';
  document.getElementById('remaining-time').textContent = '0:00';
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('progress-fill').style.backgroundColor = '#2A9D8F';
}

// Disable idle timeout for fitness timer (we don't want it closing on pause)
context.start({ disableIdleTimeout: true });
