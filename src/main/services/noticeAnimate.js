export default {
  winInstance: null,
  timer: null,
  isShown: false,
  screenHeight: 720,
  screenWidth: 1280,
  height: 0,
  width: 0,
  offset: 8,
  show(childWin, h, w, displayHeight) {
    this.winInstance = childWin;
    this.height = h;
    this.width = w;
    this.screenHeight = displayHeight;
    this.winInstance.show();
    this.animate(() => {});
  },

  slide(childWin, displayWidth, fromDirection, open, callback) {
    this.winInstance = childWin;
    this.height = childWin.getBounds().height;
    this.width = childWin.getBounds().width;
    this.screenWidth = displayWidth;
    this.winInstance.setMovable(false);
    this.animate2(callback, fromDirection, open);
  },

  /** 执行从底部划出动画 渐变y和opcity */
  animate(callback, open = true) {
    let currentTime = 0;
    this.timer = setInterval(() => {
      currentTime += 5;
      if (currentTime > 200) {
        open && (this.isShown = true);
        clearInterval(this.timer);
        /** 开始执行销毁当前弹窗的方法 */
        callback();
      } else {
        this.setBounds(
          Math.floor(
            open
              ? easeOutQuad(
                  currentTime,
                  this.screenHeight,
                  this.height + this.offset,
                  200,
                  !open
                )
              : easeInQuad(
                  currentTime,
                  this.screenHeight - this.height - this.offset,
                  this.height + this.offset,
                  200
                )
          )
        );
        this.setOpacity(
          Number(
            open
              ? easeInQuad(currentTime, 0, 1, 200, open).toFixed(2)
              : easeOutQuad(currentTime, 1, 0, 200, open).toFixed(2)
          )
        );
      }
    }, 5);
  },
  //自定义方向滑出
  animate2(callback, fromDirection, open = true) {
    if (!fromDirection) {
      return;
    }
    let currentTime = 0;
    this.timer = setInterval(() => {
      currentTime += 5;
      if (currentTime > 200) {
        clearInterval(this.timer);
        /** 开始执行销毁当前弹窗的方法 */
        this.winInstance &&
          !this.winInstance.isDestroyed() &&
          this.winInstance.setMovable(true);
        callback();
      } else {
        if (fromDirection == "top") {
          this.setBounds(
            Math.floor(
              open
                ? easeOutQuad(
                    currentTime,
                    4 - this.height,
                    this.height,
                    200,
                    true
                  )
                : easeInQuad(currentTime, 4, this.height, 200, false)
            )
          );
        } else {
          this.setBoundsX(
            Math.floor(
              open
                ? easeOutQuad(
                    currentTime,
                    fromDirection == "left"
                      ? 4 - this.width
                      : this.screenWidth - 4,
                    this.width,
                    200,
                    fromDirection == "left"
                  )
                : easeInQuad(
                    currentTime,
                    fromDirection == "left"
                      ? 4
                      : this.screenWidth - 4 - this.width,
                    this.width,
                    200,
                    !(fromDirection == "left")
                  )
            )
          );
        }
      }
    }, 5);
  },

  setBounds(y) {
    try {
      this.winInstance &&
        !this.winInstance.isDestroyed() &&
        this.winInstance.setBounds({ y });
    } catch (error) {
      console.log(error);
    }
  },
  setBoundsX(x) {
    try {
      this.winInstance &&
        !this.winInstance.isDestroyed() &&
        this.winInstance.setBounds({ x: x });
    } catch (error) {
      console.log(error);
    }
  },

  setOpacity(opacity) {
    try {
      this.winInstance &&
        !this.winInstance.isDestroyed() &&
        this.winInstance.setOpacity(opacity);
    } catch (error) {
      console.log(error);
    }
  },

  //   focus() {
  //     /** 获取焦点之后 取消倒计时关闭当前窗口 但是由于窗口打开是默认获取焦点的 focus不会重复触发
  //      *  所以这时候isShown为false 不会clearTimeout 除非先失去焦点 再获取焦点才会clearTimeout */
  //     if (this.isShown && this.timer) {
  //       clearTimeout(this.timer);
  //       this.timer = null;
  //     }
  //   },

  //   blur() {
  //     /** 开始倒计时关闭当前窗口 */
  //     this.timer === null && this.winClose();
  //   },

  //   /** 窗口关闭触发的事件 */
  //   closed() {
  //     this.timer && clearTimeout(this.timer);
  //   },

  //   /** 倒计时2s之后关闭当前窗口 */
  //   winClose() {
  //     this.timer = setTimeout(() => {
  //       this.animate(() => {
  //         this.winInstance &&
  //           !this.winInstance.isDestroyed() &&
  //           this.winInstance.close();
  //       }, false);
  //     }, 3000);
  //   },
};

function linear(
  currentTime,
  startValue,
  changeValue,
  duration,
  increase = true
) {
  return increase
    ? (changeValue * currentTime) / duration + startValue
    : startValue - (changeValue * currentTime) / duration;
}

/** ease-in */
function easeInQuad(
  currentTime,
  startValue,
  changeValue,
  duration,
  increase = true
) {
  currentTime /= duration;
  return increase
    ? changeValue * currentTime * currentTime + startValue
    : startValue - changeValue * currentTime * currentTime;
}

/** ease-out */
function easeOutQuad(
  currentTime,
  startValue,
  changeValue,
  duration,
  increase = true
) {
  currentTime /= duration;
  return increase
    ? -changeValue * currentTime * (currentTime - 2) + startValue
    : startValue - -changeValue * currentTime * (currentTime - 2);
}
