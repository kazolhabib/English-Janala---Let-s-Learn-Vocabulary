const createElements = (arr) =>{
    const htmlElements = arr.map ((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
}

const manageLoader = (status) =>{
    if (status == true) {
        document.getElementById("loader").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("loader").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

const loadLeason =() =>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then((json) => displayLeason(json.data));
}

const removeActiveClass = () =>{
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn) => {
        btn.classList.remove("active");
    });
};

const loadLevelWords = (id) =>{
    manageLoader(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActiveClass();
        const btn = document.getElementById(`lesson-btn-${id}`);
        btn.classList.add("active");
        displayLevelWord(data.data);
    });
};

const loadWordDetails = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayWordDetails(data.data);
};
const displayWordDetails = (word) =>{
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
        <div class="">
            <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
        </div>

        <div class="">
        <h2 class="font-bold">Meaning</h2>
        <p class="font-bangla">${word.meaning}</p>
    </div>
    <div class="">
        <h2 class="font-bold">Example</h2>
        <p class="font-bangla">${word.sentence}</p>
    </div>
    <div class="">
        <h2 class="font-bold mb-2">Synonym</h2>
        <div class="">${createElements(word.synonyms)}</div>
    </div>
    `;
    document.getElementById('word_modal').showModal();
    // word_modal.showModal(); 
    //eita ar uporer ta ekijinish.
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0){
        wordContainer.innerHTML = `
            <div class="text-center col-span-full">
            <img class="mx-auto mb-4" src="./assets/alert-error.png" alt="alert">
            <p class="text-sm leading-6 font-bangla text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-4xl leading-10 font-medium text-[#292524] pt-3">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageLoader(false);
        return;
    }

    words.forEach((word) => {
        console.log(word)
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-white rounded-xl p-5 shadow-sm text-center p-14 space-y-4">
            <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">meaning /Pronounciation</p>
            <p class="text-2xl font-medium font-bangla">${word.meaning? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation? word.pronunciation : "pronunciation পাওয়া যায়নি"}</p>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails('${word.id}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
        wordContainer.appendChild(card);
    });
    manageLoader(false);
}

const displayLeason = (leasons) =>{
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    for (let lesson of leasons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"> <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.appendChild(btnDiv);
    }
}
loadLeason();