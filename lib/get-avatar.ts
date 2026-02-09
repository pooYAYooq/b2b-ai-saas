/**
 * Returns a URL for the user's avatar. If the userPicture is provided, it will
 * be returned as is. If not, a URL will be generated based on the userEmail.
 * @param {string | null} userPicture - Optional URL for the user's avatar.
 * @param {string} userEmail - Required email address for the user.
 * @returns {string} - A URL for the user's avatar.
 */
export function getAvatar(userPicture: string | null, userEmail: string) {
  return userPicture ?? `https://avatar.vercel.sh/${userEmail}`;
}
