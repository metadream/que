/**
 * LaTex Element
 * Depends on https://github.com/ronkok/Temml
 * <script src="https://cdn.jsdelivr.net/gh/ronkok/Temml@0.10.11/dist/temml.min.js"></script>
 * <la-tex>E=mc^2</la-tex>
 */
customElements.define('la-tex', class FormulaElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    new MutationObserver(() => {
      const text = this.textContent;
      const displayMode = this.getAttribute('display') === 'block';
      try {
        this.shadowRoot.innerHTML = temml.renderToString(text, { displayMode, annotate: true });
      } catch (e) {
        this.shadowRoot.innerHTML = '<math><merror><mtext>' + text + '</mtext></merror></math>';
      }
    }).observe(this, {
      characterData: true, childList: true, attributes: true
    });
  }

  attributeChangedCallback(aName, aOld, aNew) {
    if (aName === 'display') {
      if (aNew === null) {
        this.shadowRoot.firstElementChild.removeAttribute(aName);
      } else {
        this.shadowRoot.firstElementChild.setAttribute(aName, aNew);
      }
    }
  }
});
