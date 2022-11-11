<template>
  <q-page >
   <sign-in/>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import SignIn from './account/SignIn.vue'

export default defineComponent({
  name: 'PageIndex',
  components:{
    SignIn
  }
})
</script>
