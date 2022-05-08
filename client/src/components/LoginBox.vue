<template>
  <div class="container-join">
    <form class="join-form" novalidate @submit.prevent="joinToChat">
      <h2 class="page-start">Witaj w aplikacji czat</h2>
      <div class="join-box">
        <label for="form-label" class="form-label">Podaj swój nick</label>
        <input
          class="form-input input"
          id="form-label"
          type="text"
          :value="username"
          placeholder="Podaj swój nick"
          autocomplete="off"
          @input="(event) => $emit('update:username', event.target.value)"
        />
        <div v-if="errorLoginMsg" class="error-message">
          {{ errorLoginMsg }}
        </div>
      </div>
      <button class="btn form-button" type="submit">Dołącz</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',

  emits: ['joinToChat', 'update:username'],
  props: {
    username: {
      type: String,
      required: true,
    },
    errorLoginMsg: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.container-join {
  @include flex;
  width: 50%;
  border: 2px $accent_color solid;
  box-shadow: 7px 5px 46px -16px $accent_color;
  .join-form {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: space-around;
    .page-start {
      margin: 2rem 0 3rem 0;
      text-transform: uppercase;
      text-align: center;
    }
    .join-box {
      margin: 3rem 0 6rem 0;
    }
    .form-button {
      padding: 1.2rem 2.8rem;
      margin: 0 0 2rem 0;
    }
  }
}

/*******MEDIA_QUERY*************/

@include smallerPhone {
  .container-join {
    width: 100%;
    font-size: $font_size_to_340;
  }
}
@include mostPhone {
  .container-join {
    width: 100%;
    font-size: $font_size_to_340;
  }
}
@include mostTablets {
  .container-join {
    width: 100%;
    font-size: $font_size_to_1200;
  }
}
@include smallerDesktop {
  .container-join {
    width: 100%;
  }
}
</style>
