
const USER_ID_KEY = "mentor-dashboard-user-id";
const USERNAME_KEY = "mentor-dashboard-username";

export function getCurrentUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

export function getCurrentUsername() {
  let username = localStorage.getItem(USERNAME_KEY);

  if (!username) {
    username = `user_${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}`;
    localStorage.setItem(USERNAME_KEY, username);
  }

  return username;
}
