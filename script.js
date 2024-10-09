const navInfo = {
  href: "/",
  ul: ["about", "contact", "blogs"].map((itm) => ({
    ulHref: `./${itm}.html`,
    tx: itm,
  })),
};

function handleMenuClose(order) {
  alert(order);
}
