function openModal(id) {
    var modal = document.getElementById(`modal-${id}`);
    modal.style.display = 'block';
}

function openSeriesModal(id) {
    const modal = document.getElementById(`series-modal-${id}`);
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
}

document.querySelectorAll('.modal-content select').forEach(select => {
    select.onchange = () => {
        const seasonSelect = document.getElementById('season-select-rick-and-morty');
        const episodeSelect = document.getElementById('episode-select-rick-and-morty');
         const Voice = document.getElementById('voice');
        const selectedSeason = seasonSelect.value;
        const selectedEpisode = episodeSelect.value;

        // Добавьте логику для обновления iframe в зависимости от выбранного сезона и эпизода
        const iframe = document.getElementById('series-iframe-rick-and-morty');
        if (selectedSeason === "1-7" && selectedEpisode === "all") {
            iframe.src = "https://vkvideo.ru/video_ext.php?oid=-229424497&id=456239283&hd=1";
        }
        
        const iframe = document.getElementById('sen');
        if (Voice === "j") {
            iframe.src = "https://vkvideo.ru/video_ext.php?oid=-225959461&id=456239541&hd=1";
        else if (Voice === "r")
            iframe.src = "https://vkvideo.ru/video_ext.php?oid=-229894036&id=456239017&hd=1";
        }
        // Добавьте другие эпизоды и сезоны здесь
    };
});

function showInfo() {
    var infoBlock = document.getElementById('info-block-1');
    if (infoBlock.style.display === 'none') {
        infoBlock.style.display = 'block';
    } else {
        infoBlock.style.display = 'none';
    }
}

const searchInput = document.getElementById('search-input');
const filmBlocks = document.querySelectorAll('.film-block');
const seriesBlocks = document.querySelectorAll('.series-block');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    filmBlocks.forEach(film => {
        if (film.querySelector('h3').textContent.toLowerCase().includes(query)) {
            film.style.display = 'block';
        } else {
            film.style.display = 'none';
        }
    });
    seriesBlocks.forEach(serie => {
        if (serie.querySelector('h3').textContent.toLowerCase().includes(query)) {
            serie.style.display = 'block';
        } else {
            serie.style.display = 'none';
        }
    });
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
