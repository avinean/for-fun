<template>
    <div class="games">
        games
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { GameConfig } from './../models/Games/General';

export default class GamesPage extends Vue {
    gamesList: GameConfig[] = [
        {
            name: 'TikTokToe',
            logo: '',
            link: ''
        }
    ]
}
</script>
