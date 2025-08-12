<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome to CV Meting V2</h1>
    <p class="mb-4">
      This is a simple Nuxt 3 application with Drizzle ORM and PostgreSQL.
    </p>
    <p class="mb-4">You can manage your posts below:</p>
    <nuxt-link to="/posts" class="text-blue-500 hover:underline"
      >Go to Posts</nuxt-link
    >
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Recent Posts</h2>
    </div>
  </div>
</template>
