

export async function getCurrentUser() {
  try {
    let res = await fetch("/users/current");
    if (res.ok) {
      return await res.json();;
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/error";
  }
}

