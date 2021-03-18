<template>
    <el-card class="chatbox">
      <input type="text" @change="send">
    </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

export default defineComponent({
  setup() {
    const token: string = localStorage.sessionToken;
    const URL = 'http://localhost:5000';
    const options: Partial<ManagerOptions & SocketOptions> = {
      query: {
        token,
      },
    };
    const socket = io(URL, options);

    const send = (e: any) => {
      socket.emit('chat message', e.target?.value);
    };

    return {
      send,
    };
  },
});
</script>

<style lang="scss">
  .chatbox {
    position: absolute;
    bottom: 0;
  }
</style>
