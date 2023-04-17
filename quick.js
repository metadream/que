document.head.insertAdjacentHTML('beforeend', `<style>
[class^="quick-"] {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -moz-user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity .3s;
}
button:hover {
  opacity: .8;
}
button:active {
  opacity: 1;
}
button:disabled {
  opacity: .5 !important;
  cursor: default;
}
.quick-btn-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
  background: inherit;
}
.quick-btn-loading:before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-right: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  border-left: 2px solid currentColor;
  animation: spin .6s linear infinite;
}
.quick-overlay {
  position: fixed;
  z-index: 5000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.quick-loading {
  position: fixed;
  z-index: 5100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 32px;
  height: 32px;
  margin: auto;
  border-radius: 50%;
  border-top: 3px solid rgba(255, 255, 255, 0.2);
  border-right: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
  border-left: 3px solid rgba(255, 255, 255, 0.8);
  animation: spin .6s linear infinite;
}
.quick-progress {
  position: fixed;
  z-index: 5100;
  top: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #0c7;
  transition: width .3s linear;
}
.quick-info {
  background: transparent;
  height: 0;
  display: flex;
  justify-content: center;
}
.quick-info>div {
  margin-top: 80px;
  margin-bottom: auto;
  max-width: 80%;
  padding: 6px 15px;
  border-radius: 3px;
  font-weight: 700;
  color: #fff;
}
.quick-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
.quick-dialog-panel {
  display: flex;
  flex-direction: column;
  background: #fff;
  max-width: 80%;
  max-height: 80%;
  min-width: 280px;
  border-radius: 5px;
  overflow: hidden;
}
.quick-dialog-header {
  font-weight: 700;
  padding: 20px 20px 0;
  text-align: center;
}
.quick-dialog-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 25px;
}
.quick-dialog-footer {
  display: flex;
}
.quick-dialog-button {
  flex: 1;
  height: 48px;
  color: #999;
  background: #fff;
  border: transparent 1px solid;
  border-top-color: #f3f3f3;
  border-radius: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.quick-dialog-button:not(:first-child) {
  border-left-color: #f3f3f3;
}
.quick-dialog-button:hover {
  opacity: initial !important;
}
.quick-dialog-button:active, .quick-dialog-button:disabled {
  opacity: initial !important;
  background: #eee;
}
.quick-dialog-button.primary {
  color: #333;
}
.quick-actionsheet {
  position: fixed;
  z-index: 5001;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
}
.quick-actionsheet-menu {
  text-align: center;
  border-top: #f6f6f6 1px solid;
  background: #fff;
  cursor: pointer;
  line-height: 50px;
  font-weight: 700;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.quick-actionsheet-menu:active {
  background: #eee;
}
.quick-actionsheet-menu:first-child {
  border: 0;
}
.quick-actionsheet-menu:last-child {
  border: 0;
  margin-top: 10px;
  color: #ce2f33;
}
[quick-tooltip] {
  position: relative;
}
[quick-tooltip]:before, [quick-tooltip]:after {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
  bottom: 100%;
  left: 50%;
  transform: translate3d(-50%, -10px, 0);
  transition: opacity .5s;
}
[quick-tooltip]:hover:before, [quick-tooltip]:hover:after {
  visibility: visible;
  opacity: 1;
}
[quick-tooltip]:before {
  content: '';
  z-index: 1001;
  background: transparent;
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.7);
  margin-bottom: -12px;
}
[quick-tooltip]:after {
  content: attr(quick-tooltip);
  z-index: 1000;
  margin-right: -300px;
  padding: 6px 10px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1.6;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}
.quick-scale-in {
  animation: scaleIn ease .3s forwards;
}
.quick-fade-in {
  animation: fadeIn ease .3s forwards;
}
.quick-scale-out {
  animation: scaleOut ease .3s forwards;
}
.quick-fade-out {
  animation: fadeOut ease .3s forwards;
}
.quick-slide-up {
  animation: slideUp ease .3s forwards;
}
.quick-slide-down {
  animation: slideDown ease .3s forwards;
}
.quick-slide-left {
  animation: slideLeft ease .3s forwards;
}
.quick-slide-right {
  animation: slideRight ease .3s forwards;
}
.quick-datepicker-target {
  cursor: pointer;
  line-height: inherit;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='lightgray' d='M10.9 3.2H5.1v1.6H3.9V3.2H1.2v3.2h13.6V3.2h-2.7v1.6h-1.2V3.2zM12.1 2H15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2.9V.4h1.2V2h5.8V.4h1.2V2zm2.7 5.6H1.2v7.2h13.6V7.6z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: top 49% right 15px;
  background-size: 16px;
}
.quick-datepicker-wrapper {
  position: absolute;
  z-index: 5001;
  color: #666;
  font-size: 13px;
  background: #fff;
  box-shadow: 0 0 16px rgb(0 0 0 / 8%);
  user-select: none;
}
.quick-datepicker-header {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 5px;
  border-bottom: #eee 1px solid;
}
.quick-datepicker-text {
  flex: 1;
  text-align: center;
  color: #6698ff;
  font-size: 15px;
  cursor: pointer;
}
.quick-datepicker-btn {
  width: 26px;
  height: 26px;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  transition: .3s all;
}
.quick-datepicker-btn path {
  fill: #999;
}
.quick-datepicker-btn:hover {
  background: #eee;
}
.quick-datepicker-body {
  padding: 10px;
}
.quick-datepicker-body table {
  width: 100%;
  border-collapse: collapse;
}
.quick-datepicker-body tr {
  border: 0;
  height: auto;
}
.quick-datepicker-body th, .quick-datepicker-body td {
  width: 32px;
  height: 32px;
  text-align: center;
}
.quick-datepicker-body td {
  padding: 3px;
}
.quick-datepicker-body td>div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 3px;
  cursor: pointer;
  transition: .3s all;
}
.quick-datepicker-body td>div:hover {
  background: #eee;
}
.quick-datepicker-body td>div.today {
  color: #fff;
  background: #6698ff;
}
.quick-datepicker-body td>div.curr {
  color: #fff;
  background: #999;
}
.quick-datepicker-body td>div.minor {
  color: #ccc;
}
@keyframes scaleIn {
  from { transform: scale3d(0.8, 0.8, 1); }
  to { transform: scale3d(1, 1, 1); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleOut {
  from { transform: scale3d(1, 1, 1); }
  to { transform: scale3d(0.8, 0.8, 1); }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes slideUp {
  from { transform: translate3d(0, 100%, 0); }
  to { transform: translate3d(0, 0, 0); }
}
@keyframes slideDown {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, 100%, 0); }
}
@keyframes slideLeft {
  from { transform: translate3d(100%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}
@keyframes slideRight {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(100%, 0, 0); }
}
@keyframes spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
</style>`);

// --------------------------------------------------------
// 命名空间
// --------------------------------------------------------
const Quick = {};
Quick.LANGUAGE = { OK: '确定', YES: '确定', NO: '取消' };
Quick.ATTACHMENT_API = '/attachment';

// --------------------------------------------------------
// DOM原型扩展及快捷操作
// --------------------------------------------------------

Object.assign(Element.prototype, {
  on(event, fn) {
    this.addEventListener(event, fn);
    return this;
  },

  off(event, fn) {
    this.removeEventListener(event, fn);
    return this;
  },

  addClass(name) {
    this.classList.add(name);
    return this;
  },

  removeClass(name) {
    this.classList.remove(name);
    return this;
  },

  remove() {
    return this.parentNode && this.parentNode.removeChild(this);
  },

  val(v) {
    if (this.tagName != 'SELECT') return;
    for (let option of this) {
      if (option.value == v) {
        option.selected = true;
        this.onchange && this.onchange();
        break;
      }
    }
    return this;
  },

  disable() {
    if (this.tagName !== 'BUTTON') return;
    if (this.disabled) return;
    this.disabled = true;

    // Add loading to BUTTON if disabled
    this.loader = $('<div class="quick-btn-loading"></div>');
    this.appendChild(this.loader);
  },

  enable() {
    if (this.tagName !== 'BUTTON') return;
    if (!this.disabled) return;
    this.disabled = false;

    this.loader && this.loader.remove();
  }
});

/**
 * 获取/创建元素
 * @param selector {string|Element}
 * @param multi {boolean} 是否获取所有元素
 */
Quick.$ = window.$ = function(selector, multi = false) {
  if (typeof selector === 'string') {
    selector = selector.replace(/[\t\r\n]/mg, '').trim();
    // 如果是以 '<' 开头的字符串则创建元素
    if (selector.indexOf('<') === 0) {
      const fragment = document.createRange().createContextualFragment(selector);
      return fragment.firstChild;
    }
    // 如果第二个参数为真则获取所有元素
    if (multi) {
      return document.querySelectorAll(selector)
    }
    // 普通字符串获取第一个元素
    return document.querySelector(selector);
  }
  // 非字符串直接返回
  return selector;
}

/**
 * BODY添加子元素
 * @param element {Element}
 */
Quick._ = window._ = function(element) {
  document.body.appendChild(element);
}

// --------------------------------------------------------
// UI组件：居中圆形加载动画
// --------------------------------------------------------

/**
 * @example
 * Quick.loading.start()
 * Quick.loading.done()
 */
Quick.loading = {
  start() {
    if (this.$instance) return;
    this.$instance = $('<div class="quick-loading"></div>');
    _(this.$instance);
  },

  done() {
    if (!this.$instance) return;
    this.$instance.remove();
    this.$instance = null;
  }
}

// --------------------------------------------------------
// UI组件：页面顶部细长进度条
// --------------------------------------------------------

/**
 * @example
 * Quick.progress.start()
 * Quick.progress.done()
 */
Quick.progress = {

  start(indeterminate = true) {
    if (this.status) return;

    this.$instance = $('<div class="quick-progress"></div>');
    _(this.$instance);
    this._observe();

    if (indeterminate) { // 不确定的结束时间
      this.status = 1;
      this._trickle = setInterval(() => {
        if (this.status < 99) {
          this.status += Math.round(((100 - this.status) / 3) * Math.random());
        }
      }, 300);
    }
  },

  tick(status) {
    this.status = parseInt(status);
  },

  done() {
    if (!this.status) return;
    this.status = 100;
    clearInterval(this._trickle);

    setTimeout(() => {
      this.status = 0;
      this.$instance.remove();
    }, 300);
  },

  _observe() {
    if (this._observed) return;
    this._observed = true;

    let value = this.status;
    Object.defineProperty(this, 'status', {
      get: () => value,
      set: v => {
        value = v;
        this.$instance.style.width = v + '%';
      }
    });
  }
}

// --------------------------------------------------------
// UI组件：消息提示
// --------------------------------------------------------

/**
 * 基础消息提示
 * @example
 * Quick.info('hello world', options)
 * options = 3000
 * options = {
 *   duration: 3000,
 *   background: '#ccc'
 * }
 * @param {String} message
 * @param {Object} options
 */
Quick.info = function(message, options) {
  // Check and remove current instance
  if (Quick.$singleton) {
    Quick.$singleton.remove();
    Quick.$singleton = null;
  }

  // Merge custom options
  if (typeof options === 'number') {
    options = { duration: options };
  }
  options = Object.assign({
    duration: 3000,
    background: 'rgba(0, 0, 0, 0.6)'
  }, options);

  // Create element container
  const $instance = $(`
    <div class="quick-overlay quick-info">
      <div style="background:${options.background}">${message}</div>
    </div>
  `);

  // Show instance
  Quick.$singleton = $instance;
  $instance.addClass('quick-fade-in');
  _($instance);

  // Auto hide delay
  setTimeout(() => {
    $instance.addClass('quick-fade-out');
    $instance.on('animationend', $instance.remove);
  }, options.duration);
}

/**
 * 成功消息提示 (继承自Quick.info)
 * @example Quick.success('hello world', options)
 * @param {String} message
 * @param {Object} options
 */
Quick.success = function(message, options = {}) {
  if (typeof options === 'number') {
    options = { duration: options };
  }
  options.background = 'rgba(43, 155, 23, 0.6)';
  this.info(message, options);
}

/**
 * 警告消息提示 (继承自Quick.info)
 * @example Quick.warn('hello world', options)
 * @param {String} message
 * @param {Object} options
 */
Quick.warn = function(message, options = {}) {
  if (typeof options === 'number') {
    options = { duration: options };
  }
  options.background = 'rgba(235, 166, 40, 0.6)';
  this.info(message, options);
}

/**
 * 错误消息提示 (继承自Quick.info)
 * @example Quick.error('hello world', options)
 * @param {String} message
 * @param {Object} options
 */
Quick.error = function(message, options) {
  if (!options) {
    options = { duration: 5000 };
  } else
  if (typeof options === 'number') {
    options = { duration: options };
  }
  options.background = 'rgba(217, 37, 7, 0.6)';
  this.info(message, options);
}

// --------------------------------------------------------
// UI组件：弹窗
// --------------------------------------------------------

/**
 * 基础弹窗
 * @example
 * Quick.dialog({
 *   title: 'title',
 *   content: 'hello world',
 *   onload: () => alert('onload')
 *   buttons: [{
 *     label: 'OK',
 *     type: 'primary',
 *     onclick: () => alert('OK')
 *   }, {
 *     label: 'Cancel',
 *     onclick: () => alert('Cancel')
 *   }]
 * })
 * @param {Object} options
 * @returns
 */
Quick.dialog = function(options = {}) {
  // Create element container
  const $instance = $(`
    <div class="quick-overlay quick-dialog">
      <div class="quick-dialog-panel">
        <div class="quick-dialog-body">${options.content}</div>
      </div>
    </div>
  `);

  // Add title to instance
  const panel = $instance.querySelector('.quick-dialog-panel');
  if (options.title) {
    const title = $(`<div class="quick-dialog-header">${options.title}</div>`);
    panel.insertBefore(title, panel.firstChild);
  }

  // Add custom buttons to instance
  if (options.buttons && options.buttons.length > 0) {
    const $footer = $(`<div class="quick-dialog-footer"></div>`);
    panel.appendChild($footer);
    options.buttons.forEach(item => {
      const button = $(`<button class="quick-dialog-button ${item.type || ""}">${item.label}</button>`);
      $footer.append(button);
      button.on('click', () => {
        item.onclick ? item.onclick($instance, button) : $instance.hide()
      })
    })
  }

  // Add hide method to instance
  $instance.hide = () => {
    panel.addClass('quick-scale-out');
    $instance.addClass('quick-fade-out');
    $instance.on('animationend', $instance.remove);
  }

  // Show dialog
  options.onload && options.onload($instance);
  _($instance);
  if (options.animation !== false) {
    panel.addClass('quick-scale-in');
    $instance.addClass('quick-fade-in');
  }
  return $instance;
}

/**
 * 警告弹窗 (继承自Quick.dialog)
 * @example Quick.alert('hello world')
 * @param {String} message
 * @param {Function} callback
 * @returns
 */
Quick.alert = function(message, callback) {
  return this.dialog({
    content: message,
    buttons: [{
      type: 'primary',
      label: Quick.LANGUAGE.OK,
      onclick: function(dialog) {
        callback ? callback(dialog) : dialog.hide();
      }
    }]
  });
}

/**
 * 确认弹窗 (继承自Quick.dialog)
 * @example Quick.confirm('hello world', () =>...)
 * @param {String} message
 * @param {Function} callback
 * @returns
 */
Quick.confirm = function(message, callback) {
  return this.dialog({
    content: message,
    buttons: [{
      label: Quick.LANGUAGE.NO
    }, {
      type: 'primary',
      label: Quick.LANGUAGE.YES,
      onclick: (dialog, button) => {
        callback ? callback(dialog, button) : dialog.hide();
      }
    }]
  });
}

// --------------------------------------------------------
// UI组件：操作列表 (常用于移动端)
// --------------------------------------------------------

/**
 * Quick action sheet component
 * @example
 * const sheet = Quick.actionSheet([
 *   { label: 'Menu One', onclick: () => alert(1) },
 *   { label: 'Menu Two', onclick: () => alert(2) },
 *   { label: 'Menu Three', onclick: () => alert(3) },
 * ])
 * sheet.hide()
 * @param {Array} menus
 * @returns
 */
Quick.actionSheet = function(menus = []) {
  // Create element container
  const $instance = $(`
    <div>
      <div class="quick-overlay"></div>
      <div class="quick-actionsheet"></div>
    </div>
  `);

  // Add click event to overlay
  const $overlay = $instance.querySelector('.quick-overlay');
  $overlay.onclick = () => $instance.hide();

  // Add custom menus to sheet
  const $sheet = $instance.querySelector('.quick-actionsheet');
  menus.push({ label: '取消' });
  menus.forEach(item => {
    let menu = $(`<div class="quick-actionsheet-menu">${item.label}</div>`);
    menu.on('click', e => {
      $instance.hide();
      item.onclick && item.onclick(e);
    });
    $sheet.appendChild(menu);
  });

  // Add hide method to instance
  $instance.hide = () => {
    $overlay.addClass('quick-fade-out');
    $sheet.addClass('quick-slide-down');
    $sheet.on('animationend', () => $instance.remove());
  }

  // Show actionsheet
  _($instance);
  $overlay.addClass('quick-fade-in');
  $sheet.addClass('quick-slide-up');
  return $instance;
}

// --------------------------------------------------------
// UI组件：滑动页面
// --------------------------------------------------------

/**
 * 滑动页面
 * @example
 * const page = Quick.slidingPage(document.querySelector('#id'))
 * page.show()
 * page.hide()
 * @param {Element|String} 元素或HTML字符串
 * @returns
 */
Quick.slidingPage = function(content) {
  const $instance = $(content);

  if (!$instance._paged) {
    $instance._paged = true;
    $instance.addClass('quick-overlay');
    $instance.display = getComputedStyle($instance, null)['display'];
    $instance.style.display = 'none';

    $instance.show = function() {
      $instance.style.display = this.display;
      this.removeClass('quick-slide-right');
      this.addClass('quick-slide-left');
      return this;
    }
    $instance.hide = function() {
      this.removeClass('quick-slide-left');
      this.addClass('quick-slide-right');
      return this;
    }
  }
  return $instance;
}

// --------------------------------------------------------
// UI组件：日期选择器
// --------------------------------------------------------

/**
 * 日期选择器
 * @example new Quick.DatePicker('input');
 * @param {Element|String} target
 * @returns
 */
Quick.DatePicker = class {

  constructor(target) {
    this.$target = $(target);
    this.$target.readOnly = true;
    this.$target.className = 'quick-datepicker-target';

    // 点击目标元素
    this.$target.on('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.render(this.getInitDate());
        const pos = this.$target.getBoundingClientRect();
        this.$wrapper.style.top = pos.y + pos.height + 2 + 'px';
        this.$wrapper.style.left = pos.x + 'px';
      }
    });
  }

  /** 组件UI渲染 */
  render(date) {
    if (!this.isOpen) {
      this.$overlay = $('<div class="quick-overlay" style="background:none"></div>')
      this.$overlay.on('click', e => this.close());
      _(this.$overlay);

      this.$wrapper = $('<div class="quick-datepicker-wrapper"></div>')
      this.bindEvents();
      _(this.$wrapper);
      this.isOpen = true;
    }
    this.createHtml(date);
  }

  /** 创建HTML */
  createHtml(date) {
    const data = this.calData = this.getCalendarData(date);
    let html = '<div class="quick-datepicker-header">' +
      '<svg class="quick-datepicker-btn prev-year" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.984 7l4.75 4.762-.832.817-3.924-3.924-3.99 3.99-.825-.836L7.973 7l.005.006L7.984 7zm0-4l4.75 4.762-.832.817-3.924-3.924-3.99 3.99-.825-.836L7.973 3l.005.006L7.984 3z" transform="rotate(-90 7.949 7.822)"></path></svg>' +
      '<svg class="quick-datepicker-btn prev-month" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.978 11.997l-.005.006L2.3 6.33l.83-.831 4.848 4.848L12.826 5.5l.83.83-5.673 5.673-.005-.006z" transform="rotate(90 7.978 8.751)"></path></svg>' +
      '<span class="quick-datepicker-text">' + data.year + '-' + this.padding(data.month) + '</span>' +
      '<svg class="quick-datepicker-btn next-month" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.978 11.498l-.005.005L2.3 5.831 3.13 5l4.848 4.848L12.826 5l.83.831-5.673 5.672-.005-.005z" transform="rotate(-90 7.978 8.252)"></path></svg>' +
      '<svg class="quick-datepicker-btn next-year" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.984 7l4.75 4.762-.832.817-3.924-3.924-3.99 3.99-.825-.836L7.973 7l.005.006L7.984 7zm0-4l4.75 4.762-.832.817-3.924-3.924-3.99 3.99-.825-.836L7.973 3l.005.006L7.984 3z" transform="rotate(90 7.949 8.122)"></path></svg>' +
      '</div><div class="quick-datepicker-body"><table>' +
      '<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>' +
      '<tbody>';

    const today = new Date();
    const initDate = this.getInitDate();

    for (let i = 0; i < data.days.length; i++) {
      if (i % 7 === 0) html += '<tr>';

      const cellDay = data.days[i];
      let clazz = '';
      if (data.month != cellDay.month) clazz = 'minor';
      if (data.year == initDate.getFullYear() && cellDay.month == initDate.getMonth() + 1 && cellDay.day == initDate.getDate()) clazz = 'curr';
      if (data.year == today.getFullYear() && cellDay.month == today.getMonth() + 1 && cellDay.day == today.getDate()) clazz = 'today';
      html += '<td><div data-index="' + cellDay.index + '" class="' + clazz + '">' + cellDay.day + '</div></td>';

      if (i % 7 === 6) html += '</tr>';
    }
    html += '</tbody></table></div>';
    this.$wrapper.innerHTML = html;
  }

  /** 绑定监听事件 */
  bindEvents() {
    // 点击日期选择器
    this.$wrapper.on('click', e => {
      const $target = e.target;

      // 点击日历格中的日期
      if ($target.parentNode.tagName === 'TD') {
        const date = new Date(this.calData.year, this.calData.month - 1, $target.dataset.index);
        this.$target.value = this.format(date);
        this.close();
      }

      // 点击标题回到初始日期
      const $currText = this.$wrapper.querySelector('.quick-datepicker-text');
      if ($currText.contains($target)) {
        return this.render(this.getInitDate());
      }

      // 点击上下月/上下年按钮
      const $prevYear = this.$wrapper.querySelector('.prev-year');
      const $prevMonth = this.$wrapper.querySelector('.prev-month');
      const $nextMonth = this.$wrapper.querySelector('.next-month');
      const $nextYear = this.$wrapper.querySelector('.next-year');
      const currDate = new Date($currText.innerHTML);

      if ($prevYear.contains($target)) {
        currDate.setFullYear(currDate.getFullYear() - 1);
      } else if ($prevMonth.contains($target)) {
        currDate.setMonth(currDate.getMonth() - 1);
      } else if ($nextMonth.contains($target)) {
        currDate.setMonth(currDate.getMonth() + 1);
      } else if ($nextYear.contains($target)) {
        currDate.setFullYear(currDate.getFullYear() + 1);
      } else {
        return;
      }
      this.render(currDate);
    });
  }

  close() {
    this.$overlay.remove();
    this.$wrapper.remove();
    this.isOpen = false;
  }

  /** 日期格式化 */
  format(date) {
    return date.getFullYear() + '-' + this.padding(date.getMonth() + 1) + '-' + this.padding(date.getDate());
  }

  /** 前缀补零 */
  padding(n) {
    return n <= 9 ? '0' + n : n;
  }

  /** 根据目标元素的值获取初始日期 */
  getInitDate() {
    return this.$target.value ? new Date(this.$target.value) : new Date();
  }

  /** 获取指定日期的日历格数据 */
  getCalendarData(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // 当前月的第一天
    const firstDay = new Date(year, month - 1, 1);
    // 当前月的最后一天
    const lastDay = new Date(year, month, 0).getDate();
    // 当前月第一天是星期几（用于判断第一天所在列）
    let firstWeekDay = firstDay.getDay();
    if (firstWeekDay === 0) firstWeekDay = 7;
    const weekdayIndex = firstWeekDay - 1;
    // 上个月的最后一天（用于填充当前月第一天之前的日期）
    const lastDayOfLastMonth = (new Date(year, month - 1, 0)).getDate();

    const days = [];
    for (let i = 0; i < 7 * 6; i++) {
      const index = i + 1 - weekdayIndex;
      let day = index;
      let realMonth = month;

      if (index <= 0) { //上一月
        realMonth = month - 1;
        day = lastDayOfLastMonth + index;
      } else if (index > lastDay) { //下一月
        realMonth = month + 1;
        day = day - lastDay;
      }
      if (realMonth === 0) realMonth = 12;
      if (realMonth > 12) realMonth = 1;
      days.push({ month: realMonth, day, index });
    }
    return { year, month, days };
  }
}

// --------------------------------------------------------
// UI扩展：可增减行表格
// --------------------------------------------------------

/**
 * 可增减行表格
 * 新行自动清空不带 reserved 属性的 input 元素值
 * @param selector 表格元素
 * @param startIndex 起始索引（例如可忽略表头）
 */
Quick.FlexTable = class {
  constructor(selector, startIndex = 0) {
    this.$table = $(selector);
    this.createHandlers(startIndex);
  }

  createHandlers(startIndex) {
    const rows = Array.from(this.$table.rows);
    rows.forEach((row, index) => {
      // 每行增加第一列用于放置操作图标
      const cell = row.insertCell(0);
      cell.style.overflow = 'initial';
      cell.style.padding = 0;;
      cell.style.width = '50px';
      // 行索引小于起始行不作其他处理
      if (index < startIndex) return;

      // 所有行均设置 +/- 按钮
      const minusIcon = this.createMinusIcon(row);
      minusIcon.style.visibility = 'hidden';
      cell.appendChild(minusIcon);

      const plusIcon = this.createPlusIcon();
      plusIcon.onclick = () => this.addRow(row);
      cell.appendChild(plusIcon);

      // 针对可删除行绑定事件
      const deletable = row.getAttribute('deletable');
      if (deletable == '' || deletable == 'true') {
        minusIcon.style.visibility = 'visible';
        minusIcon.onclick = () => this.removeRow(row);
      }
    })
  }

  addRow(row) {
    // 深度克隆当前行（该方法不会克隆 addEventListener 或 node.onclick 动态绑定的事件）
    const cloneRow = row.cloneNode(true);

    // 清空克隆行中不带 reserved 属性的input字段
    const fields = cloneRow.querySelectorAll('input[type="text"]:not([reserved]),input[type="hidden"]:not([reserved])');
    fields.forEach(field => field.value = '');

    // 移除克隆行中带 removed 属性的元素
    const elements = cloneRow.querySelectorAll('[removed]');
    elements.forEach(el => el.remove());

    // 克隆行 +/- 按钮重新绑定事件
    const minusIcon = cloneRow.querySelector('div:first-child');
    minusIcon.style.visibility = 'visible';
    minusIcon.onclick = () => this.removeRow(cloneRow);

    const plusIcon = cloneRow.querySelector('div:last-child');
    plusIcon.onclick = () => this.addRow(cloneRow);

    // 在当前行之后插入克隆行
    this.insertAfter(cloneRow, row);
  }

  removeRow(row) {
    if (this.onRowRemove) {
      this.onRowRemove(row);
    } else {
      row.remove();
    }
  }

  createPlusIcon() {
    return this.createIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24"><path fill="var(--primary-color)" d="M978 162c0-64-52-116-116-116H162C98 46 46 98 46 162v700c0 64 52 116 116 116h700c64 0 116-52 116-116zM768 563H563v205H461V563H256V461h205V256h102v205h205z"/></svg>');
  }

  createMinusIcon() {
    return this.createIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24"><path fill="#999" d="M978 162c0-64-52-116-116-116H162C98 46 46 98 46 162v700c0 64 52 116 116 116h700c64 0 116-52 116-116zM768 563H256V461h512z"/></svg>');
  }

  createIcon(svg) {
    const icon = document.createElement('div');
    icon.style.display = 'inline-flex';
    icon.style.verticalAlign = 'middle';
    icon.style.cursor = 'pointer';
    icon.innerHTML = svg;
    return icon;
  }

  insertAfter(newNode, refNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
}

// --------------------------------------------------------
// UI扩展：附件上传下载
// --------------------------------------------------------

/**
 * 附件上传下载
 * @param selector {string|Element} 放置位置
 * @param list {Array} 附件列表数据
 * @param options { maxSize, mimeTypes } 配置项
 * - maxSize {number} 最大允许体积（MB）
 * - mimeTypes {string} 可接受的附件类型
 */
Quick.Attachment = class {

  constructor(selector, list, options) {
    this.editable = !!options; // 带 options 参数说明是可编辑的
    this.$target = $(selector);
    this.$wrapper = $(`<div class="attachment"></div>`);
    this.$target.appendChild(this.$wrapper);

    if (this.editable) {
      const mimeTypes = options.mimeTypes || '*.*';
      this.maxSize = options.maxSize || 10;

      this.$wrapper.appendChild($(`<div><input type="file" accept="${mimeTypes}" multiple/><a>上传附件</a></div>`));
      const $inputFile = this.$wrapper.querySelector('input[type="file"]');
      $inputFile.on('change', e => this.upload(e))
      const $button = this.$wrapper.querySelector('input[type="file"]+a');
      $button.on('click', () => $inputFile.click())
    }

    this.$fileList = $(`<div class="file-list"></div>`);
    this.$wrapper.appendChild(this.$fileList);
    this.build(list);
  }

  build(list) {
    list = list || [];
    for (const attachment of list) {
      const dlUrl = attachment.filePath.replace(/^\/attachment\//, '/download/');
      const $icon = this.editable ? '<img class="icon cross" src="/images/cross.png" title="删除"/>' : '';
      const $item = $(`<div class="item">
        <a target="_blank" href="${attachment.filePath}">${attachment.originalName}</a>
        <a href="${dlUrl}" download="${attachment.originalName}"><img class="icon" src="/images/down.png" title="下载"/></a>
        ${$icon}
        <input type="hidden" name="attachmentId" value="${attachment.attachmentId}"/>
        <input type="hidden" name="filePath" value="${attachment.filePath}"/>
        <input type="hidden" name="originalName" value="${attachment.originalName}"/>
        <input type="hidden" name="state" value="${attachment.state.code}"/>
      </div>`);

      const $cross = $item.querySelector('img.cross');
      if ($cross) $cross.on('click', e => this.delete(e));
      this.$fileList.appendChild($item);
    }
  }

  upload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 9) {
      return Quick.error('一次最多上传9个附件');
    }
    for (const file of files) {
      if (file.size > this.maxSize * 1024 * 1024)
        return Quick.error('请将附件大小控制在' + this.maxSize + 'MB以内，确实无法精简时可以（但不推荐）采用分卷压缩方式上传');
    }
    const fd = new FormData();
    for (const file of files) {
      fd.append('files', file);
    }

    const $loading = $('<div class="loading"></div>');
    this.$fileList.appendChild($loading);
    Quick.http.post(Quick.ATTACHMENT_API, fd).then(list => {
      $loading.remove();
      if (list) {
        Quick.success('上传成功');
        this.build(list);
      }
    });
  }

  delete(e) {
    const $item = e.target.parentNode;
    const data = Quick.form.getJsonObject($item);

    Quick.confirm('确定删除该附件吗？', (confirm, button) => {
      if (data.state == 1) {
        confirm.hide();
        $item.querySelector('[name="state"]').value = -1;
        $item.style.display = 'none';
        return;
      }
      button.disable();
      Quick.http.del(Quick.ATTACHMENT_API, data).then(res => {
        button.enable();
        if (res) {
          confirm.hide();
          Quick.success('删除成功');
          $item.remove();
        }
      })
    });
  }

  list() {
    const $items = this.$wrapper.querySelectorAll('.file-list div');
    return Quick.form.getJsonArray($items);
  }
}

// --------------------------------------------------------
// 常用工具方法
// --------------------------------------------------------

Quick.util = {
  /**
   * 保留数值精度
   * @param number 数值
   * @param precision 小数点位数
   */
  round(number, precision) {
    return Math.round(number + 'e' + precision) / Math.pow(10, precision);
  },

  /**
   * 将对象转换为查询字符串
   * @param params 参数对象
   */
  stringify(params) {
    return Object.keys(params).map(key => key + '=' + encodeURI(params[key])).join('&');
  },

  /**
   * 将文本内容复制到剪贴板
   * @param text 文本内容
   */
  copyText(text) {
    const clipboard = navigator.clipboard;
    if (!clipboard) return Quick.error('浏览器不支持剪贴板');

    clipboard.writeText(text).then(
      () => Quick.success('复制成功'),
      () => Quick.error('复制失败')
    );
  }
}

// --------------------------------------------------------
// 表单验证和解析
// --------------------------------------------------------

Quick.form = {
  /**
   * 将带有name属性的元素数据解析为JSON对象
   * @param scope 获取范围
   */
  getJsonObject(scope) {
    scope = $(scope);
    const fields = scope.querySelectorAll('[name]:not([name=""])');
    const data = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if ((field.type == 'checkbox' || field.type == 'radio') && !field.checked) continue;

      // 去除输入值空格
      let value = '';
      if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
        value = field.value = field.value.trim();
      } else
      if (field.tagName === 'SELECT') {
        value = field.options[field.selectedIndex].value;
      } else
      if (field.isContentEditable) {
        value = field.innerHTML = field.innerHTML.trim();
      } else {
        value = field.textContent = field.textContent.trim();
      }

      // 数据校验
      let required = field.getAttribute('required');
      required = (required === null || required === 'false') ? false : true;
      if (!this.validate(value, required, field.dataset.rule)) {
        field.focus();
        Quick.error(field.dataset.message || '光标处数据不能为空或输入格式有误');
        return;
      }

      // 设置返回对象的键值
      const name = field.getAttribute('name');
      if (data[name]) {
        data[name] += ',' + value;
      } else {
        data[name] = value;
      }
    }
    return data;
  },

  /**
   * 将带name属性的一组元素解析为JSON数组
   * @param scopes 数组内每组对象的获取范围
   */
  getJsonArray(scopes) {
    const array = [];
    scopes = $(scopes, true);

    for (let i = 0; i < scopes.length; i++) {
      const obj = this.getJsonObject(scopes[i]);
      if (!obj) return; // !important
      if (Object.keys(obj).length !== 0) {
        array.push(obj);
      }
    }
    return array;
  },

  /**
   * 数据校验
   * @param value 数据值
   * @param required 是否必填
   * @param rule 数据规则
   */
  validate(value, required, rule) {
    if (required && !value) return false; // 必填但空值，校验失败
    if (!rule) return true; // 无规则，视为成功
    if (!value) return true; // 空值无需校验，视为成功

    const matches = rule.match(/^(?<type>[a-z0-9]+)(\((?<min>\-?\d+)(,\s*(?<max>\-?\d+))?\))?$/);
    if (!matches) return true; // 有规则但格式不匹配，视为成功（相当于无规则）

    const groups = matches.groups;
    const fn = this.validator[groups.type];
    if (!fn) return true; // 有规则但找不到预设的校验方法，视为成功（相当于无规则）

    return fn(value, groups.min, groups.max); // 由预设的校验方法判断
  },

  /**
   * 常用类型验证器
   */
  validator: {
    // 字符串格式
    varchar: function(value, min, max) {
      if (!max) { max = min, min = 0; }
      const pattern = new RegExp('^.{' + min + ',' + max + '}$');
      return pattern.test(value);
    },

    // 整数格式：m为整数位，允许负数
    integer: function(value, m) {
      const pattern = new RegExp('^\\-?\\d{0,' + m + '}$');
      return pattern.test(value);
    },

    // 数字格式：m为整数位，d为小数位，允许负数
    decimal: function(value, m, d) {
      const pattern = new RegExp('^\\-?\\d{0,' + m + '}(\\.\\d{0,' + d + '})?$');
      return pattern.test(value);
    },

    // 日期格式：yyyy-MM-dd
    date: function(value) {
      const m = value.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
      if (m) {
        const d = new Date(m[1], m[2] - 1, m[3]);
        return d.getFullYear() == m[1] && d.getMonth() == m[2] - 1 && d.getDate() == m[3];
      }
      return false;
    }
  }
}

// --------------------------------------------------------
// HTTP请求方法集
// @example Quick.http.get('/user').then(res => ...)
// --------------------------------------------------------

Quick.http = {
  get(url) {
    return this.request('GET', url);
  },

  post(url, data) {
    return this.request('POST', url, data);
  },

  put(url, data) {
    return this.request('PUT', url, data);
  },

  del(url, data) {
    return this.request('DELETE', url, data);
  },

  async request(method, url, data) {
    const options = { method, headers: {}, body: data };

    if (Object.prototype.toString.call(data) != '[object FormData]') {
      options.headers['content-type'] = 'application/json; charset=utf-8';
      options.body = JSON.stringify(data);
    }
    try {
      const res = await (await fetch(url, options)).json();
      return res.error && res.message && res.status && res.status >= 400 ?
        Quick.error(res.message) : res;
    } catch (e) {
      Quick.error('网络连接异常');
    }
  }
}
