const STREAMERS = [
    "Tatohaoe", "lorddekko", "nightclaim",
    "partyman96", "etherias_gaming", "ciruelitaruby",
    "nhn_forever"
];

async function mostrarStreamers() {
    try {
        const res = await fetch("https://aoe2-directo-production.up.railway.app/streams");
        const { streams, avatares } = await res.json();
        const listaNombresEnDirecto = streams.map(s => s.user_login.toLowerCase());

        const divDirecto = document.getElementById("lista-streams");
        divDirecto.innerHTML = "";

        if (streams.length === 0) {
            divDirecto.innerHTML = "<p>Nadie en directo ahora mismo.</p>";
        } else {
            streams.forEach(stream => {
                const thumb = stream.thumbnail_url
                    .replace("{width}", "320")
                    .replace("{height}", "180") + "?t=" + Date.now();

                divDirecto.innerHTML += `
                    <div class="tarjeta">
                        <a href="https://twitch.tv/${stream.user_login}" target="_blank">
                            <img src="${thumb}" alt="Stream de ${stream.user_name}">
                        </a>
                        <div class="info">
                            <div class="streamer-header">
                                <img class="avatar" src="${stream.avatar}" alt="${stream.user_name}">
                                <strong>${stream.user_name}</strong>
                            </div>
                            <p class="titulo">${stream.title}</p>
                            <span class="viewers">👁 ${stream.viewer_count.toLocaleString()} espectadores</span>
                            <a class="boton" href="https://twitch.tv/${stream.user_login}" target="_blank">▶ Ver stream</a>
                        </div>
                    </div>
                `;
            });
        }

        const divOffline = document.getElementById("lista-offline");
        divOffline.innerHTML = "";

        const offline = STREAMERS.filter(s => !listaNombresEnDirecto.includes(s.toLowerCase()));
        offline.forEach(nombre => {
            const avatar = avatares[nombre.toLowerCase()] || "";
            divOffline.innerHTML += `
                <div class="tarjeta offline">
                    <div class="info">
                        <div class="streamer-header">
                            <img class="avatar" src="${avatar}" alt="${nombre}">
                            <strong>${nombre}</strong>
                        </div>
                        <a class="boton" href="https://twitch.tv/${nombre}" target="_blank">Ver canal</a>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error al cargar streamers:", err);
    }
}

mostrarStreamers();
setInterval(mostrarStreamers, 60000);