
<template>
  <div class="home-container">
    <div class="background-deco">
  <img src="https://cdn-icons-png.flaticon.com/512/869/869869.png" alt="Soleil" class="deco soleil" />
</div>

    <section class="section">
      <h1 class="section-title">Liste de courses 🛒</h1>
      <form @submit.prevent="addCourseItem(newProduct.name, newProduct.quantity)" class="form-inline">
        <input v-model="newProduct.name" placeholder="Produit" required />
        <input v-model.number="newProduct.quantity" type="number" min="1" placeholder="Quantité" required />
        <button type="submit">Ajouter</button>
      </form>
      <ul class="styled-list">
        <li v-for="item in courses" :key="item.id">
          {{ item.item }} - {{ item.quantity }}
          <button @click="deleteCourseItem(item.id)" class="banana-button">Suppr</button>
        </li>
      </ul>
    </section>

    <section class="section">
      <h1 class="section-title">Affaires 🎒</h1>
      <div v-for="(items, surname) in gears" :key="surname">
        <h3>{{ surname }} :</h3>
        <ul class="styled-list">
          <li v-for="(item, index) in items" :key="index">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <h1 class="section-title">Playlists à écouter 🎵</h1>
      <ul class="playlist-links">
        <li><a :href="playlists.spotify" target="_blank">Spotify</a></li>
        <li><a :href="playlists.youtube" target="_blank">YouTube</a></li>
        <li><a :href="playlists.appleMusic" target="_blank">Apple Music</a></li>
        <li>
          <a :href="playlists.deezer" target="_blank">Deezer</a>
          <iframe title="deezer-widget" src="https://widget.deezer.com/widget/auto/playlist/13315924963" width="100%" height="300" frameborder="0" allowtransparency="true" allow="encrypted-media; clipboard-write"></iframe>
        </li>
      </ul>
    </section>

    <section class="section">
      <h1 class="section-title">Album partagé 📷</h1>
      <h2>Ajoute tes photos :</h2>
      <form @submit.prevent="uploadFile">
        <input type="file" multiple @change="handleFileUpload" />
        <button type="submit">Ajouter</button>
      </form>
      <div v-if="images.length">
        <h2>Photos :</h2>
        <div class="carousel-container">
          <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(img, index) in images" :key="index" class="carousel-slide">
              <img :src="img" alt="Photo partagée" />
              <button @click="downloadImage(img)">Télécharger</button>
            </div>
          </div>
          <button class="carousel-button prev" @click="prevSlide">←</button>
          <button class="carousel-button next" @click="nextSlide">→</button>
        </div>
        <button @click="downloadAllImages" class="download-all-button">📥 Tout télécharger</button>
      </div>
    </section>
  </div>
</template>


<script>
export default {
  data() {
    return {
      courses: [],
      newProduct: {
        name: '',
        quantity: 1,
      },
      gears: {},
      playlists: {
        spotify: "https://spotify.com/playlist/12345",
        youtube: "https://youtube.com/playlist/12345",
        appleMusic: "https://music.apple.com/playlist/12345",
        deezer: "https://www.deezer.com/us/playlist/13315924963"
      },
      file: null,
      files:[],
      images: [],
      currentIndex: 0
    };
  },
  methods: {
    fetchCourses() {
      fetch('http://localhost:3000/api/courses')
        .then(response => response.json())
        .then(data => {
          this.courses = data.courses;
        })
        .catch(error => {
          console.error('Erreur fetch:', error);
        });
    },
    async addCourseItem(item, quantity) {
      try {
    const res = await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Date.now(), // pour générer un ID unique
        item,
        quantity: parseInt(quantity)
      })
    });
    const data = await res.json();
    this.courses.push(data); // mettre à jour l’affichage
    } catch (err) {
    console.error('Erreur ajout produit :', err);
    }
    },
  async deleteCourseItem(id) {
    try {
      await fetch(`http://localhost:3000/api/courses/${id}`, {
        method: 'DELETE'
      });

      this.courses = this.courses.filter(item => item.id !== id);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  },
  fetchGears() {
  fetch('http://localhost:3000/api/affaires')
    .then(res => res.json())
    .then(data => {
      this.gears = data.groupedGears;
    })
    .catch(err => {
      console.error('Erreur récupération affaires:', err);
    });
},
  handleFileUpload(event) {
  this.files = Array.from(event.target.files);
},

async uploadFile() {
  const formData = new FormData();
  this.files.forEach(file => {
    formData.append('files', file); // attention à gérer ça côté serveur
  });

  try {
    const response = await fetch('http://localhost:3000/api/album/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    this.fetchAlbum();
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
},
    fetchAlbum(){
    fetch('http://localhost:3000/api/album')
      .then(res => res.json())
      .then(data => {
        this.images = data.files;
      })
      .catch(err => {
        console.error('Erreur chargement images', err);
      });},
      nextSlide() {
  this.currentIndex = (this.currentIndex + 1) % this.images.length;
},
prevSlide() {
  this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
},
downloadAllImages() {
  this.images.forEach(img => {
    this.downloadImage(img);
  });
}
,
downloadImage(imgUrl) {
  fetch(imgUrl)
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imgUrl.split('/').pop(); // nom du fichier
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => console.error('Erreur de téléchargement :', err));
}


},
  mounted() {
    this.fetchCourses();
    this.fetchGears();
    this.fetchAlbum();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

.home-container {
  background: linear-gradient(to bottom, #fff4e0, #ffcb8e);
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 10px rgba(255, 136, 0, 0.2);
}

.section-title {
  font-family: 'Righteous', cursive;
  color: #ff6600;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.form-inline {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

input[type="text"],
input[type="number"] {
  padding: 0.5rem;
  border: 2px solid #ffb347;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  background-color: #ff6600;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #e65c00;
}

.styled-list {
  list-style-type: none;
  padding: 0;
}

.styled-list li {
  background-color: #fff0d9;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
}

.playlist-links li {
  margin-bottom: 1rem;
}

.playlist-links a {
  color: #d95d00;
  font-weight: bold;
  text-decoration: none;
}

.playlist-links a:hover {
  text-decoration: underline;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  margin: auto;
}

.carousel-track {
  display: flex;
  transition: transform 0.4s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-slide img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  user-select: none;
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}


.banana-button {
  background: linear-gradient(135deg, #fff9b3, #ecd90a);
  border: 1px solid #5aa637;
  color: #2e522b;
  font-weight: bold;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.banana-button:hover {
  background: linear-gradient(135deg, #fff9b3, #ecd90a);
}

.download-all-button {
  display: block;
  margin: 1rem auto 2rem;
  background-color: #ecd90a;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.background-deco {
  position: relative;
  width: 100%;
  height: 120px;
}

.deco {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.9;
}
.soleil {
  top: 10px;
  left: 10px;}

</style>