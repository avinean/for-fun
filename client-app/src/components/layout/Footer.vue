<template>
  <footer class="footer">
    Doer
    <template v-if="startedYear === currentYear">
      {{ currentYear }}
    </template>
    <template v-else>
      {{ startedYear }} - {{ currentYear }}
    </template>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      startedYear: 2021,
      currentYear: new Date().getFullYear(),
    };
  },
});
</script>
