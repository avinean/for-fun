<template>
    <div class="chatbox">
      <div class="chatbox__header">
        <span>Chat</span>
        <div class="spacer" />
        <i class="el-icon-minus" @click="isCollapsed = !isCollapsed"></i>
      </div>
      <div
        class="chatbox__body"
        :class="{'chatbox__body--collapsed': isCollapsed}"
      >
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
                    @click="inviteToGame(user)"
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
                    <p class="chatbox__time">{{ getDate(message.createdAt) }}</p>
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
            @keypress.enter.prevent="send"
          />
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, inject, nextTick, onMounted, reactive, ref,
} from 'vue';
import {
  MessageObject, User, GameRequest, Game,
} from '@doer/entities';
import defaultAvatar from '@/assets/default_user.png';
import { isPrev } from '@/helpers/message';
import { getDate } from '@/helpers/date';
import MessageService from '@/services/MessagesService';
import socket from '@/services/SocketService';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';

const messageService = new MessageService();

export default defineComponent({
  setup() {
    const messagesWrap = ref(document.createElement('div'));
    const draft = ref<string>('');
    const isCollapsed = ref<boolean>(true);
    const messages = reactive<MessageObject[]>([]);
    const gameStore = inject<GameStoreInterface>('game');

    const scrollToBottom = () => {
      nextTick(() => {
        messagesWrap.value.scrollTo({
          top: 99999999999,
          behavior: 'smooth',
        });
      });
    };

    const loadHistory = () => {
      messageService.getMessages()
        .then((result: MessageObject[]) => {
          result.forEach((msg: MessageObject, i: number) => {
            messages.unshift({
              ...msg,
              isPrev: isPrev(msg.message, result[i + 1]?.message),
            });
          });
          scrollToBottom();
        });
    };

    const send = () => {
      if (!draft.value) return;
      socket.emit('chat message', draft.value.trim());
      nextTick(() => {
        draft.value = '';
      });
    };

    onMounted(() => {
      loadHistory();
      socket.init();
      socket.on('chat message', (msg: MessageObject) => {
        messages.push({
          ...msg,
          isPrev: isPrev(msg.message, messages[messages.length - 1]?.message),
        });
        scrollToBottom();
      });

      socket.on('invite to game', async (request: GameRequest) => {
        gameStore?.setUsers(request);
      });
    });

    return {
      messagesWrap,
      draft,
      defaultAvatar,
      messages,
      isCollapsed,
      send,
      getDate,
      inviteToGame: gameStore?.sendInvitation,
    };
  },
});
</script>

<style lang="scss">
  .chatbox {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 14;
    width: 320px;
    max-width: 100vw;
    padding: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background: #ffffffcc;
    overflow: hidden;
    color: #303133;
    transition: .3s;

    &__ {
      &header {
        display: flex;
        padding: 4px;
        & i {
          cursor: pointer;
        }
      }

      &body {
        display: flex;
        flex-direction: column;
        height: 420px;
        max-height: 420px;
        transition: all ease .2s;

        &--collapsed {
          max-height: 0px;
        }
      }

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
