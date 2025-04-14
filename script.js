document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const projectSections = document.querySelectorAll(".projects");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      tabButtons.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Hide all project sections
      projectSections.forEach(section => section.classList.add("hidden"));
      
      // Show the selected section
      const tab = btn.getAttribute("data-tab");
      document.getElementById(tab).classList.remove("hidden");
    });
  });
});
