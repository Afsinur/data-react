const navInfo = {
  href: "/",
  ul: ["about", "contact", "blogs"].map((itm) => ({
    ulHref: `./${itm}.html`,
    tx: itm,
  })),
};
const ul = [
  { li: "home" },
  { li: "about" },
  { li: "contact" },
  { li: "blog" },
  { li: "news" },
];

function handleMenuClose(order) {
  alert(order);
}
