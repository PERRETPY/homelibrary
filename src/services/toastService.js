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
        const id = Date.now();
        this.toastList.push({id: id, message: message, class: className});
        this.toastStackCSS.push("top: " + 75*this.toastList.length + "px");

        setTimeout(() => {
            this.toastList = this.toastList.filter(t => t.id !== id);
        }, 5000);

    }
    remove(toast) {
        this.toastList = this.toastList.filter(t => t !== toast);
    }
    clear() {
        this.toastList.splice(0, this.toastList.length);
    }
}
