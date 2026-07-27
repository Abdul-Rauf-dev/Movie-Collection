const movies = [
    { id:1, title:"inception", genre:"scifi", rating:5, watched:true },
    { id:2, title:"The drak knight", genre:"action", rating:5, watched:false },
    { id:3, title:"parasite", year:2018, genre:"thriller", rating:5, watched:true },
    { id:4, title:"The Grand Buudapest Hotel", year:2014, genre:"comedy", rating:5, watched:true },
    { id:5, title:"Interstellar", year:2014, genre:"scifi", rating:5, watched:true },
];

function starsfromratin(rating){
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function buildcard(movie){
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <span class="genre-tag genre-${movie.genre}">${movie.genre}</span>
        <h3>${movie.title}</h3>
        <p>${movie.year || ""}</p>
        <span>${starsfromratin(movie.rating)}</span>

        <div>
            <span>${movie.watched ? "Watched" : "Not Watched"}</span>
            <button data-id="${movie.id}" class="delete-btn">Delete</button>
        </div>
    `;

    return card;
}

// RENDER
const container = document.querySelector(".movies");

function renderMovies(list){
    container.innerHTML = "";
    list.forEach(m => container.appendChild(buildcard(m)));
    document.querySelector("#count").textContent = list.length;
}

renderMovies(movies);

// ADD
document.querySelector(".add-form").addEventListener("submit", e=>{
    e.preventDefault();

    const newMovie = {
        id: Date.now(),
        title: document.querySelector("#title").value,
        year: document.querySelector("#year").value,
        genre: document.querySelector("#genre").value,
        rating: Number(document.querySelector("#rating").value),
        watched:false
    };

    movies.push(newMovie);
    renderMovies(movies);
    updateStats();

    e.target.reset();
});

// DELETE
container.addEventListener("click", e=>{
    if(e.target.classList.contains("delete-btn")){
        const id = Number(e.target.dataset.id);
        const index = movies.findIndex(m=>m.id===id);
        movies.splice(index,1);

        renderMovies(movies);
        updateStats();
    }
});

// FILTER
document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
        const type = btn.dataset.filter;

        if(type==="all") renderMovies(movies);
        else if(type==="watched") renderMovies(movies.filter(m=>m.watched));
        else renderMovies(movies.filter(m=>!m.watched));
    });
});

// STATS
function updateStats(){
    document.querySelectorAll("#total").forEach(el=>el.textContent = movies.length);

    const watched = movies.filter(m=>m.watched).length;
    document.querySelector("#watched").textContent = watched;

    const avg = movies.reduce((a,b)=>a+b.rating,0)/movies.length;
    document.querySelector("#avg").textContent = avg.toFixed(1);

    document.querySelector("#topGenre").textContent = getTopGenre();
}

function getTopGenre(){
    const count = {};
    movies.forEach(m=>{
        count[m.genre] = (count[m.genre]||0)+1;
    });

    return Object.keys(count).reduce((a,b)=>count[a]>count[b]?a:b);
}

updateStats();