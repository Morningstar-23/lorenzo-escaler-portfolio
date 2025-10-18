import EventEmitter from "events";
import { lightPosition } from "three/src/nodes/TSL.js";

export default class Theme extends EventEmitter{
    constructor(){
        super();
        
        this.theme = "light";

        this.toggleButton = document.querySelector(".toggle-button")
        this.toggleCircle = document.querySelector(".toggle-circle")

        this.setEventListerners();
    }

    setEventListerners(){
        this.toggleButton.addEventListener("click", ()=> {
            this.toggleCircle.classList.toggle("slide");
            this.theme = this.theme ==="light" ? "dark" : "light";
            document.body.classList.toggle("dark-theme");
            document.body.classList.toggle("light-theme");
            // console.log(this.theme);
            
            this.emit("switch", this.theme);
        });
    }

}