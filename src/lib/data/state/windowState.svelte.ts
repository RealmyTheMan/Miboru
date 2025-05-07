export const windowState = $state({
  width: window.innerWidth || 0,
  height: window.innerWidth || 0,
});

window.addEventListener("resize", () => {
  windowState.width = window.innerWidth;
  windowState.height = window.innerHeight;
});
