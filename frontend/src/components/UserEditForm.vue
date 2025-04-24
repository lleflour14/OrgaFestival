<template>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Bénévole</label>
        <input type="checkbox" v-model="formData.isVolunteer" />
      </div>
  
      <div>
        <label>Jours de présence</label>
        <div class="checkbox-group">
          <label v-for="day in jours" :key="day">
            <input type="checkbox" :value="day" v-model="formData.presenceDays" />
            {{ day }}
          </label>
        </div>
      </div>
  
      <div>
        <label>Ce que j'amène</label>
        <ul>
          <li v-for="(item, i) in formData.gear" :key="i">
            <input type="text" v-model="item.item" placeholder="Objet" />
            <input type="number" v-model.number="item.quantity" placeholder="Quantité" />
            <button type="button" @click="removeItem(i)" class="delete-btn">🗑</button>
          </li>
        </ul>
        <button type="button" @click="addItem">Ajouter un objet</button>
      </div>
  
      <button type="submit">Sauvegarder</button>
      <button type="button" @click="$emit('cancel')">Annuler</button>
    </form>
  </template>
  
  <script>
  export default {
    props: ['user', 'jours'],
    data() {
      return {
        formData: JSON.parse(JSON.stringify(this.user)),
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('save', this.formData);
      },
      addItem() {
        this.formData.gear.push({ item: '', quantity: 1 });
      },
      removeItem(index) {
      this.formData.gear.splice(index, 1);
    },
    },
  };
  </script>
  
  <style scoped>
  .checkbox-group {
    display: flex;
    gap: 10px;
    margin: 10px 0;
  }
  
  input[type='text'],
  input[type='number'] {
    width: 100%;
    padding: 5px;
    margin: 5px 0;
  }
  .delete-btn {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
  </style>
  