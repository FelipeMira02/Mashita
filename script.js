const audio = document.querySelector("#audio");
const playButton = document.querySelector("#play-button");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");

const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const firstDay = new Date(2026, 0, 1);
const daysSinceFirstDay = Math.floor((startOfToday - firstDay) / 86400000);

const dailyNotes = [
  "Ouvi essa e lembrei de você. Espero que goste, mashita.",
  "A música de hoje é essa. Coloquei porque achei muito a sua cara.",
  "Só passando para deixar uma música e dizer que estou com saudade.",
  "Essa me fez pensar em nós dois, então precisava colocar aqui.",
  "Espero que seu dia esteja sendo bom. Se não estiver, escuta essa comigo.",
  "Mais uma para a nossa playlist. Depois me conta se você gostou.",
  "Escolhi essa para você ouvir hoje. Te amo, Tete.",
  "Essa é boa demais e eu queria dividir ela com você.",
  "Hoje eu só queria estar aí com você ouvindo música sem fazer nada.",
  "Uma música para você lembrar de mim durante o dia.",
  "Não tinha como ouvir essa sem pensar em você.",
  "A de hoje foi escolhida com carinho. Espero que deixe seu dia melhor.",
  "Essa entrou aqui porque me deu vontade de mandar para você na hora.",
  "Talvez você já conheça, mas agora ela também faz parte da nossa playlist.",
  "Para a minha mashita favorita: mais uma música e mais um eu te amo.",
  "Se eu estivesse aí, colocaria essa para a gente ouvir junto.",
  "Só um lembrete rápido: eu penso em você mais do que você imagina.",
  "A música muda todo dia, mas a pessoa em quem eu penso continua a mesma.",
  "Essa é de Fefe para Tete. Sem textão hoje, só saudade mesmo.",
  "Volta amanhã. Vou continuar escolhendo músicas para você.",
];

function noteForDay(index) {
  return dailyNotes[index % dailyNotes.length];
}

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

async function loadSong() {
  try {
    const response = await fetch("songs.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
    const songs = await response.json();
    const index = ((daysSinceFirstDay % songs.length) + songs.length) % songs.length;
    const song = songs[index];

    document.querySelector("#song-title").textContent = song.title;
    document.querySelector("#artist").textContent = song.artist;
    document.querySelector("#note").textContent = `“${noteForDay(index)}”`;
    audio.src = song.file;
  } catch (error) {
    document.querySelector("#song-title").textContent = "A música está descansando";
    document.querySelector("#artist").textContent = "Tente novamente em instantes";
    document.querySelector("#note").textContent = "“Não consegui carregar a faixa de hoje.”";
    playButton.disabled = true;
    console.error(error);
  }
}

playButton.addEventListener("click", async () => {
  if (audio.paused) await audio.play();
  else audio.pause();
});

audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  playButton.setAttribute("aria-label", "Pausar música");
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Tocar música");
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});

audio.addEventListener("ended", () => {
  progress.value = 0;
  audio.currentTime = 0;
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

document.querySelector("#today").textContent = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "long", year: "numeric",
}).format(now).toUpperCase();

loadSong();
