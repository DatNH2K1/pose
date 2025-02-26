export default {
    copyToClipboard(str: string) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    },
    randomString(length: number) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    },
    getParamFromUrl(param: string){
        const url = new URL(window.location.href);
        return url.searchParams.get(param);
    },
    removeNullAndUndefined(obj: any) {
        Object.keys(obj).forEach((key) => (obj[key] == null || obj[key] == undefined) && delete obj[key]);
        return obj;
    },
    convertToUnderscore(str: string) {
        return str.toLowerCase().replace(/\s+/g, '_');
    },
    getLocale() {
        const html = document.querySelector('html');
        return html ? html.getAttribute('lang') : 'en';
    },
};
