document.head.insertAdjacentHTML("beforeend", `
<style>
[class^="toast-"] {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -moz-user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  line-height: normal;
}
.toast-mask {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.toast-transparent {
  position: absolute;
  z-index: 2000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.toast-input-target {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='lightgray' d='M10.9 3.2H5.1v1.6H3.9V3.2H1.2v3.2h13.6V3.2h-2.7v1.6h-1.2V3.2zM12.1 2H15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2.9V.4h1.2V2h5.8V.4h1.2V2zm2.7 5.6H1.2v7.2h13.6V7.6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: top 49% right 15px;
  background-size: 16px;
}
.toast-dropdown-wrapper {
  position: absolute;
  z-index: 2001;
  color: #666;
  font-size: 13px;
  background: #fff;
  box-shadow: 0 0 16px rgb(0 0 0 / 8%);
  user-select: none;
}
.toast-dropdown-option {
  padding: 5px 20px;
  cursor: pointer;
  transition: .3s all;
}
.toast-dropdown-option:hover, .toast-dropdown-option.selected {
  background: #eee;
}
</style>`);

// const Toast = {};

Toast.getElement = function(selector) {
  return typeof selector === 'string' ? document.querySelector(selector) : selector;
}

Toast.createElement = function(html) {
  html = html.replace(/[\t\r\n]/mg, "").trim();
  const fragment = document.createRange().createContextualFragment(html);
  return fragment.firstChild;
}

Toast.removeElement = function(element) {
  element.parentNode && element.parentNode.removeChild(element);
}

Toast.bindElement = function(source, target) {
  const pos = target.getBoundingClientRect();
  source.style.position = 'absolute';
  source.style.top = pos.y + pos.height + 2 + 'px';
  source.style.left = pos.x + 'px';
}

/**
 * Toast Dropdown
 * @example new Toast.Dropdown('input');
 */
Toast.Dropdown = class {

  /** 构造函数 */
  constructor(target, options) {
    this.$target = Toast.getElement(target);
    this.$target.readOnly = true;
    this.$target.className = 'toast-input-target';

    // 点击目标元素
    this.$target.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.render(options);
        Toast.bindElement(this.$wrapper, this.$target);
      }
    });
  }

  /** 组件UI渲染 */
  render(options) {
    this.$mask = Toast.createElement('<div class="toast-transparent"></div>');
    this.$mask.addEventListener('click', e => this.close());
    document.body.appendChild(this.$mask);

    this.$wrapper = Toast.createElement('<div class="toast-dropdown-wrapper"></div>');
    this.$wrapper.innerHTML = this.createHtml(options);
    this.bindEvents();
    document.body.appendChild(this.$wrapper);

    this.isOpen = true;
  }

  /** 创建HTML */
  createHtml(options) {
    let html = '';
    for (const opt of options) {
      html += `<div class="toast-dropdown-option ${opt.selected?'selected':''}">${opt.desc}</div>`;
    }
    return html;
  }

  /** 绑定监听事件 */
  bindEvents() {
    this.$wrapper.addEventListener('click', e => {
      const $target = e.target;
      if ($target.tagName === 'DIV') {
        this.$target.value = $target.innerHTML;
        this.close();
      }
    });
  }

  close() {
    Toast.removeElement(this.$mask);
    Toast.removeElement(this.$wrapper);
    this.isOpen = false;
  }
}
