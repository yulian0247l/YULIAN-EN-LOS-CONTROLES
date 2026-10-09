/*
  CONFIGURACIÓN RÁPIDA
  1) Cambia whatsappNumber por tu número con código de país, sin + ni espacios.
     Ejemplo República Dominicana: 18095551234
  2) Cambia producerName y los datos de cada beat.
  3) Coloca los MP3 dentro de assets/beats/ y las portadas dentro de assets/covers/.
  4) Puedes reemplazar el logo añadiendo assets/logo.png.
*/
const CONFIG = {
  producerName: "YULIAN EN LOS CONTROLES",
  whatsappNumber: "18294560598", // REEMPLAZA este número por el tuyo
  currency: "USD"
};

// Añade o modifica tus instrumentales aquí.
// audio: ruta relativa al archivo MP3. cover: ruta relativa a la portada.
const beats = [
  {
    id: 1,
    title: "Detroit Mayores",
    genre: "Detroit",
    bpm: 100,
    price: "Consultar precio",
    audio: "assets/beats/DETROIT TYPE BEAT MAYORES.mp3",
    cover: "assets/logo2.png",
    tag: "MELODICO"
  },
  {
    id: 2,
    title: "Detroit Lownny",
    genre: "Detroit",
    bpm: 100,

    price: "Consultar precio",
    audio: "assets/beats/LOWNY.mp3",
    cover: "assets/logo2.png",
    tag: "SENTIMIENTO"
  },
  {
    id: 3,
    title: "Rap Estilo KURRU",
    genre: "Rap",
    bpm: 97,

    price: "Consultar precio",
    audio: "assets/beats/RAP ESTILO KIRY KURU.mp3",
    cover: "assets/logo2.png",
    tag: "CLANDESTINO"
  }
];

const beatGrid = document.getElementById("beatGrid");
const toast = document.getElementById("toast");
let currentAudio = null;
let toastTimer = null;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

/**
 * Convierte enlaces habituales de Google Drive en enlaces de acceso directo.
 * Acepta enlaces como drive.google.com/file/d/ID/view o open?id=ID.
 * Nota: Google Drive puede limitar la reproducción directa de algunos archivos;
 * si sucede, aloja el MP3 en un servicio de audio/hosting que permita streaming.
 */
function resolveDriveUrl(value, type = "audio") {
  if (!value || typeof value !== "string") return value;
  try {
    const url = new URL(value);
    if (!/(^|\.)drive\.google\.com$/i.test(url.hostname)) return value;

    let fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      || url.searchParams.get("id");
    if (!fileId) return value;

    const exportType = type === "image" ? "view" : "download";
    return `https://drive.google.com/uc?export=${exportType}&id=${encodeURIComponent(fileId)}`;
  } catch {
    return value;
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function whatsappURL(message) {
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderBeats(filter = "all") {
  const visibleBeats = filter === "all" ? beats : beats.filter(beat => beat.genre === filter);

  if (!visibleBeats.length) {
    beatGrid.innerHTML = '<div class="empty-state">No hay beats en esta categoría todavía.</div>';
    return;
  }

  beatGrid.innerHTML = visibleBeats.map(beat => `
    <article class="beat-card" data-beat-id="${beat.id}">
      <div class="cover-wrap">
        <img class="cover-art" src="${escapeHTML(resolveDriveUrl(beat.cover, "image"))}" alt="Portada de ${escapeHTML(beat.title)}"
             loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
        <div class="cover-placeholder" style="display:none" aria-hidden="true">${escapeHTML(beat.genre.slice(0, 3).toUpperCase())}<span>.</span></div>
        <span class="cover-tag">${escapeHTML(beat.tag)}</span>
      </div>
      <div class="beat-details">
        <div class="beat-meta"><span class="genre-label">${escapeHTML(beat.genre)}</span><span>BEAT / ${String(beat.id).padStart(3, "0")}</span></div>
        <h3 class="beat-title">${escapeHTML(beat.title)}</h3>
        <p class="beat-specs">${escapeHTML(beat.bpm)} BPM &nbsp;·&nbsp; ${escapeHTML(beat.key)}</p>
        <div class="audio-player">
          <div class="audio-controls">
            <button class="play-button" type="button" data-play="${beat.id}" aria-label="Reproducir ${escapeHTML(beat.title)}">▶</button>
            <div class="audio-track">
              <input class="audio-progress" type="range" min="0" max="1000" value="0" step="1" data-progress="${beat.id}" aria-label="Posición de ${escapeHTML(beat.title)}">
              <div class="audio-times"><span data-current="${beat.id}">0:00</span><span data-duration="${beat.id}">0:00</span></div>
            </div>
            <span class="audio-volume" aria-hidden="true">♫</span>
          </div>
          <audio preload="metadata" data-audio="${beat.id}" src="${escapeHTML(resolveDriveUrl(beat.audio, "audio"))}"></audio>
        </div>
        <button class="beat-buy" type="button" data-buy="${beat.id}"><span>CONSULTAR BEAT</span><span>↗</span></button>
      </div>
    </article>
  `).join("");

  visibleBeats.forEach(beat => {
    const audio = beatGrid.querySelector(`[data-audio="${beat.id}"]`);
    const progress = beatGrid.querySelector(`[data-progress="${beat.id}"]`);
    const playButton = beatGrid.querySelector(`[data-play="${beat.id}"]`);
    const current = beatGrid.querySelector(`[data-current="${beat.id}"]`);
    const duration = beatGrid.querySelector(`[data-duration="${beat.id}"]`);

    audio.addEventListener("loadedmetadata", () => {
      duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      current.textContent = formatTime(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
      }
    });

    audio.addEventListener("play", () => { playButton.textContent = "Ⅱ"; });
    audio.addEventListener("pause", () => { playButton.textContent = "▶"; });
    audio.addEventListener("ended", () => { playButton.textContent = "▶"; progress.value = "0"; });

    audio.addEventListener("error", () => {
      showToast(`No se pudo cargar “${beat.title}”. Revisa el enlace de Drive y que esté compartido como “Cualquier persona con el enlace”.`);
    }, { once: true });

    playButton.addEventListener("click", async () => {
      if (audio.paused) {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        try {
          await audio.play();
        } catch {
          showToast("No se pudo reproducir. Revisa el permiso del enlace de Drive; algunos enlaces de Drive no permiten streaming directo.");
        }
      } else {
        audio.pause();
      }
    });

    progress.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
      }
    });

    beatGrid.querySelector(`[data-buy="${beat.id}"]`).addEventListener("click", () => {
      const message = `Hola, quiero información para comprar el beat "${beat.title}" (${beat.genre}, ${beat.bpm} BPM, ${beat.key}). ¿Qué licencias y precios tienes disponibles?`;
      window.open(whatsappURL(message), "_blank", "noopener,noreferrer");
    });
  });
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
    renderBeats(button.dataset.filter);
  });
});

document.querySelectorAll("[data-style-link]").forEach(link => {
  link.addEventListener("click", () => {
    const genre = link.dataset.styleLink;
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("active", button.dataset.filter === genre);
    });
    renderBeats(genre);
  });
});

const generalMessage = `Hola, quiero información sobre tus beats y producciones personalizadas.`;
document.getElementById("contactWhatsapp").href = whatsappURL(generalMessage);
document.getElementById("productionWhatsapp").href = whatsappURL("Hola, quiero consultar una producción musical personalizada. ¿Podemos hablar de mi idea y los precios?");
document.getElementById("currentYear").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}));

renderBeats();
