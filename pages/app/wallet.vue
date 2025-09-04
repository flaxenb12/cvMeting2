<template>
  <div>
    <p>User ID: {{ user }} {{ user?.name }}</p>
    <p>Balance: {{ computedBalance }}</p>
  </div>

  <div class="mt-4">
    <UButton class="mx-2" @click="addBalance">Add 1000 Balance</UButton>
    <UButton class="mx-2" @click="subtractBalance"
      >Subtract 1000 Balance</UButton
    >
    <UButton class="mx-2" @click="refresh()">Refresh Balance</UButton>
  </div>
</template>

<script lang="ts" setup>
const { user } = await useAuthUser();

const { data: balance, refresh } = await useFetch(`/api/wallet/balance`);

const computedBalance = computed(() =>
  useFormatEuro(balance.value.balanceCents)
);

const addBalance = async () => {
  await $fetch(`/api/wallet/topup`, {
    method: "POST",
    body: {
      amountCents: 1000,
      method: "manual",
      sourceType: "manual",
    },
  });
  await refresh();
};

const subtractBalance = async () => {
  await $fetch(`/api/wallet/charge`, {
    method: "POST",
    body: {
      amountCents: 1000,
      method: "manual",
      sourceType: "manual",
    },
    onResponseError({ request, response }) {
      useToast().add({
        title: "Error",
        description: `Failed to subtract balance: ${response.statusText}`,
        color: "error",
      });
    },
  });
  await refresh();
};
</script>

<style></style>
