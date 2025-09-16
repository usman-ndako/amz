// // lib/toast.ts
// export function showToast(message: string, type: "success" | "error" | "info" = "info") {
//   const toastContainer = document.getElementById("app-toast");
//   if (!toastContainer) return;

//   const toast = document.createElement("div");
//   toast.className = `alert alert-${type}`;
//   toast.innerHTML = `
//     <span>${message}</span>
//     <button class="btn btn-ghost btn-xs ml-2">✕</button>
//   `;

//   // Remove on click
//   toast.querySelector("button")?.addEventListener("click", () => toast.remove());

//   // Auto remove after 3s
//   setTimeout(() => toast.remove(), 3000);

//   toastContainer.appendChild(toast);
// }

// lib/toast.ts
export function showToast(
  message: string,
  type: "success" | "error" | "info" = "info"
) {
  const toastContainer = document.getElementById("app-toast");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `alert alert-${type} shadow-lg mb-2 opacity-0 transform translate-y-4 transition-all duration-300 flex items-center justify-between`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      ${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      <span>${message}</span>
    </div>
    <button class="btn btn-ghost btn-xs">✕</button>
  `;

  // Close button
  toast.querySelector("button")?.addEventListener("click", () => toast.remove());

  toastContainer.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-4");
  });

  // Auto remove after 3s
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-4");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
