const { createApp } = Vue;

createApp({

  data(){
    return{
      items: [],
      itemsOriginales: [],
      busqueda: "",
      seleccionado: {},
  apiBase: "https://api-regretevator.onrender.com"
    }
  },

  mounted(){
    this.cargarPersonajes();
    
  },

  computed:{

   filtrados(){
  return this.itemsOriginales.filter(item =>
    item.name.toLowerCase().includes(this.busqueda.toLowerCase())
  );
},

    porcentaje(){
      if(this.itemsOriginales.length === 0) return 0;
      return Math.round((this.filtrados.length / this.itemsOriginales.length)*100);
    }

  },

  methods:{

   cargarPersonajes() {
  axios.get(this.apiBase + "/characters")
    .then((respuesta) => {
      this.items = respuesta.data;
      this.itemsOriginales = respuesta.data;

      
      this.itemsOriginales = this.itemsOriginales.map((item) => {
        if(item.imageUrl){
          const match = item.imageUrl.match(/https?:\/\/.*\.(png|jpg|jpeg|gif)/i);
          if(match){
            item.imageUrl = match[0]; 
          }
        }
        return item;
      });

      localStorage.setItem("regretevator", JSON.stringify(this.itemsOriginales));
    })
    .catch(() => {
      const guardado = localStorage.getItem("regretevator");
      if(guardado){
        this.items = JSON.parse(guardado);
        this.itemsOriginales = JSON.parse(guardado);
      }
    });
}
    },

    resetear(){
      this.busqueda = "";
      this.items = this.itemsOriginales;
    },

    verDetalle(item){
      this.seleccionado = item;
      const modal =
        new bootstrap.Modal(document.getElementById("detalleModal"));
      modal.show();
    }

  }

).mount("#app");