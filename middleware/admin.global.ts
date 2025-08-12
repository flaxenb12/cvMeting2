export default defineNuxtRouteMiddleware(async (to) => {
  const isUserNavigatingToTheApp = to.path.startsWith("/dashboard");

  if (!isUserNavigatingToTheApp) {
    return;
  }

  const { user } = await useAuthUser();

  if (user.role !== "admin") {
    return navigateTo("/auth/login");
  }
});
