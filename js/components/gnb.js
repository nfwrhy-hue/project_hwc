export function initGnb(){
    const links = document.querySelectorAll(".gnb_menu a");
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault(); // 스크롤 점프 방지
            links.forEach(item => item.classList.remove("active"));
            e.currentTarget.classList.add("active");
        });
    });
}