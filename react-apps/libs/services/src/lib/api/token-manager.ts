export const tokenManager = {
  token: '',
  logout: [] as (() => void)[],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  sessionExpire: () => {},
  setToken(t: string) {
    this.token = t;
  },
  setLogoutMethod(m: () => void) {
    this.logout = [m];
  },
  setSessionExpiredMethod(m: () => void) {
    this.sessionExpire = m;
  },
  doLogout() {
    this.logout.forEach((i) => i());
  },
  onSessionExpire() {
    this.sessionExpire();
  },
};
