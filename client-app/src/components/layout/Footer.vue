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
import { Vue } from 'vue-class-component';

export default class CFooter extends Vue {
    startedYear = 2021;

    currentYear: number = new Date().getFullYear();
}
</script>
