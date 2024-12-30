# install

Always use the `netlify` cdn.

## To Include The Plugin In The HTML File

### For Version 2 (v2)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn-data-react.netlify.app/js/data-react-v2.js"></script>
  </head>
  <body></body>
</html>
```

### For Version 3 (v3)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn-data-react.netlify.app/js/data-react-v3.js"></script>
  </head>
  <body></body>
</html>
```

This allows you to include external HTML files directly within the `body` of your document by specifying the file path in the `data-include-html` or `react-import` attribute.

# data-react

`data-react` is an HTML plugin for including external HTML files and mapping JavaScript arrays, similar to React.js functionality.

## To Include an HTML File

### For Version 2 (v2)

```html
<body>
  <div data-include-html="./templates/template"></div>
</body>
```

### For Version 3 (v3)

```html
<body>
  <div react-import="./templates/template"></div>
</body>
```

This allows you to include external HTML files directly within the `body` of your document by specifying the file path in the `data-include-html` or `react-import` attribute.

## To Map an Array

### JavaScript Array

```js
const ulData = [
  { href: "/home", text: "home" },
  { href: "/about", text: "about" },
  { href: "/contact", text: "contact" },
];
```

### For Version 2 (v2)

```html
<ul data-react="map(ulData)" class="flex gap-8 items-center">
  <li data-map>
    <a href="{href}">{text}</a>
  </li>
</ul>
```

### For Version 3 (v3)

```html
<ul react="ulData" class="flex gap-8 items-center">
  <li>
    <a href="{href}">{text}</a>
  </li>
</ul>
```

This maps over the `ulData` array, dynamically generating `li` elements based on the values in the array.

## To Output Data Conditionally

### JavaScript Data

```js
const cardData = [
  {
    title: "title 1",
    subTitle: `Film and other media. In film, examples of subtitles using "or" include Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb and Birdman or (The Unexpected Virtue of Ignorance).`,
    src: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg",
    alt: "image",
    h3: "developer afsin",
    p2: "author",
    author: true,
    freelancer: false,
  },
  {
    title: "title 2",
    subTitle: `Film and other media. In film, examples of subtitles using "or" include Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb and Birdman or (The Unexpected Virtue of Ignorance).`,
    src: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg",
    alt: "image",
    h3: "developer afsin",
    p2: "author",
    author: true,
    freelancer: true,
  },
  {
    title: "title 3",
    subTitle: `Film and other media. In film, examples of subtitles using "or" include Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb and Birdman or (The Unexpected Virtue of Ignorance).`,
    src: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg",
    alt: "image",
    h3: "developer afsin",
    p2: "author",
    author: false,
    freelancer: false,
  },
];
```

### HTML Structure

### For Version 2 (v2)

```html
<div class="m-4">
  <div data-react="map(cardData)" class="grid gap-4 grid-cols-3">
    <div data-map class="bg-blue-300/80 p-4 rounded-xl">
      <div class="grid gap-2">
        <h2 class="text-xl text-slate-800 capitalize">{title}</h2>
        <p class="text-sm text-slate-600">{subTitle}</p>
      </div>

      <div
        class="flex gap-2 items-center m-4 { freelancer ? 'bg-green-100/80 border border-2 border-red-500' : 'bg-gray-100/80' } p-4 rounded-xl"
      >
        <img
          src="{src}"
          alt="{alt}"
          class="rounded-full w-14 h-14 object-cover object-center"
        />

        <div>
          <h3 class="capitalize text-slate-600">{h3}</h3>
          <p class="capitalize text-slate-400">{p2}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### For Version 3 (v3)

```html
<div class="m-4">
  <div react="cardData" class="grid gap-4 grid-cols-3">
    <div class="bg-blue-300/80 p-4 rounded-xl">
      <div class="grid gap-2">
        <h2 class="text-xl text-slate-800 capitalize">{title}</h2>
        <p class="text-sm text-slate-600">{subTitle}</p>
      </div>

      <div
        class="flex gap-2 items-center m-4 { freelancer ? 'bg-green-100/80 border border-2 border-red-500' : 'bg-gray-100/80' } p-4 rounded-xl"
      >
        <img
          src="{src}"
          alt="{alt}"
          class="rounded-full w-14 h-14 object-cover object-center"
        />

        <div>
          <h3 class="capitalize text-slate-600">{h3}</h3>
          <p class="capitalize text-slate-400">{p2}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

This example maps over `cardData` and generates HTML conditionally based on the `author` and `freelancer` properties. It includes an image, text content, and conditional buttons based on the data attributes.

- The `freelancer` key controls the style of the card, applying different styles based on its value.
- The `author` key toggles the visibility of a section based on its value, hiding content when the condition is `false`.

### JavaScript Data

```js
const contentData = [
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: false,
  },
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: true,
  },
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: false,
  },
];
const contentData2 = [
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: true,
  },
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: true,
  },
  {
    img: "https://static.vecteezy.com/system/resources/previews/036/226/872/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg",
    right: false,
  },
];

const ul1 = [{ tx1: "technology" }, { tx1: "flowers" }, { tx1: "mountain" }];
```

### TO USE REUSABLE EXTERNAL HTML File

### For Version 2 (v2)

```html
<div>
  <div data-include-html="./templates/content" data="contentData"></div>

  <div class="p-4 bg-red-500">
    <div data-include-html="./templates/content" data="contentData2"></div>
  </div>
</div>

<div>
  <div data-include-html="./templates/ul1" data="ul1"></div>
</div>
```

### For Version 3 (v3)

```html
<div>
  <div react-import="./templates/content" data="contentData"></div>

  <div class="p-4 bg-red-500">
    <div react-import="./templates/content" data="contentData2"></div>
  </div>
</div>

<div>
  <div react-import="./templates/ul1" data="ul1"></div>
</div>
```

### Main HTML

In the main HTML file, you'll reference external HTML templates using the `data-include-html` (v2) or `react-import` (v3) attribute. The `data` attribute will pass dynamic data (e.g., `contentData` and `contentData2`) to the template.

### template

### For Version 2 (v2)

```html
<div>
  <div data-react="map(propsData)">
    <div data-map class="m-4 p-10 py-20 grid gap-4 grid-cols-2 bg-gray-100">
      <div class="bg-blue-300 p-4 { right ? 'order-2' : '' }">
        <img src="{img}" alt="image" />
      </div>

      <div class="bg-red-300 p-4 { right ? 'order-1' : '' }"></div>
    </div>
  </div>
</div>
```

### For Version 3 (v3)

```html
<div>
  <div react="data">
    <div class="m-4 p-10 py-20 grid gap-4 grid-cols-2 bg-gray-100">
      <div class="bg-blue-300 p-4 { right ? 'order-2' : '' }">
        <img src="{ img }" alt="image" />
      </div>

      <div class="bg-red-300 p-4 { right ? 'order-1' : '' }"></div>
    </div>
  </div>
</div>
```

### External HTML Template (e.g., content.html)

This external template file is where the dynamic data will be injected. The `data-react="map(propsData)"` (v2) or `react="data"` (v3) indicates the area where the data should be mapped, and the `data-map` (v2) or `{right}` (v3) attribute identifies elements that will receive the data.

### Summary

This `.md` file contains a description of the `data-react` HTML plugin along with usage examples for including HTML files, mapping arrays, and conditionally rendering data for both v2 and v3 of the plugin. It demonstrates
