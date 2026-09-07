// Keep public assets inside the deployment base, including GitHub project Pages.
export const publicUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
