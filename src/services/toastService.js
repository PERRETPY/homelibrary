export default class ToastService {
    constructor() {
        this.toastList = [];
        this.toastStackCSS = [];
    }
    static getInstance() {
        if(this.instance == null){
            this.instance = new ToastService();
        }
        return this.instance;
    }
    show(message, className) {
        this.toastList.push({message: message, class: className});
        this.toastStackCSS.push("top: " + 75*this.toastList.length + "px");
    }
    remove(toast) {
        this.toastList = this.toastList.filter(t => t !== toast);
    }
    clear() {
        this.toastList.splice(0, this.toastList.length);
    }
}
