<template>
  <div>hello from app</div>
  <div>
    <pre>{{ user }}</pre>
    <pre>{{ accounts.data }}</pre>
  </div>
  <UButton @click="logout">Logout</UButton>
</template>

<script setup>
const user = await useAuthUser();
const { signOut } = useAuthClient();
const accounts = await useAuthClient().listAccounts();
async function logout() {
  await signOut({ redirect: "/auth/login" });
}
</script>

<style></style>
