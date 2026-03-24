const { initializeStore } = require('./utils/store');
const { getSession } = require('./utils/auth');

App({
  globalData: {
    visitorMode: false
  },

  onLaunch() {
    initializeStore();
  },

  setVisitorMode(enabled) {
    this.globalData.visitorMode = !!enabled;
  },

  isDesignerLoggedIn() {
    return !!getSession();
  }
});
