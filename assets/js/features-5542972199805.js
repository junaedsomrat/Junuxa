  document.getElementById("year").textContent=new Date().getFullYear();
  
  const toggle=document.getElementById("menuToggle");
  const navLinks=document.getElementById("navLinks");
  toggle.addEventListener("pointerdown",(e)=>{ 
    e.preventDefault(); 
    toggle.classList.toggle("active"); 
    navLinks.classList.toggle("active"); 
  });