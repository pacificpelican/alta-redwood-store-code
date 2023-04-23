export default function reloadOnce() {
  console.log("about to reload");
  if (typeof window !== 'undefined') {
    return window.location.reload();
  }
}
