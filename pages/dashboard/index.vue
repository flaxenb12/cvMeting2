<template>
  <div>Welcome admin</div>
  <div>
    <pre>{{ users }}</pre>
  </div>
</template>

<script setup>
const { data: users, error } = await useAuthClient().admin.listUsers({
  // searchValue: "some name",
  // searchField: "name",
  // searchOperator: "contains",
  limit: 100,
  offset: 100,
  sortBy: "name",
  sortDirection: "desc",
  // filterField: "email",
  // filterValue: "hello@example.com",
  // filterOperator: "eq",
});
</script>

<style></style>
