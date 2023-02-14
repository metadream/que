# Heatmap Calendar
A super lightweight library for heatmap calendar.

```js
const heatmap = new Heatmap({
  data: {
    "2019/10/10": {
      "url": "https://github.com",
      "title": "example"
    }
  },
  lang: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    days: ["日", "一", "二", "三", "四", "五", "六"]
  },
  lattice: {
    size: 12,
    spacing: 3,
    color: '#ddd',
    highlightColor: '#cd4230'
  }
})

el.innerHTML = heatmap.toSVG()
```

# Toast UI Framework
A lightweight UI framework for toast componets.

## Installation
```
<script src="toast.js"></script>
```

## Simple Usage

- **Tooltip**
```html
<div toast-tooltip="hello world"></div>
```

- **Loading**
```js
Toast.loading.start()
setTimeout(() => {
  Toast.loading.done();
}, 3000);
```

- **Progess**
```js
Toast.progress.start();
setTimeout(() => {
  Toast.progress.done();
}, 3000);
```

- **Message**
```js
Toast.info("hello world");
Toast.success("hello world");
Toast.error("hello world");
```

- **Dialog**
```js
Toast.alert("hello world");

Toast.confirm("hello world?", () => {
  console.log("OK");
});

const dialog = Toast.dialog({
  content: "hello world",
  buttons: [{
    label: "OK",
    type: "primary",
    onclick: () => alert("OK")
  }, {
    label: "Cancel",
    onclick: () => alert("Cancel")
  }]
});
dialog.hide();
```

- **Action Sheet**
```js
const sheet = Toast.actionSheet([
  { label: "Menu One", onclick: () => alert(1) },
  { label: "Menu Two", onclick: () => alert(2) },
  { label: "Menu Three", onclick: () => alert(3) },
]);
sheet.hide();
```

- **Sliding Page**
```js
const page = Toast.slidingPage(document.querySelector("#container-id"));
page.show();
page.hide();
```

# Waterfall Layout
A super lightweight library for waterfall layout.

## Usage

```html
<div class="grid">
  <div><br>1</div>
  <div><br><br>2</div>
  <div><br><br><br><br>3</div>
  <div><br>4</div>
  <div><br><br><br>5</div>
  <div><br>6</div>
  <div><br><br>7</div>
  <div><br><br><br><br><br><br>8</div>
  <div><br><br><br><br>9</div>
  <div><br><br><br><br><br>10</div>
</div>
```

```js
const waterfall = new Waterfall('.grid')
waterfall.render()
window.onresize = () => waterfall.render()
```

Or add items dynamically:

```html
<div class="grid"></div>
```

```js
const waterfall = new Waterfall('.grid')
window.onresize = () => waterfall.render()
for (let i = 0; i < 10; i++) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  waterfall.add(div)
}
```

## Precautions

If the item contains an image, you may need to call `render` function again when image loaded.