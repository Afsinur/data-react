Here is a `.md` file with the content you provided, formatted appropriately:

````markdown
# data-react

`data-react` is an HTML plugin for including external HTML files and mapping JavaScript arrays, similar to React.js functionality.

## To Include an HTML File

```html
<body>
  <div data-include-html="./templates/template"></div>
</body>
```
````

This allows you to include external HTML files directly within the `body` of your document by specifying the file path in the `data-include-html` attribute.

## To Map an Array

```html
<ul data-react="map(ulData)" class="flex gap-8 items-center">
  <li data-map>
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

      <div class="{ author ? '' : 'hidden'}">
        { freelancer ? '
        <button onclick="alert(1)" class="set('btn')">click me</button>
        ' : ''}
      </div>
    </div>
  </div>
</div>
```

This example maps over `cardData` and generates HTML conditionally based on the `author` and `freelancer` properties. It includes an image, text content, and conditional buttons based on the data attributes.

- The `freelancer` key controls the style of the card, applying different styles based on its value.
- The `author` key toggles the visibility of a section based on its value, hiding content when the condition is `false`.

```

This `.md` file contains a description of the `data-react` HTML plugin along with usage examples for including HTML files, mapping arrays, and conditionally rendering data.
```
