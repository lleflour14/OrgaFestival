<template>
  <div>
    <h1>Liste de courses 🛒</h1>
    
    <form @submit.prevent="addCourseItem(newProduct.name,newProduct.quantity)">
      <input v-model="newProduct.name" placeholder="Produit" required />
      <input v-model.number="newProduct.quantity" type="number" min="1" placeholder="Quantité" required />
      <button type="submit">Ajouter</button>
    </form>

    <ul>
      <li v-for="item in courses" :key="item.id">
        {{ item.item }} - {{ item.quantity }}
        <button @click="deleteCourseItem(item.id)">❌</button>
      </li>
    </ul>
  </div>
  <div>
    <h1>Playlists à écouter 🎵</h1>
    <ul>
      <li><a :href="playlists.spotify" target="_blank">Spotify</a></li>
      <li><a :href="playlists.youtube" target="_blank">YouTube</a></li>
      <li><a :href="playlists.appleMusic" target="_blank">Apple Music</a></li>
      <li><a :href="playlists.deezer" target="_blank">Deezer</a>
        <iframe title="deezer-widget" src="https://widget.deezer.com/widget/auto/playlist/13315924963" width="100%" height="300" frameborder="0" allowtransparency="true" allow="encrypted-media; clipboard-write"></iframe></li>
    </ul>
  </div>
  <div>
    <h1>Album partagé 📷</h1>
    <h2>Ajouter une photo ou vidéo</h2>
    <form @submit.prevent="uploadFile">
      <input type="file" @change="handleFileUpload" />
      <button type="submit">Ajouter</button>
    </form>
    <div>
    <h2>Photos : </h2>
    <div class="carousel-container" v-if="images.length">
  <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
    <div v-for="(img, index) in images" :key="index" class="carousel-slide">
      <img :src="img" alt="Photo partagée" />
    </div>
  </div>
  <button class="carousel-button prev" @click="prevSlide">←</button>
  <button class="carousel-button next" @click="nextSlide">→</button>
</div>

  </div>
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
      playlists: {
        spotify: "https://spotify.com/playlist/12345",
        youtube: "https://youtube.com/playlist/12345",
        appleMusic: "https://music.apple.com/playlist/12345",
        deezer: "https://www.deezer.com/us/playlist/13315924963"
      },
      file: null,
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
  handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append('file', this.file);
      
      try {
        const response = await fetch('http://localhost:3000/api/album/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        this.album = data;
        this.fetchAlbum();
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
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
}
},
  mounted() {
    this.fetchCourses();
    this.fetchAlbum();
  },
};
</script>

<style scoped>
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
</style>
