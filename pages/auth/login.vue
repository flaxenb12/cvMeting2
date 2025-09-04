<template>
  <div>
    <h1>login</h1>
    <UForm :schema="loginSchema" :state="loginState" @submit="handleLogin">
      <UFormField label="Email" name="email">
        <UInput v-model="loginState.email" type="email" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="loginState.password" type="password" />
      </UFormField>
      <UButton type="submit">Submit</UButton>
    </UForm>
  </div>

  <div>
    <UButton @click="createUser">Create User</UButton>
    <UButton @click="sigUp">Sign Up</UButton>
    <UButton @click="googleSignup">Google Sign Up</UButton>
  </div>
</template>

<script setup>
import { UButton } from "#components";
import * as z from "zod";

const { signIn } = useAuthClient();

const loginState = reactive({
  email: "",
  password: "",
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const loading = ref(false);
const toast = useToast();

async function handleLogin() {
  await signIn.email(
    {
      email: loginState.email,
      password: loginState.password,
    },
    {
      onRequest: (ctx) => {
        loading.value = true;
      },
      onSuccess: (ctx) => {
        navigateTo("/app");
      },
      onError: (ctx) => {
        toast.add({ title: ctx.error.message, color: "error" });
      },
    }
  );
}

async function createUser() {
  loading.value = true;

  const result = await useAuthClient().admin.createUser(
    {
      name: "Rein Inze",
      email: "r.inze@cas-vos.be",
      password: "test",
      role: "admin",
    },
    {
      onRequest: (ctx) => {
        loading.value = true;
      },
      onSuccess: (ctx) => {
        navigateTo("/app");
      },
      onError: (ctx) => {
        toast.add({ title: ctx.error.message, color: "error" });
      },
    }
  );
  loading.value = false;
}

async function sigUp() {
  const { data, error } = await useAuthClient().signUp.email(
    {
      email: "reininze@gmail.com", // user email address
      password: "WaG6479r0", // user password -> min 8 characters by default
      name: "Rein Inze", // user display name
      callbackURL: "/app", // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        navigateTo("/app");
      },
      onError: (ctx) => {
        // display the error message
        toast.add({ title: ctx.error.message, color: "error" });
      },
    }
  );
}

async function googleSignup() {
  const data = await useAuthClient().signIn.social(
    { provider: "google" },
    {
      onRequest: (ctx) => {
        // show loading
      },
      onSuccess: (ctx) => {
        navigateTo("/app");
      },
      onError: (ctx) => {
        // display the error message
        toast.add({ title: ctx.error.message, color: "error" });
      },
    }
  );
}
</script>

<style></style>
