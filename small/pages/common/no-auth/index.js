Page({
  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({
          url: '/pages/login/index'
        });
      }
    });
  }
});
