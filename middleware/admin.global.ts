export default defineNuxtRouteMiddleware(async (to) => {
  const isUserNavigatingToTheDashboard = to.path.startsWith("/dashboard");

  if (!isUserNavigatingToTheDashboard) {
    return;
  }

  const { user } = await useAuthUser();

  if (user?.role !== "admin") {
    return navigateTo("/auth/login");
  }
});
