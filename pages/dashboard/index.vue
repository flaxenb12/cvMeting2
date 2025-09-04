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
  limit: 2,
  offset: 0,
  sortBy: "name",
  sortDirection: "desc",
  filterField: "email",
  filterValue: "fl",
  filterOperator: "eq",
});
</script>

<style></style>
