<template>

  <div class="wrapper">
    <img id="return" @click="handleRoute('/')" src="~/assets/images/Logo3.png">

    <div class="form-group" @keyup.enter="createRoom">
      <label for="userName" >Nazwa użytkownika <span :class="{redText: room.uname.length > 20}" >{{room.uname.length}} / 20</span></label>
      <br>
      <input id="userName" type="text" class="form-control" autocomplete="off" v-model="room.uname">
      <br>
      <label for="roomName" >Nazwa pokoju <span :class="{redText: room.name.length > 30}" >{{room.name.length}} / 30</span></label>
      <br>
      <input type="text" id="roomName" class="form-control" autocomplete="off" v-model="room.name">
      <br>
      <label for="roomDesc">Opis pokoju <span :class="{redText: room.description.length > 150}" >{{room.description.length}} / 150</span></label>
      <br>
      <textarea rows="3"  id="roomDesc" class="form-control" autocomplete="off" v-model="room.description"></textarea>
      <!-- Error Messages -->
      <p v-show="userError" class="alertText userAlert"><b>Nazwa użytkownika nie może być pusta!</b></p>
      <p v-show="roomError" class="alertText roomAlert" ><b>Nazwa pokoju nie może być pusta!</b></p>
      <p v-show="descError" class="alertText descAlert"><b>Opis pokoju nie może być pusty!</b></p>

      <br>
      <div class="button">
        <button @click="createRoom" type="submit"  :class="{disabled: Condition}" :disabled="disable || room.description.length > 150" class="btn btn-primary">Utwórz pokój</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['verify', 'notLoggedIn'],
  data(){
    return{
      //error handlers
        userError: false,
        roomError: false,
        descError: false,
        disable: false,
      room: {
        name: "",
        description: "",
        uname: "",
      }
    }
  },
  mounted(){
    this.socket = window.socket;
    this.socket.on('created', (roomId) => {
      let data = {
        roomId: roomId,
      }
      this.socket.emit('roomConnect', data)
      this.$router.push(`/rooms/${roomId}`);
    })
  },
  computed:{
    Condition: function() {
      if(this.disable || this.room.description.length > 150 || this.room.uname.length > 20 || this.room.name.length > 30){
        return true
      }
      else{
        return false
      }
    }
  },
  methods: {
    handleRoute(route){
      this.$router.push(`${route}`)
    },
    async createRoom(){
      //preventing user from spamming on button
      if(!this.disable){
        if(!this.room.uname){
          this.userError = true;
        }
        else{
          this.userError = false;
        }
        if(!this.room.name){
          this.roomError = true;
        }
        else{
          this.roomError = false;
        }
        if(!this.room.description){
          this.descError = true;
        }
        else{
          this.descError = false;
        }
        if(this.room.name && this.room.description && this.room.uname){
          this.disable = true;
          await this.socket.emit('createRoom', this.room);
          //reseting values
          this.room.name = '';
          this.room.uname = '';
          this.room.description = '';
        }
      }
    }
  }    
}
</script>

<style scoped>
  @import 'assets/style/RoomCreate/roomCreateStyles.css';
</style>