/** Public profile returned with articles and comments. */
export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}
