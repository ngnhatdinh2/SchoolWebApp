const navItems = document.querySelectorAll("a.nav-item");
const handleHover =(item)=>{
    return () =>{
        item.classList="nav-item"
        setTimeout(()=>{item.classList.add("step-1")},50)
        setTimeout(()=>{item.classList.add("step-2")},100)
        setTimeout(()=>{item.classList.add("step-3")},100)
        setTimeout(()=>{item.classList.add("step-4")},200)
    }
}
const  handleMouseOut = (item)=>{
    return ()=>{
        setTimeout(()=>{item.classList.remove("step-4")},50)
        setTimeout(()=>{item.classList.remove("step-3")},100)
        setTimeout(()=>{item.classList.remove("step-2")},100)
        setTimeout(()=>{item.classList.remove("step-1")},200)
        setTimeout(()=>{item.classList ="nav-item"},200)
    }
}
const handleClick = (event)=>{
    let x = event.clientX;
    let y = event.clientY;
    console.log(x, y)
    const abc = document.querySelector("#abc");
    abc.classList.add("activee");
    abc.style.top = y + "px";
    abc.style.left = x + "px"; 
    console.log(abc.style.top);
    abc.style.visibility = "visible"; 
}
navItems.forEach(item => {

    item.addEventListener("mouseover", handleHover(item))
    item.addEventListener("mouseout", handleMouseOut(item))
    item.addEventListener("click", handleClick)
})