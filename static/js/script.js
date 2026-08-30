console.log('shopnil')
function toggleMenu(event){
    const left_side_drwer = document.getElementById('mobile-menu-drawer')
    const Backdrop_overlay = document.getElementById('mobile-menu-overlay')
    left_side_drwer.classList.toggle('-translate-x-full')

    Backdrop_overlay.classList.toggle('hidden')
    Backdrop_overlay.classList.toggle('opacity-0')
}