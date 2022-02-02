<template>
  <nav class="navbar box" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img
            class="navbar-brand-img"
            src="../assets/logo.png"
        />
      </a>

      <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          :class="{ 'is-active': mobileMenuActive }"
          @click="mobileMenuActive = !mobileMenuActive"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': mobileMenuActive }">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/"> Home </router-link>
        <router-link class="navbar-item" to="/library"> Library </router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Informations
          </a>

          <div class="navbar-dropdown">
            <router-link class="navbar-item" to="/about">
              A propos
            </router-link>
            <a
                class="navbar-item"
                href="https://github.com/PERRETPY/homelibrary"
                target="github"
            >
              Voir le code source
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item copyright">
          Created by Univ-Nantes &copy;
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Menu.vue",
  data() {
    return {
      mobileMenuActive: false,
    };
  }
}
</script>

<style scoped>
.navbar {
  height: 70px;
}

.router-link-active {
  font-weight: bold;
  text-decoration: underline;
  text-decoration-color: #8D0000;
}

</style>