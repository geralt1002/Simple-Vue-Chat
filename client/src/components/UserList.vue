<template>
  <div class="users-box" :class="[isPreview ? 'none' : '']">
    <h3 class="users-headline">Użytkownicy Online:</h3>
    <ul class="users-list" v-for="u in users" :key="u.id">
      <li class="user-list-item">{{ u.username }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
    isPreview: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.users-box {
  width: 50%;
  min-height: 100%;
  box-shadow: 7px 5px 46px -16px $accent_color;
  border: 2px solid $accent_color;
  color: #fff;
  margin: 1rem;
  .users-headline {
    @include flex;
    border-bottom: 2px solid $accent_color;
    background-color: rgba($accent_color, 0.5);
    padding: 1.3rem 0;
    margin: 0;
    text-transform: uppercase;
    text-align: center;
  }
  .users-list {
    @include flex;
    color: $accent_color;
    font-weight: 600;
    text-align: center;
    padding: 0;
    .user-list-item {
      width: 100%;
      padding: 0.5rem 1rem;
      list-style: none;
      text-align: left;
    }
  }
}

/*******MEDIA_QUERY*************/

@include smallerPhone {
  .users-box {
    width: 100%;
    margin: 0.5rem;
  }
}
@include mostPhone {
  .users-box {
    width: 100%;
  }
}
@include mostTablets {
  .users-box {
    width: 100%;
  }
}
</style>
