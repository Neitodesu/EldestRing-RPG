export function sleep(ms) {
  return new Promise((resolve) => {
    console.log('Starting Animation');
    setTimeout(resolve, ms);
  });
}

export async function fadeAnimation() {
  return;
}
