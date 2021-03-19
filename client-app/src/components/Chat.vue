<template>
    <div class="chatbox">
      <div
        ref="messagesWrap"
        class="chatbox__msgs"
      >
        <template v-for="({ message, user , isPrev}, i) in messages" :key="message.message + i">
            <div
              class="chatbox__msg"
              :class="{'chatbox__msg--pure': isPrev}"
            >
              <div>
                <el-avatar
                  :src="user.photo || defaultAvatar"
                   class="chatbox__avatar"
                ></el-avatar>
              </div>
              <div>
                <div class="chatbox__name">
                  <template v-if="user.name && user.lastName">
                    {{ user.name }} {{ user.lastName }} ({{ user.nickname }})
                  </template>
                  <template v-else>
                    {{ user.nickname }}
                  </template>
                  <span class="chatbox__time">{{ getDate(message.createdAt) }}</span>
                </div>

                <div class="chatbox__status"></div>
                <div class="chatbox__text">{{ message.message }}</div>
              </div>
            </div>
        </template>
      </div>
      <div class="chatbox__footer">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="Please input"
          v-model="draft"
          @keypress.enter="send"
        />
      </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, nextTick, reactive, ref,
} from 'vue';
import { io, ManagerOptions, SocketOptions } from 'socket.io-client';
import { Message, User } from '@doer/entities';
import defaultAvatar from '@/assets/default_user.png';

export interface MessageObject {
  message: Message;
  user: Partial<User>;
}

export default defineComponent({
  setup() {
    const messagesWrap = ref(document.createElement('div'));
    const draft = ref<string>('');
    const messages = reactive<(MessageObject & { isPrev?: boolean })[]>([]);
    const token: string = localStorage.sessionToken;
    const URL = 'http://localhost:5000';
    const options: Partial<ManagerOptions & SocketOptions> = {
      auth: {
        token,
      },
      autoConnect: true,
    };
    const socket = io(URL, options);

    const send = () => {
      if (!draft.value) return;

      socket.emit('chat message', draft.value);
      draft.value = '';
    };

    const getDate = (d?: string): string => {
      const date = d ? new Date(d) : new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return `${year}/${month + 1}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const isPrev = (msg: Message): boolean => {
      const lastObj = messages[messages.length - 1];
      if (!lastObj) return false;
      const prevMsg = lastObj.message;
      if (msg.userId !== prevMsg.userId) return false;
      if (!msg.createdAt || !prevMsg.createdAt) return false;
      const current = new Date(msg.createdAt).getTime();
      const prev = new Date(prevMsg.createdAt).getTime();
      return current - prev < 60000;
    };

    socket.on('chat message', (msgObj: MessageObject) => {
      messages.push({
        ...msgObj,
        isPrev: isPrev(msgObj.message),
      });
      nextTick(() => {
        messagesWrap.value.scrollTo({
          top: 99999999999,
          behavior: 'smooth',
        });
      });
    });

    return {
      messagesWrap,
      draft,
      defaultAvatar,
      messages,
      send,
      getDate,
    };
  },
});
</script>

<style lang="scss">
  .chatbox {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 320px;
    max-width: 100vw;
    height: 420px;
    padding: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    overflow: hidden;
    color: #303133;
    transition: .3s;

    &__ {
      &msgs {
        flex: 1;
        max-height: 420px;
        overflow-y: auto;
        margin-bottom: 4px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
      }

      &msg {
        display: flex;
        animation: message-appear 1s forwards;

        & > div {
          padding: 4px;
          &:first-child {
            width: 48px;
          }
        }

        &--pure {
          .chatbox__avatar, .chatbox__name {
            display: none;
          }
        }
      }

      &name {
        font-size: 12px;
        padding-bottom: 4px;
        font-weight: bold;
      }

      &time {
        font-size: 10px;
        font-weight: normal;
      }

      &status {}

      &text {}

    }
  }

  @keyframes message-appear {
    0% {
      background: rgba(0,0,0,.2);
    }
    100% {
      background: rgba(0,0,0,0);
    }
  }
</style>
