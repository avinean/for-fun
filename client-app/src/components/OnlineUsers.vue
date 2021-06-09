<template>
    <div
      v-if="!isGameRunning"
      class="online-users"
    >
      <div class="online-users__header">
        <span>Currently online</span>
        <div class="spacer" />
        <i class="el-icon-minus" @click="isCollapsed = !isCollapsed"></i>
      </div>
      <div
        class="online-users__body"
        :class="{'online-users__body--collapsed': isCollapsed}"
      >
        <div
          class="online-users__users"
        >
          <template v-for="user in users" :key="user.id">
            <div class="online-users__user">
              <el-avatar
                :src="user.photo || defaultAvatar"
                class="online-users__avatar"
              ></el-avatar>
              <div class="online-users__name">
                <template v-if="user.name && user.lastName">
                  {{ user.name }} {{ user.lastName }} ({{ user.nickname }})
                </template>
                <template v-else>
                  {{ user.nickname }}
                </template>
              </div>
              <el-dropdown
                @command="inviteToGame(user, $event)"
              >
                <el-button
                  type="primary"
                  size="mini"
                  :loading="pendingUsers.includes(user.id)"
                >
                  Invite
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="game in games"
                      :key="game.strId"
                      :command="game"
                      :disabled="game.isUnderDevelopment"
                    >
                      <div class="game-item">
                        <el-avatar
                          :src="game.image || defaultImage"
                          size="small"
                          class="game-item__avatar"
                        ></el-avatar>
                        <span>
                          {{ game.name }}
                        </span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, inject, ref,
} from 'vue';
import {
  MessageObject, User, GameRequest, Game,
} from '@doer/entities';
import defaultAvatar from '@/assets/default_user.png';
import defaultImage from '@/assets/puzzle.png';
import socket from '@/services/SocketService';
import { GameStoreInterface } from '@/models/Store/GameStoreInterface';
import { UserStoreInterface } from '@/models/Store/UserStoreInterface';

interface Data {
  users: User[];
}

export default defineComponent({
  setup() {
    const gameStore = inject<GameStoreInterface>('gameStore');
    const userStore = inject<UserStoreInterface>('userStore');
    const isCollapsed = ref<boolean>(true);
    const games = computed(() => gameStore?.state.games || []);
    const pendingUsers = computed(() => gameStore?.state.pendingUsers || []);
    const isGameRunning = computed(() => gameStore?.state.isGameRunning);
    const user = computed(() => userStore?.state.user);

    return {
      isGameRunning,
      defaultAvatar,
      defaultImage,
      isCollapsed,
      inviteToGame: gameStore?.sendInvitation,
      games,
      pendingUsers,
      user,
    };
  },
  data() {
    return {
      users: [],
    } as Data;
  },
  mounted() {
    socket.on('online users update', (users: User[]) => {
      this.users = users.filter((user) => user.id !== this.user?.id);
    });
  },
});
</script>

<style lang="scss">
  .online-users {
    position: absolute;
    right: 320px;
    bottom: 0;
    z-index: 99999999999;
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

      &users {
        flex: 1;
        max-height: 420px;
        overflow-y: auto;
        margin-bottom: 4px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
      }

      &user {
        display: flex;
        align-items: center;
        padding: 4px;
        animation: message-appear 1s forwards;

        & > div {
          padding: 4px;
          &:first-child {
            width: 48px;
          }
        }

        &--pure {
          .online-users__avatar, .online-users__name {
            display: none;
          }
        }

        &:hover {
          background: rgba(0,0,0,.2);
        }
      }

      &name {
        flex: 1;
        font-size: 12px;
        padding-bottom: 4px;
        font-weight: bold;
      }

      &time {
        font-size: 10px;
        font-weight: normal;
      }

    }
  }

  .game-item {
    display: flex;
    margin: 6px 0;

    &__avatar {
      margin-right: 6px;
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
