export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getFallbackAvatar = (name = "User") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256&bold=true`;

export const handleAvatarError = (e, name) => {
  e.target.onerror = null;
  e.target.src = getFallbackAvatar(name);
};