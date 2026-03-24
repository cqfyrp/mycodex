const { login, getSession } = require('../../utils/auth');

Page({
  data: {
    account: 'laian01',
    password: '123456'
  },

  onShow() {
    const session = getSession();
    if (session) {
      getApp().setVisitorMode(false);
      wx.reLaunch({
        url: '/pages/home/index'
      });
    }
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [field]: event.detail.value
    });
  },

  submitLogin() {
    const { account, password } = this.data;

    if (!account || !password) {
      wx.showToast({
        title: '请输入账号和密码',
        icon: 'none'
      });
      return;
    }

    const session = login(account, password);

    if (!session) {
      wx.showToast({
        title: '账号或密码错误',
        icon: 'none'
      });
      return;
    }

    getApp().setVisitorMode(false);
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/home/index'
      });
    }, 200);
  }
});
